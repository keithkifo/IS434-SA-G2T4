import json
import requests
import pandas as pd
import networkx as nx

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
            if (current_cert, certificate_array[i+1].strip()) in graph_dict: #(a,b)
                graph_dict[(current_cert, certificate_array[i+1].strip())] += 1
            else: #(b,a)
                if(certificate_array[i+1].strip(), current_cert) in graph_dict:
                    graph_dict[(certificate_array[i+1].strip(), current_cert)] += 1
                else:
                    graph_dict[(current_cert, certificate_array[i+1].strip())] = 1

            second_loop_row = len(certificate_array)-1-i
            j = len(certificate_array)-1  # 3,2
            while second_loop_row > 1:  # 2,1
                if (current_cert, certificate_array[j].strip()) in graph_dict:
                    graph_dict[(current_cert, certificate_array[j].strip())] += 1
                else:
                    if(certificate_array[j].strip(), current_cert) in graph_dict:
                        graph_dict[(certificate_array[j].strip(), current_cert)] += 1
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

# Store as external files
nx.write_gml(G, "graph.gml")


with open('node_attr.json', 'w') as outfile:
    json.dump(node_attr, outfile)