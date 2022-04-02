import json
import boto3
import requests
from helper_function import calculate_skill_job_match

def lambda_handler(event, context):

    response_dict = {
        "status": "",
        "data": []
    }

    try:
        # Step 1: Retrieve payload: Sector and Track
        
        if "params" in event:
            # parameters from API gateway call
            payload = {
                "sector": event["params"]["querystring"]["sector"],
                "track": event["params"]["querystring"]["track"]
            }
        else:
            # parameters from direct lambda call
            payload = {
                "sector": event["sector"],
                "track": event["track"]
            }    

        # Step 2: Retrieve all jobs from a given sector (ICT) and track
        r = requests.get('https://is434.accredify.io/api/v1/jobs', params=payload, headers={'user-agent': 'is434.accredify.flask'})
        data = r.json()['data']

        # Step 3: Retrieve user's skills
        user_skills = {
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
        
        response_dict = {
            "status": 500,
            "message": message
        }

    finally:
        return response_dict