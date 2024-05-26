from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import pandas as pd
from lib.formula_cal import get_formulation_label, get_grouping_label

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

DATA  = "/Users/kazinazmulhaque/work/QH/data/data.csv"
DATA_DF = pd.read_csv(DATA)
DATA_DF['eventdate'] = pd.to_datetime(DATA_DF['eventdate'])


# @app.route("/api/formulation_data")
# def get_formulationline_data():
#     global DATA_DF
#     # Extract start_date and end_date from query parameters
#     start_date = request.args.get("start_date")
#     end_date = request.args.get("end_date")
#     start_date = pd.to_datetime(start_date, format="%Y-%m-%d", errors='coerce')
#     end_date = pd.to_datetime(end_date, format="%Y-%m-%d", errors='coerce')

#     # filter the data
#     filtered_data = DATA_DF[(DATA_DF['eventdate'] >= start_date) & (DATA_DF['eventdate'] <= end_date)]
#     filtered_data.sort_values(by='eventdate', ascending=True, inplace=True)
#     if filtered_data.empty:
#         return jsonify([])
    
#     filtered_data['month'] = filtered_data['eventdate'].dt.to_period('M')
#     all_results = list(map(get_formulation_label, list(filtered_data['formulationOverallClinicalImpression'])))


#     # group by month
#     filtered_data['iformula'] = [i[0][0] for i in all_results]
#     filtered_data['factors'] = [i[0][1] for i in all_results]
#     grouped_data = filtered_data.groupby('month')
#     final_dict = {}
#     for group_n, group_df in grouped_data:
#         d = group_df['factors'].value_counts().to_dict()
#         d.update((group_df['iformula'].value_counts().to_dict()))
#         del d['Absent Integrated Formulation']
#         final_dict[group_n.to_timestamp().isoformat()] = d

#     data = []

#     for k, v in final_dict.items():
#         d = {
#             "month": k,
#             "Limited Integrated Formulation":0,
#             "Inclusive Integrated Formulation":0,
#             "Limited 5 P's Formulation":0,
#             "Absent 5 P's Formulation":0,
#             "Inclusive 5 P's Formulation":0,

#         }
#         total = sum([v for k,v in v.items()])
#         d.update({k: round((v/total)*100,2) for k, v in v.items()})
#         data.append(d)
#     print (data)
#     return jsonify(data)

table_data = [
    {
        "month": "2019-05-01T00:00:00",
        "Absent 5 P's Formulation": 10,
        "Limited 5 P's Formulation": 20,
        "Inclusive 5 P's Formulation": 30,
        "Limited Integrated Formulation": 40,
        "Inclusive Integrated Formulation": 50
    },
    {
        "month": "2019-06-01T00:00:00",
        "Absent 5 P's Formulation": 15,
        "Limited 5 P's Formulation": 25,
        "Inclusive 5 P's Formulation": 35,
        "Limited Integrated Formulation": 45,
        "Inclusive Integrated Formulation": 55
    },
    {
        "month": "2019-07-01T00:00:00",
        "Absent 5 P's Formulation": 20,
        "Limited 5 P's Formulation": 30,
        "Inclusive 5 P's Formulation": 40,
        "Limited Integrated Formulation": 50,
        "Inclusive Integrated Formulation": 60
    }
]

# @app.route('/api/formulation_data', methods=['GET'])
# def get_formulation_data():
#     start_date = request.args.get('start_date')
#     end_date = request.args.get('end_date')
    
#     # In a real scenario, you would filter the data based on start_date and end_date
#     # Here, we simply return all the data for simplicity

#     response_data = {
#         "bar_data": table_data,
#         "line_data": table_data
#     }
#     return jsonify(response_data)


@app.route("/api/formulation_data")
def formulationtable_data():
    print ('formulationtable_data is called.....')
    global DATA_DF
    # Extract start_date and end_date from query parameters
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    start_date = pd.to_datetime(start_date, format="%Y-%m-%d", errors='coerce')
    end_date = pd.to_datetime(end_date, format="%Y-%m-%d", errors='coerce')

    # filter the data
    filtered_data = DATA_DF[(DATA_DF['eventdate'] >= start_date) & (DATA_DF['eventdate'] <= end_date)]
    filtered_data.sort_values(by='eventdate', ascending=True, inplace=True)
    if filtered_data.empty:
        return jsonify([])
    
    filtered_data['month'] = filtered_data['eventdate'].dt.to_period('M')
    all_results = list(map(get_formulation_label, list(filtered_data['formulationOverallClinicalImpression'])))


    # group by month
    filtered_data['iformula'] = [i[0][0] for i in all_results]
    filtered_data['factors'] = [i[0][1] for i in all_results]
    grouped_data = filtered_data.groupby('month')
    final_dict = {}
    for group_n, group_df in grouped_data:
        d = group_df['factors'].value_counts().to_dict()
        d.update((group_df['iformula'].value_counts().to_dict()))
        del d['Absent Integrated Formulation']
        final_dict[group_n.to_timestamp().isoformat()] = d

    data = []

    for k, v in final_dict.items():
        d = {
            "month": k,
            "Limited Integrated Formulation":0,
            "Inclusive Integrated Formulation":0,
            "Limited 5 P's Formulation":0,
            "Absent 5 P's Formulation":0,
            "Inclusive 5 P's Formulation":0,
            "Limited Integrated Formulation (%)":0,
            "Inclusive Integrated Formulation (%)":0,
            "Limited 5 P's Formulation (%)":0,
            "Absent 5 P's Formulation (%)":0,
            "Inclusive 5 P's Formulation (%)":0,


        }
        total = sum([v for k,v in v.items()])
        d.update({k+ " (%)": round((v/total)*100,2) for k, v in v.items()})
        d.update({k: v for k, v in v.items()})
        data.append(d)
        
    response_data = {
        "bar_data": data,
        "line_data": data
    }
    return jsonify(response_data)


 





# @app.route('/api/formulationtable_data', methods=['GET'])
# def get_formulationtable_data():
#     print('table data is callled')
#     data = {
#         "headers": [
#             "Groupings of Key Formulation Words",
#             "Number of Formulations (FebMar 2021)",
#             "% of Formulations with Key Word Groupings (FebMar 2021)",
#             "Number of Formulations (AugSept 2021)",
#             "% of Formulations with Key Word Groupings (AugSept 2021)"
#         ],
#         "percentage": [
#             { "name": "Absent 5 P's Formulation", "FebMar2021": 31.8, "AugSept2021": 24.3 },
#             { "name": "Limited 5 P's Formulation", "FebMar2021": 31.6, "AugSept2021": 32.3 },
#             { "name": "Inclusive 5 P's Formulation", "FebMar2021": 36.7, "AugSept2021": 43.4 },
#             { "name": "Limited Integrated Formulation", "FebMar2021": 15.8, "AugSept2021": 17.6 },
#             { "name": "Inclusive Integrated Formulation", "FebMar2021": 0.4, "AugSept2021": 1.4 },
#         ],
#         "number": [
#             { "name": "Absent 5 P's Formulation", "FebMar2021": 500, "AugSept2021": 342 },
#             { "name": "Limited 5 P's Formulation", "FebMar2021": 497, "AugSept2021": 454 },
#             { "name": "Inclusive 5 P's Formulation", "FebMar2021": 577, "AugSept2021": 611 },
#             { "name": "Limited Integrated Formulation", "FebMar2021": 249, "AugSept2021": 247 },
#             { "name": "Inclusive Integrated Formulation", "FebMar2021": 7, "AugSept2021": 19 },
#         ]
#     }
#     return jsonify(data)



# table_data = [{'month': '2019-05-01T00:00:00',
#   'Limited Integrated Formulation': 10,
#   'Inclusive Integrated Formulation': 0,
#   "Limited 5 P's Formulation": 84,
#   "Absent 5 P's Formulation": 33,
#   "Inclusive 5 P's Formulation": 31,
#   'Limited Integrated Formulation (%)': 6.33,
#   'Inclusive Integrated Formulation (%)': 0,
#   "Limited 5 P's Formulation (%)": 53.16,
#   "Absent 5 P's Formulation (%)": 20.89,
#   "Inclusive 5 P's Formulation (%)": 19.62},
#  {'month': '2019-06-01T00:00:00',
#   'Limited Integrated Formulation': 215,
#   'Inclusive Integrated Formulation': 0,
#   "Limited 5 P's Formulation": 1016,
#   "Absent 5 P's Formulation": 535,
#   "Inclusive 5 P's Formulation": 404,
#   'Limited Integrated Formulation (%)': 9.91,
#   'Inclusive Integrated Formulation (%)': 0,
#   "Limited 5 P's Formulation (%)": 46.82,
#   "Absent 5 P's Formulation (%)": 24.65,
#   "Inclusive 5 P's Formulation (%)": 18.62},
#  {'month': '2019-07-01T00:00:00',
#   'Limited Integrated Formulation': 204,
#   'Inclusive Integrated Formulation': 0,
#   "Limited 5 P's Formulation": 1001,
#   "Absent 5 P's Formulation": 609,
#   "Inclusive 5 P's Formulation": 399,
#   'Limited Integrated Formulation (%)': 9.22,
#   'Inclusive Integrated Formulation (%)': 0,
#   "Limited 5 P's Formulation (%)": 45.23,
#   "Absent 5 P's Formulation (%)": 27.52,
#   "Inclusive 5 P's Formulation (%)": 18.03}]

# @app.route('/api/formulationtable_data', methods=['GET'])
# def get_table_data():
#     return jsonify(table_data)


if __name__ == "__main__":
    app.run(port=8080)
