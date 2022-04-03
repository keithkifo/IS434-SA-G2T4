def recommend_certificates(given_cert, node_attr, graph_dict, ):

    # top5_pairs = []
    pair_dict = {}
    top_5_recommendations = []

    if given_cert not in node_attr:
        print("Invalid course")
        
    # Find all neighboring courses of the course
    pairing_list = [pair for pair in graph_dict if given_cert in pair]

    # Find the weight and sort them in descending order
    for pair in pairing_list:
        pair_dict[pair] = graph_dict[pair]

    pair_dict_sorted = dict(sorted(pair_dict.items(), key=lambda item: item[1], reverse=True))

    # Returns No Recommendation if course has no link
    if len(pair_dict_sorted) == 0:
        return []
    # Returns top 5 pairs with the highest edge weight
    else:
        for tuple in list(pair_dict_sorted.keys())[0:5]:
            if tuple[0] != given_cert and tuple[0]!=given_cert:
                top_5_recommendations.append(tuple[0])
            elif tuple[1] != given_cert and tuple[1]!=given_cert:
                top_5_recommendations.append(tuple[1])

    return top_5_recommendations

