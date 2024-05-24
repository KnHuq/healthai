from flask import Flask, request, jsonify
from flask_cors import CORS

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
    data = {
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



if __name__ == '__main__':
    app.run(port=8080)
