from urllib import response
from flask import Flask, request
import requests
import json
import sys
from helper_function import calculate_skill_job_match
app = Flask(__name__)

@app.route('/recommend_jobs' , methods=['GET'] )
def recommend_jobs():
    ''' Sample JSON response structure
    [
        {
            "sector": "Infocomm Technology",
            "track": "Data and Artificial Intelligence",
            "job_role": "Artificial Intelligence/Machine Learning Engineer",
            "percentage_match": 0.8472,
            "qualified": {
                "Business Needs Analysis": "L4",
            },
            "under_qualified": {
                "Data Design": {
                    "job_level": "L4",
                    "user_level": "L3"
            },
            "not_obtained": {
                "Computer Vision Technology": "L4",
            }
        },
    ]
    '''
    response_dict = {
        "status": "",
        "data": []
    }

    try:
        # Step 1: Retrieve payload: Sector and Track 
        payload = request.args.to_dict()

        # Step 2: Retrieve all jobs from a given sector (ICT) and track
        # r = requests.get('https://is434.accredify.io/api/v1/jobs', params=payload, headers={'user-agent': 'is434.accredify.flask'})
        # data = r.json()['data']
        with open("data_and_ai.json", "r") as read_file:
            data = json.load(read_file)

        # Step 3: Retrieve user's skills
        # r = requests.get('some_endpoint')
        # user_skills = r.json()['data']

        user_skills = {
            "Business Needs Analysis": "L4",
            "Cloud Computing": "L4",
            "Computational Modelling": "L3",
            "Configuration Tracking": "L3",
            "Data Design": "L3",
            "Data Engineering": "L3",
            "Data Governance": "L3",
            "Data Strategy ": "L3",
            "Database Administration": "L3",
            "Emerging Technology Synthesis": "L4",
            "Intelligent Reasoning": "L5",
            "Pattern Recognition Systems": "L3",
            "Project Management": "L4",
            "Self-Learning Systems": "L4",
            "Stakeholder Management ": "L4",
            "System Integration": "L4",
            "Test Planning": "L3",
            "Text Analytics and Processing": "L4"
        }

        # Step 3: For each job, (1) Create a skills dataframe (2) Execute a Dot Product with the user's skills dataframe
        jobs_match_list = []

        for job in data:
            jobs_match_dict = calculate_skill_job_match(job, user_skills)
            jobs_match_list.append( jobs_match_dict )

        jobs_match_sorted = sorted(jobs_match_list, key = lambda job : job['percentage_match'], reverse=True)

        response_dict["status"] = 200
        response_dict["jobs_match_sorted"] = jobs_match_sorted

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
        response = json.dumps( response_dict )
        return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5069, debug=True)