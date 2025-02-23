from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import pandas as pd
from lib.formula_cal import get_formulation_label, get_grouping_label
from lib.formula_cal_LLM import get_formulation_label_LLM
from collections import Counter, defaultdict
from functools import reduce
from tqdm import tqdm
import numpy as np
from config.server import HOST, PORT, DEBUG, ALLOWED_ORIGINS, DATA_PATH
import ast
import os
import glob
app = Flask(__name__)

# Update CORS configuration using config
CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})



def load_chunked_data(data_path):
    # Get all CSV files in the chunks directory
    data_path = os.path.join(data_path,'*.csv')
    chunk_files = glob.glob(data_path)
    
    # Read and concatenate all chunks
    dfs = []
    for file in chunk_files:
        df = pd.read_csv(file)
        dfs.append(df)
    
    # Combine all chunks
    combined_df = pd.concat(dfs, ignore_index=True)
    
    # Convert clinicalNoteDate to datetime
    combined_df['clinicalNoteDate'] = pd.to_datetime(combined_df['clinicalNoteDate'], format='%d/%m/%Y')
    
    # Calculate text length and create groups
    combined_df['char_len'] = combined_df['progressNote'].str.len()
    
    def get_char_len_group(length):
        if length <= 250:
            return '0-250'
        elif length <= 500:
            return '251-500'
        elif length <= 1001:
            return '501-1001'
        elif length <= 2500:
            return '1001-2500'
        elif length <= 5000:
            return '2501-5000'
        else:
            return '5001+'
    
    combined_df['grouped_char_len'] = combined_df['char_len'].apply(get_char_len_group)
    
    # Parse the extracted_values column from string to dictionary
    combined_df['extracted_values'] = combined_df['extracted_values'].apply(ast.literal_eval)

    # rename clinicalNoteDate to eventdate
    combined_df.rename(columns={'clinicalNoteDate': 'eventdate'}, inplace=True)

    # rename encounterFacility to facility
    combined_df.rename(columns={'encounterFacility': 'facility'}, inplace=True)

    # extracted_values is a dictionary we want to create a new column for each key in the dictionary
    for key in combined_df['extracted_values'][0].keys():
        combined_df[key] = combined_df['extracted_values'].apply(lambda x: x[key]['count'])
    print (combined_df.shape)
    return combined_df


# Load data using config path
DATA_DF = load_chunked_data(DATA_PATH)
# rename clinicalNoteDate to eventdate
DATA_DF.rename(columns={'clinicalNoteDate': 'eventdate'}, inplace=True)

print (DATA_DF.head())
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

def normalize_facility_name(name):
    if pd.isna(name) or not isinstance(name, str):
        return None
        
    # Common replacements for HTML entities and special characters
    replacements = {
        '&amp;': '&',
        '&amp;amp;': '&',
        '&AMP;': '&',
        '&': 'and',
        '(THE)': '',
        '&amp;amp;amp;': '&'
    }
    
    # Apply replacements
    cleaned_name = name.strip()
    for old, new in replacements.items():
        cleaned_name = cleaned_name.replace(old, new)
    
    # Remove multiple spaces and standardize format
    cleaned_name = ' '.join(cleaned_name.split())
    
    # Convert to title case but keep common abbreviations
    words = cleaned_name.split()
    cleaned_words = []
    for word in words:
        if word.upper() in ['MHS', 'CCU', 'CMHS']:  # Add more abbreviations as needed
            cleaned_words.append(word.upper())
        else:
            cleaned_words.append(word.title())
    
    cleaned_name = ' '.join(cleaned_words)
    
    # Remove trailing/leading special characters
    cleaned_name = cleaned_name.strip(' -_')
    
    return cleaned_name if cleaned_name else None

@app.route("/api/initial_state", methods=['GET'])
def initial_state():
    global DATA_DF
    
    # Clean and normalize existing facility names
    DATA_DF['facility'] = DATA_DF['facility'].apply(normalize_facility_name)
    
    # Get unique facilities, filtering out None values
    facilities = [f for f in DATA_DF['facility'].unique() 
                 if f is not None]
    
    # Sort facilities alphabetically
    facilities.sort()
    
    # Debug print to check the cleaned names
    print("\nUnique Facility Names after cleaning:")
    for f in facilities:
        print(f)
    
    # Create facility mapping with normalized names
    facility_mapping = {idx: facility for idx, facility in enumerate(facilities, 1)}
    
    # Create date ranges with normalized names
    facility_date_ranges = {}
    for idx, facility in facility_mapping.items():
        facility_data = DATA_DF[DATA_DF['facility'] == facility]
        min_date = facility_data['eventdate'].min()
        max_date = facility_data['eventdate'].max()
        
        facility_date_ranges[idx] = {
            "minDate": min_date.strftime("%Y-%m-%d"),
            "maxDate": max_date.strftime("%Y-%m-%d"),
            "name": facility
        }
    
    response_data = {
        "facilityMapping": facility_mapping,
        "facilityDateRanges": facility_date_ranges
    }

    return jsonify(response_data)




@app.route("/api/formulation_data", methods=['GET'])
def formulationtable_data():
    print('formulationtable_data is called.....')
    global DATA_DF

    # Get facility index from query parameters and convert to int
    facility_idx = int(request.args.get("facility"))
    
    # Get facility name from the mapping (recreate mapping)
    facilities = [f for f in DATA_DF['facility'].unique() 
                 if isinstance(f, str) and not pd.isna(f)]
    facilities.sort()
    facility_mapping = {idx: facility for idx, facility in enumerate(facilities, 1)}
    
    # Get actual facility name
    facility_name = facility_mapping[facility_idx]

    # Extract start_date and end_date from query parameters
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    start_date = pd.to_datetime(start_date, format="%Y-%m-%d", errors='coerce')
    end_date = pd.to_datetime(end_date, format="%Y-%m-%d", errors='coerce')
    
    # Create a copy of the filtered data to avoid SettingWithCopyWarning
    filtered_data = DATA_DF[(DATA_DF['eventdate'] >= start_date) & 
                           (DATA_DF['eventdate'] <= end_date) &
                           (DATA_DF['facility'] == facility_name)].copy()
    
    filtered_data.sort_values(by='eventdate', ascending=True, inplace=True)
    
    if filtered_data.empty:
        print ('filtered_data is empty')
        return jsonify([])
    
    filtered_data['month'] = filtered_data['eventdate'].dt.to_period('M')
    all_texts = list(filtered_data['progressNote'])
    print (f' length of all_texts: {len(all_texts)}')
    all_results = list(map(get_formulation_label, all_texts))

    filtered_data['iformula'] = [i[0][0] for i in all_results]
    filtered_data['factors'] = [i[0][1] for i in all_results]
    filtered_data['key_words'] = [r[0][-2] for r in all_results]
    filtered_data['ps_stat'] = [r[0][-1] for r in all_results]
    
    ps_dict = defaultdict(list)
    for v_dict in filtered_data['ps_stat']:
        for k,v in v_dict.items():
            ps_dict[k].append(v)
    c_df = pd.DataFrame(ps_dict)
    cols_list = ['integrated', 'perpetuating','precipitating', 'predisposing', 'presentation', 'protective']
    key_word_values = c_df[cols_list].values
    llm_values = filtered_data[cols_list].values
    key_p_llm_values = np.maximum(key_word_values[:llm_values.shape[0],:], llm_values)


    ## only LLM values
    llm_values_ps = np.count_nonzero(llm_values[1:],axis=1).tolist()
    llm_integrated = llm_values[:,0].tolist()
    zipped_ip_llm = zip(llm_integrated, llm_values_ps)

    final_i_llm = []
    final_p_llm = []
    for integrated, number_of_presented_formulation in zipped_ip_llm:
        if number_of_presented_formulation < 2:
            final_i_llm.append("Absent 5 P's Formulation")
            final_p_llm.append('Absent Integrated Formulation')
        elif number_of_presented_formulation >=2 and number_of_presented_formulation < 4:       
            final_i_llm.append("Limited 5 P's Formulation")
            final_p_llm.append("Absent Integrated Formulation")
        elif number_of_presented_formulation >= 4:
            if integrated == 0:
                final_i_llm.append("Inclusive 5 P's Formulation")
                final_p_llm.append("Absent Integrated Formulation")
            else:
                final_i_llm.append("Inclusive 5 P's Formulation")
                final_p_llm.append("Inclusive Integrated Formulation")

    
    filtered_data['iformula_LLM'] = filtered_data['iformula'].copy()
    filtered_data['factors_LLM'] = filtered_data['factors'].copy()
    filtered_data['iformula_LLM_words'] = filtered_data['iformula'].copy()
    filtered_data['factors_LLM_words'] = filtered_data['factors'].copy()

    filtered_data['iformula_LLM'][:len(final_i_llm)] = final_i_llm
    filtered_data['factors_LLM'][:len(final_p_llm)] = final_p_llm


    # now k and llm data

    key_p_llm_values_ps = np.count_nonzero(key_p_llm_values[1:],axis=1).tolist()
    key_p_llm_values_integrated = key_p_llm_values[:,0].tolist()
    zipped_ip_llm = zip(key_p_llm_values_integrated, key_p_llm_values_ps)

    final_i_llm_k = []
    final_p_llm_k = []
    for integrated, number_of_presented_formulation in zipped_ip_llm:
        if number_of_presented_formulation < 2:
            final_i_llm_k.append("Absent 5 P's Formulation")
            final_p_llm_k.append('Absent Integrated Formulation')
        elif number_of_presented_formulation >=2 and number_of_presented_formulation < 4:       
            final_i_llm_k.append("Limited 5 P's Formulation")
            final_p_llm_k.append("Absent Integrated Formulation")
        elif number_of_presented_formulation >= 4:
            if integrated == 0:
                final_i_llm_k.append("Inclusive 5 P's Formulation")
                final_p_llm_k.append("Absent Integrated Formulation")
            else:
                final_i_llm_k.append("Inclusive 5 P's Formulation")
                final_p_llm_k.append("Inclusive Integrated Formulation")

    filtered_data['iformula_LLM_words'][:len(final_i_llm_k)] = final_i_llm_k
    filtered_data['factors_LLM_words'][:len(final_p_llm_k)] = final_p_llm_k



    grouped_data = filtered_data.groupby('month')

    final_dict = {}
    for group_n, group_df in grouped_data:
        d = group_df['factors'].value_counts().to_dict()
        d.update((group_df['iformula'].value_counts().to_dict()))
        # drop 'Absent Integrated Formulation' if it exists
        d.pop('Absent Integrated Formulation', None)

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


    final_dict_LLM = {}
    for group_n, group_df in grouped_data:
        d = group_df['factors_LLM'].value_counts().to_dict()
        d.update((group_df['iformula_LLM'].value_counts().to_dict()))
        # drop 'Absent Integrated Formulation' if it exists
        d.pop('Absent Integrated Formulation', None)
        final_dict_LLM[group_n.to_timestamp().isoformat()] = d

    data_LLM = []
    for k, v in final_dict_LLM.items():
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
        data_LLM.append(d)


    final_dict_LLM_words = {}
    for group_n, group_df in grouped_data:
        d = group_df['factors_LLM_words'].value_counts().to_dict()
        d.update((group_df['iformula_LLM_words'].value_counts().to_dict()))
        #  drop 'Absent Integrated Formulation' if it exists
        d.pop('Absent Integrated Formulation', None)
        final_dict_LLM_words[group_n.to_timestamp().isoformat()] = d

    data_LLM_words = []
    for k, v in final_dict_LLM_words.items():
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
        data_LLM_words.append(d)



    ################# GROUP DATA ####################

    grouped_data = filtered_data.groupby('month')
    final_grouped_data = []

    # Define the character length ranges
    char_ranges = {
        '0-250': "Notes less than 250 characters",
        '251-500': "Notes with 251-500 characters",
        '501-1001': "Notes with 501-1001 characters",
        '1001-2500': "Notes with 1001-2500 characters",
        '2501-5000': "Notes with 2501-5000 characters",
        '5001+': "Notes with 5001+ characters"
    }

    for group_n, group_df in grouped_data:
        d = group_df['grouped_char_len'].value_counts().to_dict()
        
        grouped_data_dict = {
            "Notes less than 250 characters": 0,
            "Notes with 251-500 characters": 0,
            "Notes with 501-1001 characters": 0,
            "Notes with 1001-2500 characters": 0,
            "Notes with 2501-5000 characters": 0,
            "Notes with 5001+ characters": 0
        }
        
        # Update counts with actual data
        for k, v in d.items():
            if k in char_ranges:
                grouped_data_dict[char_ranges[k]] = v

        # Calculate percentages using a list of keys to avoid dictionary size change
        total = sum(grouped_data_dict.values())
        if total > 0:
            keys = list(grouped_data_dict.keys())  # Create a list of keys first
            for k in keys:
                grouped_data_dict[k + " (%)"] = round((grouped_data_dict[k] / total) * 100, 2)

        grouped_data_dict['month'] = group_n.to_timestamp().isoformat()
        final_grouped_data.append(grouped_data_dict)

    ######## WORD COUNT DATA ########
    word_counts_dict = {}
    for group_n, group_df in grouped_data:
        # Ensure key_words is a list before trying to count
        if 'key_words' in group_df.columns:
            words = [word for words in group_df['key_words'].dropna() for word in words if words]
            word_counts = Counter(words)
            word_counts_dict[group_n.to_timestamp().isoformat()] = dict(word_counts)

    # Get common words across all months
    if word_counts_dict:
        
        # all_words = set.intersection(*[set(d.keys()) for d in word_counts_dict.values()])
        #@ get all the words from the values of each key
        all_words = set.union(*[set(d.keys()) for d in word_counts_dict.values()])
        
        final_word_counts_data = []
        for date, counts in word_counts_dict.items():
            d = {'month': date}
            total = sum(counts.values())
            for word in all_words:
                count = counts.get(word, 0)
                d[word] = count
                d[f"{word} (%)"] = round((count / total) * 100, 2) if total > 0 else 0
            final_word_counts_data.append(d)
    else:
        final_word_counts_data = []

    # import pdb; pdb.set_trace()
    response_data = [

        {"title": "Comparison of Formulations in Selected Clinical Notes Over Time (Word Search)",
        "data": data},
        {"title": "Comparison of Formulations in Selected Clinical Notes Over Time (NLP)",
        "data": data_LLM},
        {"title": "Number of Characters in the Clinical Notes",
        "data": final_grouped_data},
        { "title" : " Comparision of the Key Word Present in Clinical Notes",
         "data": final_word_counts_data}
    ]


    return jsonify(response_data)



if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)
