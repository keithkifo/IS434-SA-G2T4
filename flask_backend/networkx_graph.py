import requests
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np


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
# sortBy_cert is the list of users that have taken this course
sortBy_cert = {}
node_attr = {}
# single_node_attr ={}
for row in result['data']:
    if len(row) > 1 and row['certificates']!=None:

        for cert in row['certificates']:
                if cert in sortBy_cert:
                    sortBy_cert[cert].append(row['user_id'])
                else:
                    sortBy_cert[cert] = [row['user_id']]
# print(sortBy_cert)
for cert in sortBy_cert:
    node_attr[cert.strip()] = {"weight": len(sortBy_cert[cert])}
# print(node_attr)

# Step 3: Create edges and its attributes
# Graph_Dict contains UNIQUE PAIRs of courses in form of dictionary
# (course_code1, course_code2): int
# int is the frequency of this 2 courses taken together
# take note that with this current set of data, there is no frequency >1
# can use the data in notes to test this portion of code
graph_Dict = {}
for certificate_array in certificate_arrays:
    if len(certificate_array) > 1:
        for i in range(len(certificate_array)-1):
            current_cert = certificate_array[i].strip()
            if (current_cert, certificate_array[i+1].strip()) in graph_Dict:
                graph_Dict[(current_cert, certificate_array[i+1].strip())] += 1
            else:
                graph_Dict[(current_cert, certificate_array[i+1].strip())] = 1

            second_loop_row = len(certificate_array)-1-i
            j = len(certificate_array)-1  # 3,2
            while second_loop_row > 1:  # 2,1
                if (current_cert, certificate_array[j].strip()) in graph_Dict:
                    graph_Dict[(current_cert, certificate_array[j].strip())] += 1
                else:
                    graph_Dict[(current_cert, certificate_array[j].strip())] = 1
                second_loop_row -= 1
                j -= 1


# Step 4: Create dataframe to create a networkx graph
# this format is to create panda dataframe
dataframe_dict = {
    'source': [],
    'target': [],
    'weight': []
}
for tuple_key, value in graph_Dict.items():
    source = tuple_key[0]
    target = tuple_key[1]
    dataframe_dict['source'].append(source)
    dataframe_dict['target'].append(target)
    dataframe_dict['weight'].append(value)
# print(graph_Dict)

df = pd.DataFrame.from_dict(dataframe_dict)

# Step 5: Create the graph
# creates the graph from dataframe_dict
G = nx.from_pandas_edgelist(df, 'source', 'target', edge_attr='weight')

# adding the nodes attributes
G.add_nodes_from(node_attr)
nx.set_node_attributes(G, node_attr)  # add weight to nodes
# test = nx.get_node_attributes(G, "Graduate Certificate in LegalTech")
# print(nx.get_node_attributes(G, 'weight'))
# Generate gml file
nx.write_gml(G, "graph.gml")
