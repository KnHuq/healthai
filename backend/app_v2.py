from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime


app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes


# @app.route('/api/simpletable_data', methods=['GET'])
# def simpletable_data():
#     print ("simpletable_data got called")
#     start = request.args.get('start')
#     end = request.args.get('end')
#     data = [
#             {"name": "Page A", "uv": 4000, "pv": 2400, "amt": 2400},
#             {"name": "Page B", "uv": 3000, "pv": 1398, "amt": 2210},
#             {"name": "Page C", "uv": 2000, "pv": 9800, "amt": 2290},
#             {"name": "Page D", "uv": 2780, "pv": 3908, "amt": 2000},
#             {"name": "Page E", "uv": 1890, "pv": 4800, "amt": 2181},
#             {"name": "Page F", "uv": 2390, "pv": 3800, "amt": 2500},
#             {"name": "Page G", "uv": 3490, "pv": 4300, "amt": 2100}
#         ]
#     columns = ["name", "uv", "pv", "amt"]

#     return jsonify({'tabledata': data, 'columns': columns})


@app.route("/api/formulation_data")
def get_formulationline_data():
    # Extract start_date and end_date from query parameters
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    print(("getting data"))
    data = [
        {
            "month": datetime(2023, 3, 30),
            "Absent 5 P's Formulation": 31.8,
            "Limited 5 P's Formulation": 31.6,
            "Inclusive 5 P's Formulation": 36.7,
            "Limited Integrated Formulation": 15.8,
            "Inclusive Integrated Formulation": 0.4,
        },
        {
            "month": datetime(2023, 9, 30),
            "Absent 5 P's Formulation": 24.3,
            "Limited 5 P's Formulation": 32.3,
            "Inclusive 5 P's Formulation": 43.4,            
            "Limited Integrated Formulation": 17.6,
            "Inclusive Integrated Formulation": 1.4,
        },
        
    ]
    # Convert the datetime objects to ISO format for JSON serialization
    for entry in data:
        entry["month"] = entry["month"].isoformat()

    print((data))
    return jsonify(data)




@app.route('/api/formulationtable_data', methods=['GET'])
def get_formulationtable_data():
    print('table data is callled')
    data = {
        "headers": [
            "Groupings of Key Formulation Words",
            "Number of Formulations (FebMar 2021)",
            "% of Formulations with Key Word Groupings (FebMar 2021)",
            "Number of Formulations (AugSept 2021)",
            "% of Formulations with Key Word Groupings (AugSept 2021)"
        ],
        "percentage": [
            { "name": "Absent 5 P's Formulation", "FebMar2021": 31.8, "AugSept2021": 24.3 },
            { "name": "Limited 5 P's Formulation", "FebMar2021": 31.6, "AugSept2021": 32.3 },
            { "name": "Inclusive 5 P's Formulation", "FebMar2021": 36.7, "AugSept2021": 43.4 },
            { "name": "Limited Integrated Formulation", "FebMar2021": 15.8, "AugSept2021": 17.6 },
            { "name": "Inclusive Integrated Formulation", "FebMar2021": 0.4, "AugSept2021": 1.4 },
        ],
        "number": [
            { "name": "Absent 5 P's Formulation", "FebMar2021": 500, "AugSept2021": 342 },
            { "name": "Limited 5 P's Formulation", "FebMar2021": 497, "AugSept2021": 454 },
            { "name": "Inclusive 5 P's Formulation", "FebMar2021": 577, "AugSept2021": 611 },
            { "name": "Limited Integrated Formulation", "FebMar2021": 249, "AugSept2021": 247 },
            { "name": "Inclusive Integrated Formulation", "FebMar2021": 7, "AugSept2021": 19 },
        ]
    }
    return jsonify(data)





if __name__ == "__main__":
    app.run(port=8080)
