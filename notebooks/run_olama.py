# import streamlit as st
# from ollama import Client
# import json

# # Initialize the Ollama client
# client = Client(
#     host='http://127.0.0.1:9999',
#     headers={'x-some-header': 'some-value'}
# )

# # Define the system prompt
# system_prompt = """
# You are an advanced AI designed to analyze clinical notes of mental health patients, leveraging your understanding of psychological frameworks and therapeutic models, including the "Five Ps" framework. Your task is to identify, count, and explain occurrences of six key factors in the text. These factors may be explicitly stated or implied through context, requiring your advanced understanding of mental health concepts and terminology.

# Key Responsibilities:
# 1. **Identify Factors**:
#    - Analyze the text for mentions or implications of the six factors: presenting, predisposing, precipitating, perpetuating, integrated, and protective.
#    - Use your knowledge to interpret context, avoiding reliance solely on specific keywords.

# 2. **Interpret Context**:
#    - Consider the patient's history, environmental factors, relationships, coping mechanisms, and current circumstances to deduce the presence of factors.
#    - Recognize implied factors based on holistic descriptions, such as "support from family" implying protective factors or "stressful work environment" implying perpetuating or precipitating factors.

# 3. **Count Occurrences**:
#    - Each mention or implication of a factor should be counted separately.
#    - For example, mentions of "family support" and "supportive friendships" should be counted as two occurrences of protective factors.

# 4. **Provide Explanations**:
#    - For each factor detected, provide an explanation in bullet points that outlines:
#      - The specific part(s) of the text where the factor was found.
#      - Why it qualifies as that factor based on context and meaning. Write this in detail. Why it falls into this category and how this text supports it.

# 5. **Avoid Hallucination**:
#    - Only report factors that are directly supported by the text or clearly inferred from the context.
#    - Do not introduce factors or details not evident in the provided information.

# 6. **Output Requirements**:
#    - Return the results as a JSON object structured as:
#      {
#        "integrated": {"count": <integer>, "explanations": [<list of strings>]},
#        "presentation": {"count": <integer>, "explanations": [<list of strings>]},
#        "precipitating": {"count": <integer>, "explanations": [<list of strings>]},
#        "predisposing": {"count": <integer>, "explanations": [<list of strings>]},
#        "perpetuating": {"count": <integer>, "explanations": [<list of strings>]},
#        "protective": {"count": <integer>, "explanations": [<list of strings>]}
#      }
# """

# def analyze_clinical_notes_with_explanations(text, temperature=0):
#     # Define the payload for the API request
#     payload = {
#         "model": "llama3.1",
#         "prompt": text,
#         "stream": False,
#         "format": {
#             "type": "object",
#             "properties": {
#                 "integrated": {
#                     "type": "object",
#                     "properties": {
#                         "count": {"type": "integer"},
#                         "explanations": {"type": "array", "items": {"type": "string"}}
#                     },
#                     "required": ["count", "explanations"]
#                 },
#                 "presentation": {
#                     "type": "object",
#                     "properties": {
#                         "count": {"type": "integer"},
#                         "explanations": {"type": "array", "items": {"type": "string"}}
#                     },
#                     "required": ["count", "explanations"]
#                 },
#                 "precipitating": {
#                     "type": "object",
#                     "properties": {
#                         "count": {"type": "integer"},
#                         "explanations": {"type": "array", "items": {"type": "string"}}
#                     },
#                     "required": ["count", "explanations"]
#                 },
#                 "predisposing": {
#                     "type": "object",
#                     "properties": {
#                         "count": {"type": "integer"},
#                         "explanations": {"type": "array", "items": {"type": "string"}}
#                     },
#                     "required": ["count", "explanations"]
#                 },
#                 "perpetuating": {
#                     "type": "object",
#                     "properties": {
#                         "count": {"type": "integer"},
#                         "explanations": {"type": "array", "items": {"type": "string"}}
#                     },
#                     "required": ["count", "explanations"]
#                 },
#                 "protective": {
#                     "type": "object",
#                     "properties": {
#                         "count": {"type": "integer"},
#                         "explanations": {"type": "array", "items": {"type": "string"}}
#                     },
#                     "required": ["count", "explanations"]
#                 }
#             },
#             "required": ["integrated", "presentation", "precipitating", "predisposing", "perpetuating", "protective"]
#         },
#         "options": {
#             "temperature": temperature,
#             "num_ctx": 40000
#         },
#         "system": system_prompt
#     }

#     # Send the request to the model
#     response = client.generate(**payload)

#     # Extract and return the JSON response
#     try:
#         return json.loads(response.response)
#     except json.JSONDecodeError:
#         return {"error": "Invalid response format"}

# # Streamlit App
# st.title("Clinical Notes Analysis")

# st.header("Enter Clinical Notes")
# user_input = st.text_area("Paste the clinical note below:")

# if st.button("Analyze"):
#     with st.spinner("Analyzing..."):
#         result = analyze_clinical_notes_with_explanations(user_input)
#         if "error" in result:
#             st.error("Error in processing the input. Please try again.")
#         else:
#             st.success("Analysis Complete!")
#             for factor, data in result.items():
#                 st.subheader(f"{factor.capitalize()} Factors")
#                 st.write(f"**Count:** {data['count']}")
#                 st.write("**Explanations:**")
#                 for explanation in data["explanations"]:
#                     st.markdown(f"- {explanation}")


import streamlit as st
from ollama import Client
import json
import os

# Default settings if file not found
DEFAULT_SETTINGS = {
    "model": "llama3.1",
    "temperature": 0.0,
    "system_prompt": """You are an advanced AI designed to analyze clinical notes of mental health patients, leveraging your understanding of psychological frameworks and therapeutic models, including the "Five Ps" framework. Your task is to identify, count, and explain occurrences of six key factors in the text. These factors may be explicitly stated or implied through context, requiring your advanced understanding of mental health concepts and terminology.

Key Responsibilities:
1. **Identify Factors**:
   - Analyze the text for mentions or implications of the six factors: presenting, predisposing, precipitating, perpetuating, integrated, and protective.
   - Use your knowledge to interpret context, avoiding reliance solely on specific keywords.

2. **Interpret Context**:
   - Consider the patient's history, environmental factors, relationships, coping mechanisms, and current circumstances to deduce the presence of factors.
   - Recognize implied factors based on holistic descriptions, such as "support from family" implying protective factors or "stressful work environment" implying perpetuating or precipitating factors.

3. **Count Occurrences**:
   - Each mention or implication of a factor should be counted separately.
   - For example, mentions of "family support" and "supportive friendships" should be counted as two occurrences of protective factors.

4. **Provide Explanations**:
   - For each factor detected, provide an explanation in bullet points that outlines:
     - The specific part(s) of the text where the factor was found.
     - Why it qualifies as that factor based on context and meaning. Write this in detail. Why it falls into this category and how this text supports it.

5. **Avoid Hallucination**:
   - Only report factors that are directly supported by the text or clearly inferred from the context.
   - Do not introduce factors or details not evident in the provided information.

6. **Output Requirements**:
   - Return the results as a JSON object structured as:
     {
       "integrated": {"count": <integer>, "explanations": [<list of strings>]},
       "presentation": {"count": <integer>, "explanations": [<list of strings>]},
       "precipitating": {"count": <integer>, "explanations": [<list of strings>]},
       "predisposing": {"count": <integer>, "explanations": [<list of strings>]},
       "perpetuating": {"count": <integer>, "explanations": [<list of strings>]},
       "protective": {"count": <integer>, "explanations": [<list of strings>]}
     }
"""
}

SETTINGS_FILE = "system_settings.json"

def load_settings():
    if not os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(DEFAULT_SETTINGS, f, indent=4)
    with open(SETTINGS_FILE, 'r') as f:
        return json.load(f)

def save_settings(settings):
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(settings, f, indent=4)

# Load current settings
settings = load_settings()

# Initialize the Ollama client
client = Client(
    host='http://127.0.0.1:9999',
    headers={'x-some-header': 'some-value'}
)

def analyze_clinical_notes_with_explanations(text, temperature=0):
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
                        "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", "explanations"]
                },
                "presentation": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", "explanations"]
                },
                "precipitating": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", "explanations"]
                },
                "predisposing": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", "explanations"]
                },
                "perpetuating": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", "explanations"]
                },
                "protective": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        "explanations": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["count", "explanations"]
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

# Create tabs
tab1, tab2 = st.tabs(["Analyze Clinical Notes", "Settings & Prompt"])

with tab1:
    st.title("Clinical Notes Analysis")
    st.header("Enter Clinical Notes")
    user_input = st.text_area("Paste the clinical note below:")

    if st.button("Analyze"):
        with st.spinner("Analyzing..."):
            result = analyze_clinical_notes_with_explanations(user_input, settings["temperature"])
            if "error" in result:
                st.error("Error in processing the input. Please try again.")
            else:
                st.success("Analysis Complete!")
                # Make output more good looking
                st.markdown("### Results")
                # Show each factor in an expander
                for factor, data in result.items():
                    with st.expander(f"**{factor.capitalize()} Factors** (Count: {data['count']})", expanded=False):
                        st.markdown("**Explanations:**")
                        for explanation in data["explanations"]:
                            st.markdown(f"- {explanation}")

with tab2:
    st.title("Settings & Prompt")
    st.write("Adjust the system prompt, model name, and temperature. Click Save to update.")
    
    updated_prompt = st.text_area("System Prompt:", value=settings["system_prompt"], height=400)
    model_name = st.text_input("Model Name", value=settings["model"])
    temperature = st.slider("Temperature", 0.0, 1.0, value=settings["temperature"])
    
    if st.button("Save"):
        settings["system_prompt"] = updated_prompt
        settings["model"] = model_name
        settings["temperature"] = temperature
        save_settings(settings)
        st.success("Settings saved successfully! Any future analysis will use these updated settings.")