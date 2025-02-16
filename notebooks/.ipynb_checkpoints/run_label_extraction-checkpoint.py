
import streamlit as st
from ollama import Client
import json
import os
import pandas as pd
from collections import Counter
import numpy as np

# Default settings if file not found
DEFAULT_SETTINGS = {
    "model": "llama3.1:latest",
    # "model": "llama3.1:70b",
    "temperature": 0.0,
    "system_prompt": """You are an advanced AI designed to analyze clinical notes of mental health patients, leveraging your understanding of psychological frameworks and therapeutic models, including the "Five Ps" framework. Your task is to identify, count, and explain occurrences of six key factors in the text. These factors may be explicitly stated or implied through context, requiring your advanced understanding of mental health concepts and terminology. 
"input texts are messy with html. Please carefullyt consider the text"
Key Responsibilities:
1. **Identify Factors**:
   - Analyze the text for mentions or implications of the six factors: presenting, predisposing, precipitating, perpetuating, integrated, and protective. 
   - Use your knowledge to interpret context, avoiding reliance solely on specific keywords.

2. **Interpret Context**:
   - Consider the patient's history, environmental factors, relationships, coping mechanisms, and current circumstances to deduce the presence of factors.
   - DO NOT Recognize implied factors based on holistic descriptions, such as "support from family" THAT CAOULD imply protective factors BUT ASK THE QUESTION "COULD THIS BE A PROTECTIVE FACTOR. LIKEWISE WITH A  "stressful work environment" DO NOT imply perpetuating or precipitating factors. THE REALITY MAY CONTRADICT USUAL REASONING

3. **Count Occurrences**:
   - Each mention or implication of a factor should be counted separately.
   - For example, mentions of "family support" and "supportive friendships" should be counted as two occurrences of protective factors. IMPLICATION OF A FACTOR SHOULD BE DERIVED FROM A SPECIFIC KEYWORD SUCH AS SUPPORTIVE WHERE THERE IS NO POTENTIAL FOR MISINTERPRETATION.

4. **Provide Explanations**:
   - For each factor detected, think an explanation in bullet points that outlines:
     - The specific part(s) of the text where the factor was found.
     - Why it qualifies as that factor based on context and meaning. Write this in detail. Why it falls into this category and how this text supports it.

5. **Avoid Hallucination**:
   - Only report factors that are directly supported by the text or clearly inferred from the context.
   - Do not introduce factors or details not evident in the provided information.

6. **Output Requirements**:
   - Return the results as a JSON object structured as:
     {
       "integrated": {"count": <integer>},
       "presentation": {"count": <integer>, },
       "predisposing": {"count": <integer>, },
       "precipitating": {"count": <integer>, },
       "perpetuating": {"count": <integer>, },
       "protective": {"count": <integer>, }
     }


8.most important:

Key Factors to Detect:
1. **Integrated Factors**:
   - These factors provide a cohesive understanding of the patient’s overall goals, diagnosis, risks, or available resources. Examples include mentions of a diagnosis, treatment plan, or systemic risks. risk state and risk status, foreseeable falls in this category.

2.  **Presentation Factors**:
   - These factors describe how the patient’s condition manifests, such as diagnosis, symptoms, presenting problems, or recent episodes (e.g. "ongoing anxiety," "panic attacks", concerns, current episode, experiencing, clinical "history of")). This goes beyond diagnosis to include what the person and clinician identify as difficulties, how the person’s life is affected, and when a particular difficulty should be targeted for intervention. For example, while a person may meet criteria for the diagnosis of borderline personality disorder, presenting difficulties may include not being able to maintain employment, erratic friendships, and physical health complications resulting from self-harm. Specifying such difficulties can allow for a more focused intervention.

3. **Predisposing Factors**:
   - Historical or hereditary aspects that make the patient vulnerable to mental health challenges. This comprises identifying possible biological contributors (for example, organic brain injury and birth difficulties), genetic vulnerabilities (including family history of mental health difficulties), environmental factors (such as socio-economic status, trauma, or attachment history) and psychological or personality factors (including core beliefs or personality factors) which may put a person at risk of developing a specific mental health difficulty. They may be be biological (e.g. genetic, birth trauma, brain injury, psychiatric illness, physical illness, medication, drugs, alcohol, pain) or psychological (e.g. personality, modelling, uncounscious defences, conscious coping strategies, self-esteem, body image, cognition) or social (e.g. socio-economic status, trauma).

4. **Precipitating Factors**:
   - These are triggers or immediate events causing the patient’s condition to worsen (e.g., "work triggers," "recent stress"). This can include significant events preceding the onset of the disorder, such as substance use, or interpersonal, legal, occupational, physical, or financial stressors. They may be be biological (e.g. medication, trauma, drugs, alcohol, acute illness, pain) or psychological (e.g. stage of life, loss, grief, treatment, stressors) or social (e.g. work, finances, connections, relationships).

5. **Perpetuating Factors**:
   - Ongoing conditions or behaviors sustaining the patient’s difficulties (e.g., "conflict at home," "regular stressors"). This comprises factors which maintain the current difficulties. These can include ongoing substance use, repeating behavioral patterns (including avoidance or safety behaviors in anxiety disorders, or withdrawal in depressive disorders), biological patterns (such as insomnia in mania, and insomnia or hypersomnia in depression) or cognitive patterns such as attentional biases, memory biases, or hypervigilance.

6. **Protective Factors**:
   - Positive aspects that mitigate challenges, such as supportive relationships, personal strengths, or effective coping strategies (e.g., "supportive friends," "strong family system"). This involves identifying strengths or supports that may mitigate the impact of the disorder. These can include social support, skills, interests, and some personal characteristics. 

Guidelines for Analysis:
- Apply your expertise in mental health concepts and therapeutic practices to ensure a thorough and accurate analysis.
- Use your contextual understanding to bridge gaps between explicit mentions and implied meanings.
- Be comprehensive in your analysis, ensuring no factor is overlooked if supported by the text.
- Protective factors are particularly important element which has traditionally been lacking in mental health interventions, but inclusion of which results in a higher likelihood of reduced symptomatology and increased resilience. We would add that identification of protective factors also creates increased optimism in both the clinician and patient and contributes to a positive therapeutic relationship.
"""
}

# SETTINGS_FILE = "system_settings.json"

# def load_settings():
#     if not os.path.exists(SETTINGS_FILE):
#         with open(SETTINGS_FILE, 'w') as f:
#             json.dump(DEFAULT_SETTINGS, f, indent=4)
#     with open(SETTINGS_FILE, 'r') as f:
#         return json.load(f)

# def save_settings(settings):
#     with open(SETTINGS_FILE, 'w') as f:
#         json.dump(settings, f, indent=4)

# # Load current settings
settings = DEFAULT_SETTINGS

# Initialize the Ollama client
client = Client(
    host='http://localhost:11434',
    headers={'x-some-header': 'some-value'}
)

def analyze_clinical_notes_without_explanations(text, temperature=0):
    # Define the payload for the API request
    payload = {
        "model": settings["model"],
        "prompt": text,
        "stream": False,
        "format": {
            "type": "object",
            "properties": {
                "integrated": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        # "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count",]
                },
                "presentation": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        # "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count",]
                },
                "precipitating": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        # "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", ]
                },
                "predisposing": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        # "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", ]
                },
                "perpetuating": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        # "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", ]
                },
                "protective": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        # "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count",]
                }
            },
            "required": ["integrated", "presentation", "precipitating", "predisposing", "perpetuating", "protective"]
        },
        "options": {
            "temperature": temperature,
            "num_ctx": 40000
        },
        "system": settings["system_prompt"]
    }

    # Send the request to the model
    response = client.generate(**payload)

    # Extract and return the JSON response
    try:
        return json.loads(response.response)
    except json.JSONDecodeError:
        return {"error": "Invalid response format"}


data_path = "/home/knhuq/work/databse_final/data.csv"
df = pd.read_csv(data_path)
all_facility_w_count = dict(Counter(list(df['encounterFacility'])))
all_keys = list(filter(bool,list(all_facility_w_count.keys())))
all_keys = [i for i in all_keys if i is not np.nan]



prelist = [i for i in all_keys if 'royal' in i.lower().strip()] + [i for i in all_keys if 'north' in i.lower().strip()]
other_list = [i[0] for i in sorted([(k,v) for k,v in all_facility_w_count.items()],key = lambda x:x[1], reverse = True) if i[1] > 1000]
other_list = [i for i in other_list if i not in prelist ]
other_list = [i for i in other_list if i is not np.nan]
final_list = prelist + other_list


all_index = list(df.index)
all_encounter_facility = list(df['encounterFacility'])
encounter_facility_zipped = list(zip(all_encounter_facility, all_index))
index_map = {k: i for i, k in enumerate(final_list)}
# Sort x based on the sequence from l
encounter_facility_zipped_sorted = sorted(encounter_facility_zipped, key=lambda item: index_map.get(item[0], float('inf')))
encounter_facility_zipped_sorted[:10]

df = df.dropna(subset=['progressNote'])

import os
from tqdm import tqdm
SAVING_PATH = "/home/knhuq/work/database_extracted_chunks"
SAVING_THRESHOLD = 1000


checkpoint_path = os.path.join(SAVING_PATH,'checkpoint.txt')
try:
    if os.path.exists(checkpoint_path):
        with open(checkpoint_path, 'r') as f:
            lines = f.readlines()
            START_POINT = int(lines[0].split(',')[-1])
    else:
        START_POINT = 0
except:
    START_POINT = 0
    
print (f'Starting from {START_POINT} data left to extract {len(encounter_facility_zipped_sorted)-START_POINT} out of {len(encounter_facility_zipped_sorted)}')

encounter_facility_zipped_sorted_to_iterate_current = encounter_facility_zipped_sorted[START_POINT:]
list_of_current_rows = []
list_of_current_extracted_values = []
CURRENT_ITERATION = 0
for ef,row_indx in tqdm(encounter_facility_zipped_sorted_to_iterate_current):
    CURRENT_ITERATION = CURRENT_ITERATION + 1
    START_POINT = START_POINT + 1
    try:
        current_row = df.iloc[row_indx]
        extracted_values = analyze_clinical_notes_without_explanations(current_row['progressNote'])
        list_of_current_extracted_values.append(extracted_values)
        list_of_current_rows.append(current_row)
    except Exception as e:
        print (f'ERROR:---> {e} and Skipping Index {START_POINT} and Row Index {row_indx}')
    if CURRENT_ITERATION %  SAVING_THRESHOLD == 0 and CURRENT_ITERATION !=0:
        current_df = pd.DataFrame(list_of_current_rows)
        current_df['extracted_values'] = list_of_current_extracted_values
        current_df.to_csv(os.path.join(SAVING_PATH, f'{START_POINT}.csv'))
        
        with open(checkpoint_path, 'w') as f:
             f.write(f'{ef},{row_indx},{START_POINT}')
        
        list_of_current_rows = []
        list_of_current_extracted_values = []
        CURRENT_ITERATION = 0

    
    

