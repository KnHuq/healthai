from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import pandas as pd
from lib.formula_cal import get_formulation_label, get_grouping_label
from collections import Counter
from functools import reduce
from fuzzywuzzy import process
from config.formula import (
    integrated_formulations,
    presentation_factors,
    precipitating_factors,
    predisposing_factors,
    perpetuating_factors,
    protective_factors,
    multiple_factors,
)


app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

DATA = "/Users/kazinazmulhaque/work/QH/data/data.csv"
#DATA = "/home/asus/Downloads/data.csv"
DATA_DF = pd.read_csv(DATA)
DATA_DF["eventdate"] = pd.to_datetime(DATA_DF["eventdate"])


CATEGORIES = {
    "integrated_formulations": integrated_formulations,
    "presentation_factors": presentation_factors,
    "precipitating_factors": precipitating_factors,
    "predisposing_factors": predisposing_factors,
    "perpetuating_factors": perpetuating_factors,
    "protective_factors": protective_factors,
    "multiple_factors": multiple_factors,
}


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
        "Inclusive Integrated Formulation": 50,
    },
    {
        "month": "2019-06-01T00:00:00",
        "Absent 5 P's Formulation": 15,
        "Limited 5 P's Formulation": 25,
        "Inclusive 5 P's Formulation": 35,
        "Limited Integrated Formulation": 45,
        "Inclusive Integrated Formulation": 55,
    },
    {
        "month": "2019-07-01T00:00:00",
        "Absent 5 P's Formulation": 20,
        "Limited 5 P's Formulation": 30,
        "Inclusive 5 P's Formulation": 40,
        "Limited Integrated Formulation": 50,
        "Inclusive Integrated Formulation": 60,
    },
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
    print("formulationtable_data is called.....")
    global DATA_DF
    # Extract start_date and end_date from query parameters
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    start_date = pd.to_datetime(start_date, format="%Y-%m-%d", errors="coerce")
    end_date = pd.to_datetime(end_date, format="%Y-%m-%d", errors="coerce")

    # filter the data
    filtered_data = DATA_DF[
        (DATA_DF["eventdate"] >= start_date) & (DATA_DF["eventdate"] <= end_date)
    ]
    filtered_data.sort_values(by="eventdate", ascending=True, inplace=True)
    if filtered_data.empty:
        return jsonify([])

    filtered_data["month"] = filtered_data["eventdate"].dt.to_period("M")
    all_results = list(
        map(
            get_formulation_label,
            list(filtered_data["formulationOverallClinicalImpression"]),
        )
    )

    # group by month
    filtered_data["iformula"] = [i[0][0] for i in all_results]
    filtered_data["factors"] = [i[0][1] for i in all_results]
    filtered_data["key_words"] = [r[0][-1] for r in all_results]
    grouped_data = filtered_data.groupby("month")
    final_dict = {}
    for group_n, group_df in grouped_data:
        d = group_df["factors"].value_counts().to_dict()
        d.update((group_df["iformula"].value_counts().to_dict()))
        del d["Absent Integrated Formulation"]
        final_dict[group_n.to_timestamp().isoformat()] = d

    data = []

    for k, v in final_dict.items():
        d = {
            "month": k,
            "Limited Integrated Formulation": 0,
            "Inclusive Integrated Formulation": 0,
            "Limited 5 P's Formulation": 0,
            "Absent 5 P's Formulation": 0,
            "Inclusive 5 P's Formulation": 0,
            "Limited Integrated Formulation (%)": 0,
            "Inclusive Integrated Formulation (%)": 0,
            "Limited 5 P's Formulation (%)": 0,
            "Absent 5 P's Formulation (%)": 0,
            "Inclusive 5 P's Formulation (%)": 0,
        }
        total = sum([v for k, v in v.items()])
        d.update({k + " (%)": round((v / total) * 100, 2) for k, v in v.items()})
        d.update({k: v for k, v in v.items()})
        data.append(d)

    # response_data = {
    #     "bar_data": data,
    #     "line_data": data
    # }

    ############## TEMPLATE DATA ################

    final_template_data = []
    for group_n, group_df in grouped_data:
        template_data = {
            "Case Review": 0,
            "Transfer of Care": 0,
            "Longitudinal Summary": 0,
            "Focused Assessment plus Substance Use": 0,
            "Child and Youth Mental Health Assessment": 0,
            "Focused Assessment": 0,
            "Comprehensive Assessment": 0,
            "Forensic Comprehensive Assessment": 0,
        }

        d = group_df["Template"].value_counts().to_dict()
        template_data.update(d)
        total = sum([v for k, v in template_data.items()])
        template_data.update(
            {k + " (%)": round((v / total) * 100, 2) for k, v in template_data.items()}
        )
        template_data["month"] = group_n.to_timestamp().isoformat()
        final_template_data.append(template_data)

    ################# GROUP DATA ####################
    group_df["grouped_char_len"].value_counts().to_dict()

    final_grouped_data = []

    replaced_data_dict = {
        "0-250": "Group 1 (0-250)",
        "251-500": "Group 2 (251-500)",
        "501-1001": "Group 3 (501-1001)",
        "1001-2500": "Group 4 (1001-2500)",
        "2501-5000": "Group 5 (2501-5000)",
        "5001+": "Group 6 (5001+)",
    }

    for group_n, group_df in grouped_data:
        grouped_data_dict = {
            "0-250": 0,
            "251-500": 0,
            "501-1001": 0,
            "1001-2500": 0,
            "2501-5000": 0,
            "5001+": 0,
        }
        d = group_df["grouped_char_len"].value_counts().to_dict()
        grouped_data_dict.update(d)
        changed_grouped_data = {}
        for k, v in grouped_data_dict.items():
            changed_grouped_data[replaced_data_dict[k]] = v
        grouped_data_dict = changed_grouped_data

        total = sum([v for k, v in grouped_data_dict.items()])
        grouped_data_dict.update(
            {
                k + " (%)": round((v / total) * 100, 2)
                for k, v in grouped_data_dict.items()
            }
        )
        grouped_data_dict["month"] = group_n.to_timestamp().isoformat()

        final_grouped_data.append(grouped_data_dict)

    ######## WORD COUNT DATA ########

    word_counts_dict = {}
    for group_n, group_df in grouped_data:
        g_d = dict(Counter(sum(list(group_df["key_words"]), [])))
        word_counts_dict[group_n.to_timestamp().isoformat()] = g_d

    # only keep those keys which are present in each of the date
    v_list = []
    for k, v in word_counts_dict.items():
        v_list.append(list(v.keys()))
    # from the list of list only get the items that are present in each of the list

    common_keys = list(reduce(set.intersection, [set(item) for item in v_list]))

    final_word_counts_data = []
    for date, v in word_counts_dict.items():
        d = {}
        for c_k in common_keys:
            total = sum([v2 for k2, v2 in v.items()])
            for k2, v2 in v.items():
                if k2 in common_keys:
                    d[k2] = v2
                    d[k2 + " (%)"] = round((v2 / total) * 100, 2)
        d["month"] = date
        final_word_counts_data.append(d)

    response_data = [
        {
            "title": "Comparison of Formulations in Selected Clinical Notes Over Time",
            "data": data,
        },
        {
            "title": "Comparision of the Clinical Note Templates (notes that have text) Over Time",
            "data": final_template_data,
        },
        {
            "title": "Grouped Number of Characters in the Clinical Notes Over Time",
            "data": final_grouped_data,
        },
        {
            "title": " Comparision of the Each Key Word Present in Selected Clinical Notes Over Time",
            "data": final_word_counts_data,
        },
    ]

    return jsonify(response_data)


@app.route("/match-words", methods=["POST"])
def match_words():
    print('function called')
    data = request.json
    text = data.get("text", "").lower().strip()
    print('text: ', text)
    matches = []

    # Define a threshold for fuzzy matching
    threshold = 50

    for category, levels in CATEGORIES.items():
        for level, types in levels.items():
            for match_type, keywords in types.items():
                for keyword in keywords:
                    start = 0  # Start from the beginning of the text
                    while start < len(text):
                        # Find the keyword starting from 'start' using fuzzy matching
                        segment = text[start:]
                        best_match, score = process.extractOne(segment, [keyword])
                        print('Best Match: ', best_match, 'Score: ', score)

                        if score < threshold:
                            print('score: ', score, ',threshold: ', threshold)
                            print('score is lower than threshold')
                            break

                        index = segment.find(best_match)
                        if index == -1:
                            break

                        start += index
                        # Add the match with the current start and end indices
                        matches.append(
                            {
                                "category": category,
                                "level": level,
                                "type": match_type,
                                "keyword": keyword,
                                "start": start,
                                "end": start + len(best_match),
                            }
                        )
                        print(matches)
                        start += len(
                            best_match
                        )  # Move past the current match to find subsequent matches

    return jsonify({"matches": matches})


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
