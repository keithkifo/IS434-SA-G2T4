import pandas as pd
import numpy as np

def calculate_skill_job_match( job, user_skills ):
    response_dict = {
        "sector": job["sector"],
        "track": job["track"],
        "job_role": job["role"],
        "job_description": job["description"],
        "percent_match_overall": "",
        "percent_match_technical" : "",
        "percent_match_generic": "",
        "skills": []
    }

    # ===== Step 1: Filter into respective lists for technical or generic skills =====
    technical_skills = []
    generic_skills = []

    for skill_dict in job['proficiencies']:
        if skill_dict['skill']['type'] == 'TECHNICAL_SKILL':
            technical_skills.append( skill_dict )
        elif skill_dict['skill']['type'] == 'GENERIC_SKILL':
            generic_skills.append( skill_dict )


    # ===== Step 2: TECHNICAL SKILLS -> Create dataframe of job's skills and proficiency levels =====
    column_names = {}
    levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6']

    for skill_dict in technical_skills:
        # Extract skill level's integer
        level_int = int( skill_dict['level'][-1] )

        # Use integer to populate columns for dot product operation
        for lvl in levels[ :level_int ]:
            column_names[ f"{skill_dict['skill']['name'] } {lvl}" ] = 1

    technical_df = pd.DataFrame( column_names, index = [0] )


    # ===== Step 3: GENERIC SKILLS -> Create dataframe of job's skills and proficiency levels =====
    column_names = {}
    levels = ['Basic', 'Intermediate', 'Advanced']

    for skill_dict in generic_skills:
        level_int = levels.index( skill_dict['level'] )

        for lvl in levels[ :level_int+1 ]:
            column_names[ f"{skill_dict['skill']['name']} {lvl}"] = 1

    generic_df = pd.DataFrame( column_names, index = [0] )


    # ===== Step 3: Find user qualification status and update binary list for dot product  =====
    # User has 3 scenarios -> (1) qualified (2) under-qualified (3) not qualified

    user_generic_binary = [ 0 for _ in generic_df.columns ]
    user_technical_binary = [ 0 for _ in technical_df.columns ]

    for skill_dict in technical_skills + generic_skills:
        # To store information that is to be populated in the front-end, by default user is not qualified
        job_info_dict = {
            "skill_type": skill_dict['skill']['type'].split("_")[0].capitalize(),
            "job_level": skill_dict['level'],
            "user_level": "NA", # default
            "status": "Not Qualified" # default
        }

        # Check if the user has the skill
        job_skill = skill_dict['skill']['name']
        job_level = skill_dict['level']


        if job_skill in user_skills['technical_skills']:
            # User has the TECHNICAL skill
            user_level = user_skills['technical_skills'][ job_skill ]
            job_info_dict['user_level'] = user_level

            # Find the range of indexes in dataframe where column names match skill_level
            job_skill_indexes = [ i for i in range( len(technical_df.columns) ) if job_skill in technical_df.columns[i] ]

            if int( user_level[1] ) >= int( job_level[-1] ):
                # Scenario 1: User has the skill and matches proficiency level
                job_info_dict['status'] = "Qualified"

                # Populate binary_list indexes with 1
                for index in job_skill_indexes:
                    user_technical_binary[index] = 1

            else:
                # Scenario 2: User has the skill but does not match proficiency level
                job_info_dict['status'] = "Under Qualified"

                for index in job_skill_indexes:
                    col_name = technical_df.columns[index]

                    # Populate binary_list indexes up till index where user matches
                    if int( user_level[1] ) >= int( col_name[-1:] ):
                        user_technical_binary[index] = 1
        elif job_skill in user_skills['generic_skills']:
            # User has GENERIC skill
            user_level = user_skills['generic_skills'][ job_skill ]
            job_info_dict['user_level'] = user_level

            # Find the range of indexes in dataframe where column names match skill_level
            job_skill_indexes = [ i for i in range( len(generic_df.columns) ) if job_skill in generic_df.columns[i] ]
            
            level = ['Basic', 'Intermediate', 'Advanced']
            job_generic_int = level.index( job_level )
            user_generic_int = level.index( user_level )
            
            if user_generic_int >= job_generic_int:
                job_info_dict['status'] = "Qualified"
                for index in job_skill_indexes:
                    user_generic_binary[index] = 1
            else:
                job_info_dict['status'] = "Under Qualified"

                # Under-qualified means user has at least basic
                user_generic_binary[ job_skill_indexes[0] ] = 1

                if user_level == 'Intermediate':
                    user_generic_binary[ job_skill_indexes[1] ] = 1    


        response_dict['skills'].append(
            {
                skill_dict['skill_id'] : {
                    skill_dict['skill']['name'] : job_info_dict
                }
            }
        )

    # Step 3: (1) Append binary list to dataframe and (2) Calculate dot product
    technical_df.loc[ technical_df.shape[0] ] = user_technical_binary
    generic_df.loc[ generic_df.shape[0] ] = user_generic_binary

    technical_dotprod = np.dot( technical_df.iloc[0], technical_df.iloc[1] )
    generic_dotprod = np.dot( generic_df.iloc[0], generic_df.iloc[1] )

    combined_df = pd.concat( [technical_df, generic_df], axis=1)
    overall_dotprod = np.dot( combined_df.iloc[0], combined_df.iloc[1] )

    # Step 4: Calculate percentage of skill match
    response_dict['percent_match_overall'] = round( overall_dotprod / combined_df.shape[1], 4)
    response_dict['percent_match_technical'] = round( technical_dotprod / technical_df.shape[1], 4)
    response_dict['percent_match_generic'] = round( generic_dotprod / generic_df.shape[1], 4)
    
    return response_dict