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


@app.route("/api/formulation_data")
def get_formulationline_data():
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

        }
        total = sum([v for k,v in v.items()])
        d.update({k: round((v/total)*100,2) for k, v in v.items()})
        data.append(d)
    print (data)
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
