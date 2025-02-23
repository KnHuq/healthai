import streamlit as st
from ollama import Client
import json
import os
from lib.formula_cal import get_formulation_label, get_exact_match_from_text, get_prefix_match_from_text
from config.formula import integrated_formulations, presentation_factors, precipitating_factors, predisposing_factors, perpetuating_factors, protective_factors, multiple_factors
import html
from datetime import datetime, timedelta
import pandas as pd
import re

# This should stay as is - caches the entire dataframe
@st.cache_data
def load_dataframe():
    """
    Load the dataframe and cache it.
    Only reloads if the server restarts or cache is cleared.
    """
    try:
        df = pd.read_csv('/Users/shezan/QH/healthai/backend/data/data_raw_chunk.csv')
    except:
        df = pd.read_csv("/home/knhuq/work/databse_final/data.csv")
    df['date'] = pd.to_datetime(df['clinicalNoteDate'], format='%d/%m/%Y')
    return df

# Replace the global DATAFRAME with the cached version
DATAFRAME = load_dataframe()

def safe_markdown_render(text):
    """
    Safely render text content, falling back to raw text if HTML rendering fails
    """
    try:
        # Try to render as markdown/HTML
        st.markdown(text, unsafe_allow_html=True)
    except:
        # Fallback to raw text display
        st.text(text)

def display_clinical_note(note):
    """
    Clean note text for display purposes only
    """
    return html.unescape(note).replace('\n', ' ')

def combine_patient_notes(clinical_notes):
    """
    Combines all notes for a patient into a single text, with dates as separators
    Keeps original text for LLM analysis
    """
    combined_text = []
    for note, date in clinical_notes:
        combined_text.append(f"\n=== Note from {date} ===\n{note}")
    return "\n".join(combined_text)

def get_start_end_date():
    """
    Get the earliest and latest dates from the clinicalNoteDate column
    Returns tuple of (min_date, max_date)
    """    
    # Get min and max dates
    min_date = DATAFRAME['date'].min()
    max_date = DATAFRAME['date'].max()
    
    return min_date.date(), max_date.date()

# Cache with hash_funcs to handle date inputs
@st.cache_data(hash_funcs={datetime: str})
def get_patient_Ids(start_date, end_date):
    """
    Get unique patient IDs between start_date and end_date
    Cache result based on date inputs
    """
    # Convert input dates to datetime
    start_dt = pd.to_datetime(start_date)
    end_dt = pd.to_datetime(end_date)
    
    # Filter dataframe for date range
    mask = (DATAFRAME['date'] >= start_dt) & (DATAFRAME['date'] <= end_dt)
    filtered_df = DATAFRAME[mask]
    
    patient_ids = filtered_df['ConsumerID'].unique().tolist()
    patient_ids.sort()
    
    if len(patient_ids) > 100:
        patient_ids = patient_ids[:100]
    
    return patient_ids

# Cache based on patient_id input
@st.cache_data
def get_clinical_notes(patient_id):
    """
    Get all clinical notes for a specific patient ID
    Cache result based on patient_id
    """
    patient_notes = DATAFRAME[DATAFRAME['ConsumerID'] == patient_id]
    patient_notes = patient_notes.sort_values('date', ascending=False)
    
    notes_with_dates = list(zip(
        patient_notes['progressNote'].tolist(),
        patient_notes['date'].dt.strftime('%d/%m/%Y').tolist()
    ))
    
    return notes_with_dates

# Default settings if file not found
DEFAULT_SETTINGS = {
    "model": "llama3.1:70b",
    "temperature": 0.0,
    "system_prompt": "",
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
    host='http://localhost:11434',
    headers={'x-some-header': 'some-value'}
)

# Cache LLM analysis based on input text and temperature
@st.cache_data
def analyze_clinical_notes_with_explanations(note_text, temperature):
    """
    Cache LLM analysis based on input text and temperature
    Will recompute if either changes
    """
    # Define the payload for the API request
    payload = {
        "model": settings["model"],
        "prompt": note_text,
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
            "num_ctx": 10000
        },
        "system": settings["system_prompt"]
    }

    # Send the request to the model
    response = client.generate(**payload)
    print (json.loads(response.response))
    # Extract and return the JSON response
    try:
        return json.loads(response.response)
    except json.JSONDecodeError:
        return {"error": "Invalid response format"}

@st.cache_data
def get_llm_formulation_classification(llm_result):
    """Cache the formulation classification"""
    # Determine the number of 5 P's factors present
    factors_present = sum(1 for factor in ["integrated", "presentation", "precipitating", "predisposing", "perpetuating", "protective"] if llm_result[factor]["count"] > 0)
    
    # Determine the formulation classification based on the number of factors present
    if factors_present < 2:
        formulation_classification = "Absent 5 P's Formulation"
    elif 2 <= factors_present <= 3:
        formulation_classification = "Limited 5 P's Formulation"
    else:
        formulation_classification = "Inclusive 5 P's Formulation"
    
    # Determine the integrated formulation classification
    integrated_count = llm_result["integrated"]["count"]
    if integrated_count == 0:
        integrated_formulation = "Absent Integrated Formulation"
    else:
        integrated_formulation = "Inclusive Integrated Formulation"

    
    return formulation_classification, integrated_formulation

# Function to get all possible words for a factor
def get_all_possible_words(factor_dict):
    return factor_dict['first_order']['exact'] + factor_dict['first_order']['prefix'] + \
           factor_dict['second_order']['exact'] + factor_dict['second_order']['prefix']

# Function to provide human-readable explanation of formulation logic
def get_formulation_explanation():
    explanation = """
    <h4>Formulation Logic Explanation:</h4>
    <ul>
        <li><strong>Absent 5 P's Formulation:</strong> This label is assigned when fewer than 2 of the 5 P's factors are present.</li>
        <li><strong>Limited 5 P's Formulation:</strong> This label is assigned when 2 or 3 of the 5 P's factors are present.</li>
        <li><strong>Inclusive 5 P's Formulation:</strong> This label is assigned when 4 or more of the 5 P's factors are present.</li>
        <li><strong>Absent Integrated Formulation:</strong> This label is assigned when the integrated factor is not present.</li>
        <li><strong>Inclusive Integrated Formulation:</strong> This label is assigned when the integrated factor is present.</li>
    </ul>
    """
    return explanation

# Update the custom CSS section
st.markdown("""
    <style>
    /* Modern clean background */
    .stApp {
        background: #f8f9fa;
    }

    /* General layout */
    .main {
        max-width: 100% !important;
        padding: 0 !important;
    }
    
    .block-container {
        padding: 2rem;
        max-width: 100% !important;
        animation: fadeIn 0.5s ease-in;
    }

    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes heartbeat {
        0% { transform: scale(1); }
        14% { transform: scale(1.3); }
        28% { transform: scale(1); }
        42% { transform: scale(1.3); }
        70% { transform: scale(1); }
    }

    @keyframes analyzeSpinner {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Analyze button with magnifying glass icon */
    .stButton>button {
        background: #e8f5e9;
        color: #2c3e50;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 15px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        position: relative;
        padding-left: 45px;
    }

    .stButton>button::before {
        content: '🔍';
        position: absolute;
        left: 20px;
        font-size: 18px;
        animation: searchPulse 2s infinite;
    }

    .stButton>button:hover {
        background: #c8e6c9;
        color: #1a1a1a;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    @keyframes searchPulse {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(-10deg); }
        100% { transform: scale(1) rotate(0deg); }
    }

    /* Modern tab styling */
    .stTabs {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    }

    .stTabs [data-baseweb="tab-list"] {
        gap: 0;
        background: #f1f3f5;
        padding: 4px;
        border-radius: 8px;
    }

    .stTabs [data-baseweb="tab"] {
        padding: 10px 24px;
        border-radius: 6px;
        font-weight: 500;
        background: transparent;
        color: #495057;
        border: none;
        transition: all 0.2s ease;
    }

    .stTabs [data-baseweb="tab"]:hover:not([aria-selected="true"]) {
        background: rgba(0,0,0,0.05);
    }

    .stTabs [aria-selected="true"] {
        background: white !important;
        color: #2c3e50 !important;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    /* Analysis spinner */
    .stSpinner {
        width: 24px !important;
        height: 24px !important;
        border: 3px solid #e8f5e9;
        border-top: 3px solid #4CAF50;
        border-radius: 50%;
        position: relative;
        animation: analyzeSpinner 1s linear infinite;
    }

    /* Modern card styling */
    .stExpander {
        background: white;
        border-radius: 12px;
        border: 1px solid #e9ecef;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
    }

    .stExpander:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    /* Column divider */
    [data-testid="column"]:nth-of-type(1) {
        border-right: 1px solid #e9ecef;
        padding-right: 2rem;
    }

    /* Text styling */
    .stMarkdown {
        color: #2c3e50;
    }

    .stMarkdown h3 {
        color: #2c3e50;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .stMarkdown h4 {
        color: #495057;
        font-weight: 600;
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 0.5rem;
        margin: 1.5rem 0 1rem 0;
    }

    /* Success message */
    .element-container:has(.stSuccess) {
        animation: fadeIn 0.5s ease-out;
    }

    .stSuccess {
        background: #d4edda;
        color: #155724;
        border-color: #c3e6cb;
        padding: 1rem;
        border-radius: 8px;
        font-weight: 500;
    }

    /* Input fields */
    .stTextArea textarea,
    .stSelectbox select {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 8px 12px;
        transition: all 0.3s ease;
    }

    .stTextArea textarea:focus,
    .stSelectbox select:focus {
        border-color: #2c3e50;
        box-shadow: 0 0 0 2px rgba(44,62,80,0.1);
    }

    /* Custom heartbeat animation for analysis */
    .analyzing-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>');
        animation: heartbeat 1.5s infinite;
        margin-right: 8px;
    }

    /* Modern subtle title styling */
    .custom-title {
        background: #f8f9fa;
        color: #1a1a1a;
        padding: 1.8rem;
        border-radius: 12px;
        margin: 1.5rem 0;
        font-size: 2.2rem;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-align: center;
        animation: gentleFadeIn 1.2s ease-out;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        border: 1px solid rgba(0,0,0,0.05);
    }

    .custom-title::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(0,0,0,0.03),
            transparent
        );
        animation: shimmer 3s infinite;
    }

    .custom-subtitle {
        color: #445668;
        font-size: 1.5rem;
        font-weight: 400;
        text-align: center;
        margin: 1.5rem 0;
        padding-bottom: 0.8rem;
        position: relative;
        animation: gentleSlideUp 1s ease-out;
    }

    .custom-subtitle::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 180px;
        height: 2px;
        background: linear-gradient(90deg, 
            transparent,
            #52687d,
            transparent
        );
    }

    @keyframes gentleFadeIn {
        0% { 
            opacity: 0;
            transform: translateY(-15px);
        }
        50% {
            opacity: 0.5;
            transform: translateY(-7px);
        }
        100% { 
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes gentleSlideUp {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes shimmer {
        0% {
            left: -100%;
        }
        50% {
            left: 100%;
        }
        100% {
            left: 100%;
        }
    }

    /* Subtle hover effect */
    .custom-title:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
    }

    .custom-subtitle:hover::after {
        width: 220px;
        transition: width 0.3s ease;
    }

    /* Custom spinner container */
    .spinner-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 10px 0;
    }

    /* Hide spinner text but keep the animation */
    .stSpinner > div:last-child {
        display: none !important;
    }

    .stSpinner {
        margin-left: 10px !important;
        width: 24px !important;
        height: 24px !important;
    }

    .stSpinner > div:first-child {
        border: 3px solid #e8f5e9;
        border-top: 3px solid #4CAF50;
        width: 24px !important;
        height: 24px !important;
    }

    /* Date input styling */
    .date-input-container {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        margin: 1rem 0;
        border: 1px solid #e9ecef;
    }

    /* Selectbox styling */
    .stSelectbox {
        margin-bottom: 1rem;
    }

    .stSelectbox > div > div {
        background: white !important;
        border: 1px solid #e9ecef !important;
        padding: 8px 12px !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
        min-height: 42px !important;
        display: flex !important;
        align-items: center !important;
    }

    /* Fix for text visibility */
    .stSelectbox [data-baseweb="select"] > div {
        height: auto !important;
        min-height: 42px !important;
        white-space: nowrap !important;
        overflow: visible !important;
    }

    /* Selected value text */
    .stSelectbox [data-testid="stMarkdown"] {
        overflow: visible !important;
        text-overflow: unset !important;
        white-space: nowrap !important;
    }

    .stSelectbox > div > div:hover {
        border-color: #4CAF50 !important;
    }

    /* Dropdown menu */
    .stSelectbox [role="listbox"] {
        border-radius: 8px !important;
        border: 1px solid #e9ecef !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
    }

    /* Dropdown options */
    .stSelectbox [role="option"] {
        padding: 8px 12px !important;
        min-height: 42px !important;
        display: flex !important;
        align-items: center !important;
    }

    .stSelectbox [role="option"]:hover {
        background: rgba(76, 175, 80, 0.1) !important;
    }

    /* Selected option */
    .stSelectbox [aria-selected="true"] {
        background: rgba(76, 175, 80, 0.1) !important;
        font-weight: 500 !important;
    }

    /* Label styling */
    .stSelectbox label {
        color: #2c3e50 !important;
        font-weight: 600 !important;
        font-size: 0.95rem !important;
        margin-bottom: 0.5rem !important;
    }

    /* Placeholder styling */
    .stSelectbox [data-baseweb="select"] > div > div:first-child {
        color: #6b7280 !important;
    }

    /* Section headers */
    .section-header {
        color: #2c3e50;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 1.5rem 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e9ecef;
    }

    /* Note content container */
    .note-content {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid #e9ecef;
        margin: 1rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .note-content:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }

    /* Date range container */
    .date-range {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;
    }

    /* Input label styling */
    .stDateInput > label {
        color: #2c3e50;
        font-weight: 500;
        font-size: 0.95rem;
    }

    /* Selection label styling */
    .stSelectbox > label {
        color: #2c3e50;
        font-weight: 500;
        font-size: 0.95rem;
    }

    /* Section header styling */
    .section-header {
        color: #2c3e50;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 1.5rem 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e9ecef;
    }

    /* Date input container */
    .date-input-container {
        margin-top: 2rem;
    }

    /* Remove extra spacing after title */
    .custom-title {
        margin-bottom: 0 !important;
    }

    /* Date input styling */
    .stDateInput {
        margin-bottom: 1rem;
    }

    .stDateInput > div {
        width: 100%;
    }

    .stDateInput input {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 8px 12px;
        width: 100%;
    }

    /* Note container styling */
    .note-container {
        background: white;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        margin: 10px 0;
        white-space: pre-wrap;
        font-family: monospace;
        overflow-x: auto;
    }

    .note-date {
        color: #2c3e50;
        font-weight: 600;
        margin-bottom: 8px;
        font-size: 1.1rem;
    }
    </style>
""", unsafe_allow_html=True)

# Create tabs
st.markdown("<br><br>", unsafe_allow_html=True)  # Add two line breaks for spacing
tab1, tab2, tab3 = st.tabs(["Write and Analyse Clinical Notes", "Analyse Existing Clinical Notes", "Settings"])

with tab1:
    st.markdown("<div class='custom-title'>Write and Analyse Clinical Notes</div>", unsafe_allow_html=True)
    user_input = st.text_area("Paste or write the clinical note below:", key="manual_input")
    cleaned_input = html.unescape(user_input).replace('\n', ' ')

    if st.button("Analyse", key="analyze_manual"):
        with st.spinner(""):  # Empty spinner text to use custom styling
            st.markdown("""
                <div class="analyzing-icon"></div>
                <span style="color: #2c3e50; font-weight: 500;">Analyzing...</span>
            """, unsafe_allow_html=True)
            print (f'cleaned input for tab 1: {cleaned_input}')
            llm_result = analyze_clinical_notes_with_explanations(cleaned_input, settings["temperature"])
            (formula_labels, formula_stats) = get_formulation_label(cleaned_input)
            
            if "error" in llm_result:
                st.error("Error in processing the input. Please try again.")
            else:
                st.success("Analysis Complete!")
                
                # Calculate LLM formulation classification
                llm_formulation_classification, llm_integrated_formulation = get_llm_formulation_classification(llm_result)
                
                # Create columns for comparison
                col1, col2 = st.columns(2)
                
                with col1:
                    st.markdown("<h3>LLM Analysis Results</h3>", unsafe_allow_html=True)
                    st.markdown(f"<strong>Formulation Classification:</strong> <span>{llm_formulation_classification}</span>", unsafe_allow_html=True)
                    st.markdown(f"<strong>Integrated Formulation:</strong> <span>{llm_integrated_formulation}</span>", unsafe_allow_html=True)

                    # Add collapsible explanation of LLM formulation logic
                    with st.expander("LLM Formulation Logic Explanation", expanded=False):
                        st.markdown("""
                        <ul>
                            <li><strong>Absent 5 P's Formulation:</strong> This label is assigned when fewer than 2 of the 5 P's factors are present.</li>
                            <li><strong>Limited 5 P's Formulation:</strong> This label is assigned when 2 or 3 of the 5 P's factors are present.</li>
                            <li><strong>Inclusive 5 P's Formulation:</strong> This label is assigned when 4 or more of the 5 P's factors are present.</li>
                            <li><strong>Absent Integrated Formulation:</strong> This label is assigned when the integrated factor is not present.</li>
                            <li><strong>Inclusive Integrated Formulation:</strong> This label is assigned when the integrated factor is present.</li>
                        </ul>
                        """, unsafe_allow_html=True)

                    st.markdown("<h4>Factor Extraction Breakdown</h4>", unsafe_allow_html=True)
                    for factor, data in llm_result.items():
                        with st.expander(f"{factor.capitalize()} Factors (Count: {data['count']})", expanded=False):
                            st.markdown("<strong>Explanations:</strong>", unsafe_allow_html=True)
                            for explanation in data["explanations"]:
                                # Unescape HTML entities and preserve line breaks
                                cleaned_explanation = html.unescape(explanation).replace('\n', '<br>')
                                st.markdown(f"<li>{cleaned_explanation}</li>", unsafe_allow_html=True)
                    

                
                with col2:
                    st.markdown("<h3>Formula-Based Analysis</h3>", unsafe_allow_html=True)
                    st.markdown(f"<strong>Formulation Classification:</strong> <span>{formula_labels[0]}</span>", unsafe_allow_html=True)
                    st.markdown(f"<strong>Integrated Formulation:</strong> <span>{formula_labels[1]}</span>", unsafe_allow_html=True)
                    
                    # Add collapsible explanation of formula-based formulation logic
                    with st.expander("Formula-Based Formulation Logic Explanation", expanded=False):
                        st.markdown(get_formulation_explanation(), unsafe_allow_html=True)
                    
                    # Detailed formula breakdown
                    st.markdown("<h4>Word Match Breakdown</h4>", unsafe_allow_html=True)
                    factor_configs = {
                        "integrated": integrated_formulations,
                        "presentation": presentation_factors,
                        "precipitating": precipitating_factors,
                        "predisposing": predisposing_factors,
                        "perpetuating": perpetuating_factors,
                        "protective": protective_factors
                    }
                    
                    for factor, stats in formula_stats.items():
                        if factor == 'multiple':  # Skip 'multiple' if not needed
                            continue
                        
                        # Get all possible words for the factor
                        possible_words = get_all_possible_words(factor_configs[factor])
                        
                        # Calculate total matches
                        total_matches = (
                            sum(stats['first_order']['exact_match'].values()) +
                            sum(stats['first_order']['prefix_match'].values()) +
                            sum(stats['second_order']['exact_match'].values()) +
                            sum(stats['second_order']['prefix_match'].values())
                        )
                        
                        with st.expander(f"{factor.capitalize()} Factors (Matches: {total_matches})", expanded=False):
                            st.markdown("<strong>Matched Keywords:</strong>", unsafe_allow_html=True)
                            exact_matches = list(stats['first_order']['exact_match'].keys()) + list(stats['second_order']['exact_match'].keys())
                            prefix_matches = list(stats['first_order']['prefix_match'].keys()) + list(stats['second_order']['prefix_match'].keys())
                            st.markdown(f"<span>Exact matches:</span> {', '.join(exact_matches) or 'None'}", unsafe_allow_html=True)
                            st.markdown(f"<span>Prefix matches:</span> {', '.join(prefix_matches) or 'None'}", unsafe_allow_html=True)
                            
                            # Show all possible words and their detected counts
                            st.markdown("<strong>All Possible Words and Detection Counts:</strong>", unsafe_allow_html=True)
                            for word in possible_words:
                                count = (
                                    stats['first_order']['exact_match'].get(word, 0) +
                                    stats['first_order']['prefix_match'].get(word, 0) +
                                    stats['second_order']['exact_match'].get(word, 0) +
                                    stats['second_order']['prefix_match'].get(word, 0)
                                )
                                st.markdown(f"<li>{word}: {count} times</li>", unsafe_allow_html=True)

with tab2:
    st.markdown("<div class='custom-title'>Fetch and Analyse Existing Clinical Notes</div>", unsafe_allow_html=True)
    
    # Get date range limits
    min_date, max_date = get_start_end_date()
    
    # Date Range Selection with limits
    col1, col2 = st.columns(2)
    with col1:
        start_date = st.date_input(
            "Start Date",
            value=min_date,
            min_value=min_date,
            max_value=max_date,
            key="start_date"
        )
    with col2:
        end_date = st.date_input(
            "End Date",
            value=max_date,
            min_value=min_date,
            max_value=max_date,
            key="end_date"
        )
    
    # Only show patient selection if dates are selected
    if start_date and end_date:
        if start_date <= end_date:
            patient_ids = get_patient_Ids(start_date, end_date)
            if patient_ids:
                st.markdown("<div class='section-header'>Patient Selection</div>", unsafe_allow_html=True)
                selected_patient = st.selectbox(
                    "Select Patient ID",
                    options=[""] + patient_ids,
                    format_func=lambda x: f"Patient {x}" if x else "Select a patient...",
                    key="patient_select"
                )
                
                if selected_patient:
                    clinical_notes = get_clinical_notes(selected_patient)
                    if clinical_notes:
                        st.markdown("<div class='section-header'>Clinical Note Selection</div>", unsafe_allow_html=True)
                        # Create options with dates
                        note_options = [""] + [
                            f"Note {i+1} - {date}" 
                            for i, (note, date) in enumerate(clinical_notes)
                        ]
                        selected_index = st.selectbox(
                            "Select Clinical Note",
                            options=note_options,
                            format_func=lambda x: x if x else "Select a note...",
                            key="note_select"
                        )
                        
                        if selected_index:
                            note_idx = int(selected_index.split()[1]) - 1
                            selected_note, note_date = clinical_notes[note_idx]
                            
                            # Clean note only for display
                            display_note = display_clinical_note(selected_note)
                            
                            # Display the note
                            st.markdown("<div class='note-container'>", unsafe_allow_html=True)
                            st.markdown(f"<div class='note-date'>Note from {note_date}</div>", unsafe_allow_html=True)
                            safe_markdown_render(display_note)
                            st.markdown("</div>", unsafe_allow_html=True)
                            
                            # Use raw note for analysis
                            if st.button("Analyse", key="analyze_existing"):
                                with st.spinner(""):
                                    # Unescape HTML entities in the note before sending to LLM
                                    raw_note = html.unescape(selected_note)
                                    # print("=== Raw note for tab 2 ===")
                                    # print(raw_note)  # Print full note for debugging
                                    # print("=== End of note ===")
                                    
                                    llm_result = analyze_clinical_notes_with_explanations(raw_note, settings["temperature"])
                                    (formula_labels, formula_stats) = get_formulation_label(raw_note)
                                    
                                    if "error" in llm_result:
                                        st.error("Error in processing the note. Please try again.")
                                    else:
                                        st.success("Analysis Complete!")
                                        
                                        # Calculate LLM formulation classification
                                        llm_formulation_classification, llm_integrated_formulation = get_llm_formulation_classification(llm_result)
                                        
                                        # Create columns for comparison
                                        result_col1, result_col2 = st.columns(2)
                                        
                                        with result_col1:
                                            st.markdown("<h3>LLM Analysis Results</h3>", unsafe_allow_html=True)
                                            st.markdown(f"<strong>Formulation Classification:</strong> <span>{llm_formulation_classification}</span>", unsafe_allow_html=True)
                                            st.markdown(f"<strong>Integrated Formulation:</strong> <span>{llm_integrated_formulation}</span>", unsafe_allow_html=True)

                                            # Add collapsible explanation of LLM formulation logic
                                            with st.expander("LLM Formulation Logic Explanation", expanded=False):
                                                st.markdown("""
                                                <ul>
                                                    <li><strong>Absent 5 P's Formulation:</strong> This label is assigned when fewer than 2 of the 5 P's factors are present.</li>
                                                    <li><strong>Limited 5 P's Formulation:</strong> This label is assigned when 2 or 3 of the 5 P's factors are present.</li>
                                                    <li><strong>Inclusive 5 P's Formulation:</strong> This label is assigned when 4 or more of the 5 P's factors are present.</li>
                                                    <li><strong>Absent Integrated Formulation:</strong> This label is assigned when the integrated factor is not present.</li>
                                                    <li><strong>Inclusive Integrated Formulation:</strong> This label is assigned when the integrated factor is present.</li>
                                                </ul>
                                                """, unsafe_allow_html=True)

                                            st.markdown("<h4>Factor Extraction Breakdown</h4>", unsafe_allow_html=True)
                                            for factor, data in llm_result.items():
                                                with st.expander(f"{factor.capitalize()} Factors (Count: {data['count']})", expanded=False):
                                                    st.markdown("<strong>Explanations:</strong>", unsafe_allow_html=True)
                                                    for explanation in data["explanations"]:
                                                        # Unescape HTML entities and preserve line breaks
                                                        cleaned_explanation = html.unescape(explanation).replace('\n', '<br>')
                                                        st.markdown(f"<li>{cleaned_explanation}</li>", unsafe_allow_html=True)

                                        with result_col2:
                                            st.markdown("<h3>Formula-Based Analysis</h3>", unsafe_allow_html=True)
                                            st.markdown(f"<strong>Formulation Classification:</strong> <span>{formula_labels[0]}</span>", unsafe_allow_html=True)
                                            st.markdown(f"<strong>Integrated Formulation:</strong> <span>{formula_labels[1]}</span>", unsafe_allow_html=True)
                                            
                                            # Add collapsible explanation of formula-based formulation logic
                                            with st.expander("Formula-Based Formulation Logic Explanation", expanded=False):
                                                st.markdown(get_formulation_explanation(), unsafe_allow_html=True)
                                            
                                            # Detailed formula breakdown
                                            st.markdown("<h4>Word Match Breakdown</h4>", unsafe_allow_html=True)
                                            factor_configs = {
                                                "integrated": integrated_formulations,
                                                "presentation": presentation_factors,
                                                "precipitating": precipitating_factors,
                                                "predisposing": predisposing_factors,
                                                "perpetuating": perpetuating_factors,
                                                "protective": protective_factors
                                            }
                                            
                                            for factor, stats in formula_stats.items():
                                                if factor == 'multiple':  # Skip 'multiple' if not needed
                                                    continue
                                                
                                                # Get all possible words for the factor
                                                possible_words = get_all_possible_words(factor_configs[factor])
                                                
                                                # Calculate total matches
                                                total_matches = (
                                                    sum(stats['first_order']['exact_match'].values()) +
                                                    sum(stats['first_order']['prefix_match'].values()) +
                                                    sum(stats['second_order']['exact_match'].values()) +
                                                    sum(stats['second_order']['prefix_match'].values())
                                                )
                                                
                                                with st.expander(f"{factor.capitalize()} Factors (Matches: {total_matches})", expanded=False):
                                                    st.markdown("<strong>Matched Keywords:</strong>", unsafe_allow_html=True)
                                                    exact_matches = list(stats['first_order']['exact_match'].keys()) + list(stats['second_order']['exact_match'].keys())
                                                    prefix_matches = list(stats['first_order']['prefix_match'].keys()) + list(stats['second_order']['prefix_match'].keys())
                                                    st.markdown(f"<span>Exact matches:</span> {', '.join(exact_matches) or 'None'}", unsafe_allow_html=True)
                                                    st.markdown(f"<span>Prefix matches:</span> {', '.join(prefix_matches) or 'None'}", unsafe_allow_html=True)
                                                    
                                                    # Show all possible words and their detected counts
                                                    st.markdown("<strong>All Possible Words and Detection Counts:</strong>", unsafe_allow_html=True)
                                                    for word in possible_words:
                                                        count = (
                                                            stats['first_order']['exact_match'].get(word, 0) +
                                                            stats['first_order']['prefix_match'].get(word, 0) +
                                                            stats['second_order']['exact_match'].get(word, 0) +
                                                            stats['second_order']['prefix_match'].get(word, 0)
                                                        )
                                                        st.markdown(f"<li>{word}: {count} times</li>", unsafe_allow_html=True)
                    else:
                        st.warning("No clinical notes found for this patient.")
            else:
                st.warning("No patients found in the selected date range.")
        else:
            st.error("End date must be after start date.")

with tab3:
    st.markdown("<div class='custom-title'>Settings</div>", unsafe_allow_html=True)
    
    # Password protection
    password = st.text_input("Enter password:", type="password")
    
    if password == "knhuq123":
        st.write("Adjust the system prompt, model name, and temperature. Click Save to update.")
        
        updated_prompt = st.text_area("System Prompt:", value=settings["system_prompt"], height=400, key="system_prompt_input")
        model_name = st.text_input("Model Name", value=settings["model"])
        temperature = st.slider("Temperature", 0.0, 1.0, value=settings["temperature"])
        
        if st.button("Save"):
            settings["system_prompt"] = updated_prompt
            settings["model"] = model_name
            settings["temperature"] = temperature
            save_settings(settings)
            st.success("Settings saved successfully! Any future analysis will use these updated settings.")
    elif password:  # Only show error if password was entered and is wrong
        st.error("Incorrect password. Access denied.")
    else:
        st.info("Please enter the password to access settings.")
