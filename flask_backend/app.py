from flask import Flask, request
import requests
import json
app = Flask(__name__)

@app.route('/recommend_jobs' , methods=['GET'] )
def recommend_jobs():
    ''' JSON response structure
    [
        {
            "Data Engineer": {
                "track": "track",
                "job_description": "some_description",
                "percentage_match": "93.55%",
                "technical_skills": [],
                "generic_skills": []
            }
        }
    ]
    '''
    # Step 1: Retrieve query payload
    payload = request.args.to_dict()

    # Step 2: Retrieve all jobs from a given sector (ICT) and track
    r = requests.get('https://is434.accredify.io/api/v1/jobs', params=payload, headers={'user-agent': 'is434.accredify.flask'})

    # Step 3: For each job, (1) Create a skills dataframe (2) Execute a Dot Product with the user's skills dataframe
    
    return ""



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5069, debug=True)