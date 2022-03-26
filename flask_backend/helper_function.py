import pandas as pd
import numpy as np

def calculate_skill_job_match( job, user_skills ):
    response_dict = {
        "sector": job['sector'],
        "track": job['track'],
        "job_role": job['job_role'],
        "percentage_match": "",
        "qualified": {},
        "under_qualified": {},
        "not_obtained": {}
    }

    # Step 1: Create dataframe of job's skills and proficiency levels
    column_names = {}
    levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6']
    for skill, level in job['technical_sc'].items():
        level_int = int(level[1])
        for lvl in levels[:level_int]:
            column_names[ f"{skill} {lvl}" ] = 1

    comparison_df = pd.DataFrame( column_names, index = [ job['job_role'] ] )

    # Step 2: For each job's skill, execute:
    # PART A: Find out whether user's skills fall into scenarios 1, 2 or 3
    # PART B: For the scenario user fell into, update the binary list that matches dataframe's column indexes

    user_skill_binary = [ 0 for _ in comparison_df.columns ]

    for job_skill, job_level in job['technical_sc'].items():
        if job_skill in user_skills.keys():
            user_level = user_skills[ job_skill ]

            # Find the range of indexes in dataframe where column names match skill_level
            job_skill_indexes = [ i for i in range( len(comparison_df.columns) ) if job_skill in comparison_df.columns[i] ]

            if int( user_level[1] ) >= int( job_level[1] ):
                # Scenario 1: User has the skill and matches proficiency level
                response_dict['qualified'][ job_skill ] = job_level

                # Populate binary_list indexes with 1
                for index in job_skill_indexes:
                    user_skill_binary[index] = 1

            else:
                # Scenario 2: User has the skill but does not match proficiency level
                response_dict['under_qualified'][ job_skill ] = {'job_level': job_level, 'user_level': user_level }

                for index in job_skill_indexes:
                    col_name = comparison_df.columns[index]

                    # Populate binary_list indexes up till index where user matches
                    if int( user_level[1] ) >= int( col_name[-1:] ):
                        user_skill_binary[index] = 1
        else:
            # Scenario 3: User does not have the skill
            response_dict['not_obtained'][ job_skill ] = job_level

    # Step 3: (1) Append binary list to dataframe and (2) Calculate dot product
    comparison_df.loc[ comparison_df.shape[0] ] = user_skill_binary
    dot_product = np.dot( comparison_df.iloc[0], comparison_df.iloc[1] )

    # Step 4: Calculate percentage of skill match
    response_dict['percentage_match'] = round( dot_product / comparison_df.shape[1], 4)

    return response_dict