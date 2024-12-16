from ollama import Client
import json

# Define the system prompt
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

    client = Client(
        host='http://127.0.0.1:9999',
        headers={'x-some-header': 'some-value'}
    )

    # Send the request to the model
    response = client.generate(**payload)

    # Extract and return the JSON response
    try:
        return json.loads(response.response)
    except json.JSONDecodeError:
        return {"error": "Invalid response format"}


def get_formulation_label_LLM(text_input):
    new_stat_dict = analyze_clinical_notes(text_input)
    try:
        integrated = new_stat_dict.pop('integrated')
    except KeyError:
        integrated = 0

    number_of_presented_formulation = len([k for k,v in new_stat_dict.items() if v > 0])
    all_key_words = []
    if number_of_presented_formulation < 2:
        return "Absent 5 P's Formulation", 'Absent Integrated Formulation', all_key_words
    elif number_of_presented_formulation >=2 and number_of_presented_formulation < 4:
        return "Limited 5 P's Formulation", "Absent Integrated Formulation", all_key_words
    elif number_of_presented_formulation >= 4:
        if integrated == 0:
            return "Inclusive 5 P's Formulation", "Absent Integrated Formulation", all_key_words
        if integrated <= 3:
            return "Inclusive 5 P's Formulation", "Limited Integrated Formulation", all_key_words
        elif integrated >=4:
            return "Inclusive 5 P's Formulation", "Inclusive Integrated Formulation", all_key_words

if __name__ == "__main__":
    # Example usage
    text_input = """
    The patient reports ongoing anxiety and recent episodes of panic attacks. 
    They have a strong support system from family and friends but feel exacerbated stress due to work triggers.
    """

    print(get_formulation_label_LLM(text_input))