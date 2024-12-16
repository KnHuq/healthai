# # from ollama import Client

# # # Initialize the client
# # client = Client(
# #     host='http://127.0.0.1:9999',
# #     headers={'x-some-header': 'some-value'}
# # )

# # # Define JSON schema for output
# # json_schema = {
# #     "type": "object",
# #     "properties": {
# #         "answer": {"type": "string"}
# #     },
# #     "required": ["answer"]
# # }

# # # Modify the prompt and system message
# # response = client.generate(
# #     model='llama3.2',
# #     prompt='What is the color of the sky? A. Blue, B. Green, C. Red, D. Yellow. '
# #            'Now you need to answer the question based on the options provided. '
# #            'Return the value (e.g., "Blue") and not the letter (e.g., "A").',
# #     system='You must respond in JSON format. The format is: {"answer": "<value>"} where <value> '
# #            'is the answer value, not the option letter.',
# #     format=json_schema,
# #     options={"stream": False}  # Ensure non-streaming response for easier processing
# # )

# # # Print the response
# # print(response.response)



# # import asyncio
# # from aiohttp import ClientSession
# # import json

# # async def send_request(question):
# #     url = "http://127.0.0.1:9999/api/generate"
# #     payload = {
# #         "model": "llama3.2",
# #         "prompt": f"Answer this question in JSON: {question}",
# #         "stream": False,
# #         "format": "json"
# #     }
# #     async with ClientSession() as session:
# #         async with session.post(url, json=payload) as response:
# #             result = await response.json()
# #             # Extract and parse the JSON response
# #             try:
# #                 return json.loads(result['response'])
# #             except (KeyError, json.JSONDecodeError):
# #                 return {"error": "Invalid response format", "question": question}

# # async def main(questions):
# #     tasks = [send_request(question) for question in questions]
# #     return await asyncio.gather(*tasks)

# # questions = [
# #     "What is the color of the sky?",
# #     "What is the capital of France?",
# #     "Who wrote 'To Kill a Mockingbird'?"
# # ]

# # responses = asyncio.run(main(questions))
# # print(json.dumps(responses, indent=4))



# # import asyncio
# # from aiohttp import ClientSession
# # import json

# # async def send_request(question, system=None, temperature=0.7):
# #     url = "http://127.0.0.1:9999/api/generate"
# #     payload = {
# #         "model": "llama3.2",
# #         "prompt": f"Answer this question in JSON: {question}",
# #         "stream": False,
# #         "format": "json",
# #         "options": {
# #             "temperature": temperature
# #         }
# #     }
# #     if system:
# #         payload["system"] = system

# #     async with ClientSession() as session:
# #         async with session.post(url, json=payload) as response:
# #             result = await response.json()
# #             # Extract and parse the JSON response
# #             try:
# #                 return json.loads(result['response'])
# #             except (KeyError, json.JSONDecodeError):
# #                 return {"error": "Invalid response format", "question": question}

# # async def main(questions, system=None, temperature=0.7):
# #     tasks = [send_request(question, system, temperature) for question in questions]
# #     return await asyncio.gather(*tasks)

# # questions = [
# #     "What is the color of the sky?",
# #     "What is the capital of France?",
# #     "Who wrote 'To Kill a Mockingbird'?"
# # ]

# # # Set system message and temperature
# # system_message = "You are a helpful assistant who answers concisely in JSON format. Only json format is needed. No other text is needed."
# # temperature_value = 0

# # responses = asyncio.run(main(questions, system=system_message, temperature=temperature_value))
# # print(json.dumps(responses, indent=4))


# import asyncio
# from aiohttp import ClientSession
# import json

# # Define JSON schema for the expected response
# json_schema = {
#     "type": "object",
#     "properties": {
#         "answer": {"type": "string"},
#         "explanation": {"type": "string"}
#     },
#     "required": ["answer", "explanation"]
# }

# async def send_request(question, system=None, temperature=0.7):
#     url = "http://127.0.0.1:9999/api/generate"
#     payload = {
#         "model": "llama3.2",
#         "prompt": f"Answer this question in JSON: {question}",
#         "stream": False,
#         "format": json_schema,  # Use the JSON schema here
#         "options": {
#             "temperature": temperature
#         }
#     }
#     if system:
#         payload["system"] = system

#     async with ClientSession() as session:
#         async with session.post(url, json=payload) as response:
#             result = await response.json()
#             # Parse and validate the JSON response
#             try:
#                 return json.loads(result['response'])
#             except (KeyError, json.JSONDecodeError):
#                 return {"error": "Invalid response format", "question": question}

# async def main(questions, system=None, temperature=0.7):
#     tasks = [send_request(question, system, temperature) for question in questions]
#     return await asyncio.gather(*tasks)

# questions = [
#     "What is the color of the sky?",
#     "What is the capital of France?",
#     "Who wrote 'To Kill a Mockingbird'?"
# ]*10

# # Set system message and temperature
# system_message = "You are a helpful assistant who answers concisely in JSON format. Exact answer in answer key like one or two words . Then exaplin key to explain the answer"
# temperature_value = 0

# responses = asyncio.run(main(questions, system=system_message, temperature=temperature_value))
# print(json.dumps(responses, indent=4))


# import asyncio
# from aiohttp import ClientSession
# import json

# # Define the system prompt
# system_prompt = """
# You are an advanced AI assistant tasked with analyzing clinical notes for mental health patients. Your primary objective is to detect and count the occurrences of key factors in the notes. These factors often do not appear explicitly as exact words but are contextually implied. Your analysis should rely on your deep understanding of mental health terminologies and their associated contexts.

# #### Key Instructions:
# 1. **Factors to Detect:**
#    - **Integrated**: Refers to themes related to diagnosis, risks, gaps, or the patient’s overall understanding and goals. These can include terms like "goals," "diagnosis," "differential diagnosis (dx)," "gaps," "drivers," "risks," "risk state," "risk status," "foreseeable," and "available resources."
#    - **Presentation**: Captures the current symptoms, concerns, or observed episodes. Contextual clues include "symptoms," "admission-to," "arrived," "current episode," "presenting concerns," "historical presentation," or mentions of how the patient "arrived."
#    - **Precipitating**: Refers to factors that act as triggers or worsen the condition. Examples include "context," "triggers," "relapses," "instigators," "induced episodes," "exacerbations," or anything precipitating a response.
#    - **Predisposing**: Factors that indicate a genetic, historical, or background predisposition to the condition. These include "background," "hereditary," "patterns," "records," "genetically linked," "predispositions," "vulnerabilities," or familial patterns.
#    - **Perpetuating**: Ongoing factors contributing to or maintaining the condition. Look for terms like "contributing," "maintaining," "ongoing patterns," "regular use of harmful substances," "lasting effects," or "perpetuation."
#    - **Protective**: Refers to strengths, coping mechanisms, or external support systems helping the patient. Examples include "protective factors," "strengths," "coping skills," "hobbies," "improvements," "loving relationships," "friendships," "connections," "supported environments," and "supportive individuals."

# 2. **Goal**:
#    - Count how many times each factor is mentioned or implied in the text, even if the terminology is not exact. This requires a contextual understanding of the note, identifying factors based on implications and themes.

# 3. **Output Format**:
#    - Provide the results in the following JSON format:
#      {{
#          "integrated": <integer>,
#          "presentation": <integer>,
#          "precipitating": <integer>,
#          "predisposing": <integer>,
#          "perpetuating": <integer>,
#          "protective": <integer>
#      }}

# 4. **Rules**:
#    - **Deterministic Outputs**: The analysis should be consistent and reproducible, meaning the same text should always yield the same results.
#    - **Contextual Analysis**: If explicit keywords are absent, identify the factor through context, tone, and relevance to the factor definitions.
#    - **No Hallucination**: Do not fabricate occurrences or infer beyond the scope of the provided text.

# 5. **Examples**:
#    - **Input Note**: "The patient showed signs of improvement through supportive relationships and coping mechanisms. However, they reported ongoing triggers that exacerbate symptoms."
#      **Output**:
#      {{
#          "integrated": 0,
#          "presentation": 1,
#          "precipitating": 1,
#          "predisposing": 0,
#          "perpetuating": 0,
#          "protective": 2
#      }}

#    - **Input Note**: "The patient has a family history of depression and mentioned recurring symptoms triggered by workplace stress."
#      **Output**:
#      {{
#          "integrated": 0,
#          "presentation": 1,
#          "precipitating": 1,
#          "predisposing": 1,
#          "perpetuating": 0,
#          "protective": 0
#      }}

# By following these guidelines and leveraging your understanding of mental health contexts, ensure precise, accurate, and context-aware detections for each factor in the clinical note.
# """

# # Function to send a request to Ollama's API
# async def send_request(note, system_message):
#     url = "http://127.0.0.1:9999/api/generate"
#     payload = {
#         "model": "llama3.2",
#         "prompt": f"Analyze the following clinical note and return the factor counts in JSON:\n\n{note}",
#         "stream": False,
#         "system": system_message,
#         "options": {
#             "temperature": 0  # Deterministic output
#         }
#     }

#     async with ClientSession() as session:
#         async with session.post(url, json=payload) as response:
#             result = await response.json()
#             # Parse the response JSON and return the content
#             try:
#                 return json.loads(result['response'])
#             except (KeyError, json.JSONDecodeError):
#                 return {"error": "Invalid response format", "note": note}

# # Main function to process multiple clinical notes
# async def main(notes):
#     tasks = [send_request(note, system_prompt) for note in notes]
#     return await asyncio.gather(*tasks)

# # Example clinical notes
# clinical_notes = [
#     "The patient showed signs of improvement through supportive relationships and coping mechanisms. However, they reported ongoing triggers that exacerbate symptoms.",
#     # "The patient has a family history of depression and mentioned recurring symptoms triggered by workplace stress.",
#     # "The diagnosis gap was identified as a driver for the patient's current risk state, with ongoing symptoms and concerns."
# ]

# # Run the analysis
# responses = asyncio.run(main(clinical_notes))
# print(json.dumps(responses, indent=4))
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
#      - Why it qualifies as that factor based on context and meaning.

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

# Key Factors to Detect:
# 1. **Integrated Factors**:
#    - These factors provide a cohesive understanding of the patient’s overall goals, diagnosis, risks, or available resources. Examples include mentions of a diagnosis, treatment plan, or systemic risks.

# 2. **Presentation Factors**:
#    - These factors describe how the patient’s condition manifests, such as symptoms, presenting problems, or recent episodes (e.g., "ongoing anxiety," "panic attacks").

# 3. **Precipitating Factors**:
#    - These are triggers or immediate events causing the patient’s condition to worsen (e.g., "work triggers," "recent stress").

# 4. **Predisposing Factors**:
#    - Historical or hereditary aspects that make the patient vulnerable to mental health challenges (e.g., "family history of mental illness").

# 5. **Perpetuating Factors**:
#    - Ongoing conditions or behaviors sustaining the patient’s difficulties (e.g., "conflict at home," "regular stressors").

# 6. **Protective Factors**:
#    - Positive aspects that mitigate challenges, such as supportive relationships, personal strengths, or effective coping strategies (e.g., "supportive friends," "strong family system").

# Guidelines for Analysis:
# - Apply your expertise in mental health concepts and therapeutic practices to ensure a thorough and accurate analysis.
# - Use your contextual understanding to bridge gaps between explicit mentions and implied meanings.
# - Be comprehensive in your analysis, ensuring no factor is overlooked if supported by the text.
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
#             "temperature": temperature
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

# # Example usage
# text_input = """
# The patient reports ongoing anxiety and recent episodes of panic attacks. 
# They have a strong support system from family and friends but feel exacerbated stress due to work triggers.
# """
# result = analyze_clinical_notes_with_explanations(text_input)
# print(json.dumps(result, indent=4))





from ollama import Client
import json
import time

# Initialize the Ollama client
client = Client(
    host='http://127.0.0.1:9999',
    headers={'x-some-header': 'some-value'}
)

system_prompt ="""
You are an advanced AI designed to analyze clinical notes of mental health patients, leveraging your understanding of psychological frameworks and therapeutic models, including the "Five Ps" framework. Your task is to identify and count occurrences of six key factors in the text. These factors may be explicitly stated or implied through context, requiring your advanced understanding of mental health concepts and terminology.
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
4. **Avoid Hallucination**:
   - Only report factors that are directly supported by the text or clearly inferred from the context.
   - Do not introduce factors or details not evident in the provided information.
5. **Output Requirements**:
   - Return a JSON object structured as:
     {
       "integrated": <integer>,
       "presentation": <integer>,
       "precipitating": <integer>,
       "predisposing": <integer>,
       "perpetuating": <integer>,
       "protective": <integer>
     }

Key Factors to Detect:
1. **Integrated Factors**:
   - These factors provide a cohesive understanding of the patient’s overall goals, diagnosis, risks, or available resources. Examples include mentions of a diagnosis, treatment plan, or systemic risks.

2. **Presentation Factors**:
   - These factors describe how the patient’s condition manifests, such as symptoms, presenting problems, or recent episodes (e.g., "ongoing anxiety," "panic attacks").

3. **Precipitating Factors**:
   - These are triggers or immediate events causing the patient’s condition to worsen (e.g., "work triggers," "recent stress").

4. **Predisposing Factors**:
   - Historical or hereditary aspects that make the patient vulnerable to mental health challenges (e.g., "family history of mental illness").

5. **Perpetuating Factors**:
   - Ongoing conditions or behaviors sustaining the patient’s difficulties (e.g., "conflict at home," "regular stressors").

6. **Protective Factors**:
   - Positive aspects that mitigate challenges, such as supportive relationships, personal strengths, or effective coping strategies (e.g., "supportive friends," "strong family system").

Guidelines for Analysis:
- Apply your expertise in mental health concepts and therapeutic practices to ensure a thorough and accurate analysis.
- Use your contextual understanding to bridge gaps between explicit mentions and implied meanings.
- Be comprehensive in your analysis, ensuring no factor is overlooked if supported by the text.
"""


# Function to analyze a single clinical note
def analyze_clinical_notes(text, temperature=0):
    # Define the payload for the API request
    payload = {
        "model": "llama3.1",
        "prompt": text,
        "stream": False,
        "format": {
            "type": "object",
            "properties": {
                "integrated": {"type": "integer"},
                "presentation": {"type": "integer"},
                "precipitating": {"type": "integer"},
                "predisposing": {"type": "integer"},
                "perpetuating": {"type": "integer"},
                "protective": {"type": "integer"}
            },
            "required": ["integrated", "presentation", "precipitating", "predisposing", "perpetuating", "protective"]
        },
        "options": {
            "temperature": temperature
        },
        "system": system_prompt
    }

    # Send the request to the model
    response = client.generate(**payload)

    # Extract and return the JSON response
    try:
        return json.loads(response.response)
    except json.JSONDecodeError:
        return {"error": "Invalid response format"}

# Run the synchronous version
def run_synchronous_analysis(texts):
    results = []
    start_time = time.time()
    for text in texts:
        results.append(analyze_clinical_notes(text))
    elapsed_time = time.time() - start_time
    return results, elapsed_time

# Example inputs
texts = [
    "The patient reports ongoing anxiety and recent episodes of panic attacks...",
    "The patient’s family history shows hereditary mental illness...",
    "Workplace stress continues to exacerbate the patient’s symptoms...",
    # Add more test cases here
] * 3  # Repeat to make 10 notes

results_sync, time_sync = run_synchronous_analysis(texts)
print("Synchronous Results:", json.dumps(results_sync, indent=4))
print(f"Synchronous Execution Time: {time_sync:.2f} seconds")






import asyncio
from ollama import Client
import json
import time

# Initialize the Ollama client
client = Client(
    host='http://127.0.0.1:9999',
    headers={'x-some-header': 'some-value'}
)

# Define the system prompt
system_prompt = """
You are an advanced AI designed to analyze clinical notes of mental health patients...
"""  # Truncated for brevity, use your full system prompt here.

# Asynchronous function to analyze a single clinical note
async def analyze_clinical_notes_async(text, temperature=0):
    payload = {
        "model": "llama3.1",
        "prompt": text,
        "stream": False,
        "format": {
            "type": "object",
            "properties": {
                "integrated": {"type": "integer"},
                "presentation": {"type": "integer"},
                "precipitating": {"type": "integer"},
                "predisposing": {"type": "integer"},
                "perpetuating": {"type": "integer"},
                "protective": {"type": "integer"}
            },
            "required": ["integrated", "presentation", "precipitating", "predisposing", "perpetuating", "protective"]
        },
        "options": {
            "temperature": temperature
        },
        "system": system_prompt
    }

    # Send the request to the model
    response = client.generate(**payload)

    # Extract and return the JSON response
    try:
        return json.loads(response.response)
    except json.JSONDecodeError:
        return {"error": "Invalid response format"}

# Run the asynchronous version
async def run_asynchronous_analysis(texts):
    tasks = [analyze_clinical_notes_async(text) for text in texts]
    start_time = time.time()
    results = await asyncio.gather(*tasks)
    elapsed_time = time.time() - start_time
    return results, elapsed_time

# Example inputs
texts = [
    "The patient reports ongoing anxiety and recent episodes of panic attacks...",
    "The patient’s family history shows hereditary mental illness...",
    "Workplace stress continues to exacerbate the patient’s symptoms...",
    # Add more test cases here
] * 3  # Repeat to make 10 notes

results_async, time_async = asyncio.run(run_asynchronous_analysis(texts))
print("Asynchronous Results:", json.dumps(results_async, indent=4))
print(f"Asynchronous Execution Time: {time_async:.2f} seconds")