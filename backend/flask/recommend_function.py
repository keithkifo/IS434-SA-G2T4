import networkx

def recommend_certificates(G, given_cert):
    # If course not in network, return no recommendations
    if G.has_node( given_cert ) == False:
        return "No recommendations. Course not in network"

    # Find all the neighbours of a given node
    neighbours_dict = {}
    for n in G.neighbors(given_cert):
        edge = G.get_edge_data(given_cert, n)
        neighbours_dict[n] = edge['weight']

    # Sort according to the edge weight
    top5_courses = sorted(neighbours_dict.items(), key=lambda pair: pair[1], reverse=True)[:5]

    return [ course_pair[0] for course_pair in top5_courses ]

