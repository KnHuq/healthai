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
def get_formulationbar_data():
    # Extract start_date and end_date from query parameters
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    print(("getting data"))
    data = [
        {
            "month": datetime(2023, 2, 1),
            "Absent 5 P's Formulation": 500,
            "Inclusive 5 P's Formulation": 590,
            "Limited 5 P's Formulation": 497,
            "Inclusive Integrated Formulation": 7,
            "Limited Integrated Formulation": 5,
        },
        {
            "month": datetime(2023, 3, 1),
            "Absent 5 P's Formulation": 342,
            "Inclusive 5 P's Formulation": 577,
            "Limited 5 P's Formulation": 498,
            "Limited Integrated Formulation": 249,
            "Inclusive Integrated Formulation": 19,
        },
        {
            "month": datetime(2023, 4, 1),
            "Absent 5 P's Formulation": 600,
            "Limited 5 P's Formulation": 597,
            "Inclusive 5 P's Formulation": 611,
            "Limited Integrated Formulation": 247,
            "Inclusive Integrated Formulation": 19,
        },
        {
            "month": datetime(2023, 12, 1),
            "Absent 5 P's Formulation": 454,
            "Limited 5 P's Formulation": 797,
            "Inclusive 5 P's Formulation": 611,
            "Limited Integrated Formulation": 247,
            "Inclusive Integrated Formulation": 19,
        },
    ]
    # Convert the datetime objects to ISO format for JSON serialization
    for entry in data:
        entry["month"] = entry["month"].isoformat()

    print((data))
    return jsonify(data)


if __name__ == "__main__":
    app.run(port=8080)
