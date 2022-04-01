from urllib import response
from flask import Flask, request
import requests
import json
import sys
from helper_function import calculate_skill_job_match
app = Flask(__name__)

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
        # r = requests.get('some_endpoint')
        # user_skills = r.json()['data']

        with open("./data/sample_user.json", "r") as read_file:
            user_skills = json.load(read_file)

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5069, debug=True)