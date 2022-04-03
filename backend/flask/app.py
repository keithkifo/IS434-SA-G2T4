from distutils.util import run_2to3
from urllib import response

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
cors = CORS(app)

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
        # Retrieve Query Parameter course_name
        queries = request.args.to_dict()
        course_name = queries['course_name'] # CPR(HANDS-ONLY)%2BAED PROVIDER on Postman

        # Load graph from file
        G = nx.read_gml('../graph_generate/graph.gml')

        # Retrieve Course Recommendations
        top_5_recommendations = recommend_certificates( G, course_name )

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