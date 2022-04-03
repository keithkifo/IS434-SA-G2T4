from distutils.util import run_2to3
from urllib import response

from numpy import rad2deg
from flask import Flask, request
import requests
import pandas as pd
import networkx as nx
import json
import sys
from helper_function import calculate_skill_job_match
from recommend_function import recommend_certificates
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route('/user_skill_profile', methods=['GET'] )
def skill_profile():
    user_skills = {
            "id": 1,
            "technical_skills" : {
                "Business Needs Analysis": "L4",
                "Cloud Computing": "L4",
                "Computational Modelling": "L3",
                "Configuration Tracking": "L3",
                "Data Design": "L3",
                "Data Engineering": "L3",
                "Data Governance": "L3",
                "Data Strategy": "L3",
                "Database Administration": "L3",
                "Emerging Technology Synthesis": "L4",
                "Intelligent Reasoning": "L5",
                "Pattern Recognition Systems": "L3",
                "Project Management": "L4",
                "Self-Learning Systems": "L4",
                "Stakeholder Management": "L4",
                "System Integration": "L4",
                "Test Planning": "L3",
                "Text Analytics and Processing": "L4"
            },
            "generic_skills" : { 
                "Communication" : "Intermediate",
                "Computational Thinking": "Intermediate",
                "Developing People": "Basic",
                "Leadership": "Basic",
                "Lifelong Learning": "Basic"
            }
        }
    response_dict = {
        "status": 200,
        "data": [ user_skills ]
    }
    response = json.dumps( response_dict, indent=4 )
    return response

@app.route('/recommend_jobs' , methods=['GET'] )
def recommend_jobs():
    response_dict = {
        "status": "",
        "data": []
    }

    try:
        # Step 1: Retrieve payload: Sector and Track 
        payload = request.args.to_dict()

        # Step 2: Retrieve all jobs from a given sector (ICT) and track
        r = requests.get('https://is434.accredify.io/api/v1/jobs', params=payload, headers={'user-agent': 'is434.accredify.flask'})
        data = r.json()['data']

        # Step 3: Retrieve user's skills
        r2 = requests.get('http://localhost:5069/user_skill_profile')
        user_skills = r2.json()['data'][0]

        # Step 3: For each job, (1) Create a skills dataframe (2) Execute a Dot Product with the user's skills dataframe
        jobs_match_list = []

        for job in data:
            jobs_match_dict = calculate_skill_job_match(job, user_skills)
            jobs_match_list.append( jobs_match_dict )

        jobs_match_sorted = sorted(jobs_match_list, key = lambda job : job['percent_match_overall'], reverse=True)

        response_dict["status"] = 200
        response_dict["data"] = jobs_match_sorted

    except Exception as e:
        # Error has occurred
        message = f"Unexpected { type(e) }: { str(e) }"
        print( message, file=sys.stderr)
        response_dict = {
            "status": 500,   
            "message": message
        }

    finally:
        # Step 4: Convert into JSON string and return
        response = json.dumps( response_dict, indent=4 )

        with open('new_response.json', 'w') as outfile:
            outfile.write( json.dumps( response_dict, indent = 4) )
        
        return response


@app.route('/recommend_courses' , methods=['GET'] )
def recommend_courses():
    response_dict = {
        "status": "",
        "data": []
    }

    try:
        # Step 1: Call the API to get data
        response = requests.get(
            "https://is434.accredify.io/api/v1/recommendations?clearCache=True")
        result = response.json()

        # Putting certificates into an array, certificate_array, taken by unique user
        certificate_arrays = []
        for row in result['data']:
            cert_array = row.get('certificates')
            if cert_array != None:
                certificate_arrays.append(cert_array)

        # print(certificate_arrays)
        # Step 2: Creaet node attributes
        # 'weight'
        # single_node_attr is those certificates with no relations to other certificates
        # sortby_cert is the list of users that have taken this course
        sortby_cert = {}
        node_attr = {}
        # single_node_attr ={}
        for row in result['data']:
            if len(row) > 1 and row['certificates']!=None:

                for cert in row['certificates']:
                        if cert in sortby_cert:
                            sortby_cert[cert].append(row['user_id'])
                        else:
                            sortby_cert[cert] = [row['user_id']]
        # print(sortby_cert)
        for cert in sortby_cert:
            node_attr[cert.strip()] = {"weight": len(sortby_cert[cert])}
        # print(node_attr)

        # Step 3: Create edges and its attributes
        # graph_dict contains UNIQUE PAIRs of courses in form of dictionary
        # (course_code1, course_code2): int
        # int is the frequency of this 2 courses taken together
        # take note that with this current set of data, there is no frequency >1
        # can use the data in notes to test this portion of code
        graph_dict = {}
        for certificate_array in certificate_arrays:
            if len(certificate_array) > 1:
                for i in range(len(certificate_array)-1):
                    current_cert = certificate_array[i].strip()
                    if (current_cert, certificate_array[i+1].strip()) in graph_dict:
                        graph_dict[(current_cert, certificate_array[i+1].strip())] += 1
                    else:
                        graph_dict[(current_cert, certificate_array[i+1].strip())] = 1

                    second_loop_row = len(certificate_array)-1-i
                    j = len(certificate_array)-1  # 3,2
                    while second_loop_row > 1:  # 2,1
                        if (current_cert, certificate_array[j].strip()) in graph_dict:
                            graph_dict[(current_cert, certificate_array[j].strip())] += 1
                        else:
                            graph_dict[(current_cert, certificate_array[j].strip())] = 1
                        second_loop_row -= 1
                        j -= 1


        # Step 4: Create dataframe to create a networkx graph
        # this format is to create panda dataframe
        dataframe_dict = {
            'source': [],
            'target': [],
            'weight': []
        }
        for tuple_key, value in graph_dict.items():
            source = tuple_key[0]
            target = tuple_key[1]
            dataframe_dict['source'].append(source)
            dataframe_dict['target'].append(target)
            dataframe_dict['weight'].append(value)
        # print(graph_dict)

        df = pd.DataFrame.from_dict(dataframe_dict)

        # Step 5: Create the graph
        # creates the graph from dataframe_dict
        G = nx.from_pandas_edgelist(df, 'source', 'target', edge_attr='weight')

        #adding the nodes attributes
        G.add_nodes_from(node_attr)
        nx.set_node_attributes(G, node_attr) #add weight to nodes
        nx.write_gml(G, "graph.gml")

        # Recommendation
        queries = request.args.to_dict()
        top_5_recommendations = recommend_certificates( queries['course_name'], node_attr, graph_dict)

        response_dict["status"] = 200
        response_dict["data"] = top_5_recommendations

    except Exception as e:
        # Error has occurred
        message = f"Unexpected { type(e) }: { str(e) }"
        
        response_dict = {
            "status": 500,
            "message": message
        }

    finally:
        return response_dict

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5069, debug=True)