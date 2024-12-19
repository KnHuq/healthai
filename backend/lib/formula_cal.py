from collections import defaultdict
from config.formula import integrated_formulations, presentation_factors, precipitating_factors, predisposing_factors, perpetuating_factors, protective_factors, multiple_factors
import re
# def get_exact_match_from_text(text, list_of_words):
#     text = str(text.lower().strip())
#     list_of_words = [word.lower().strip() for word in list_of_words]
#     text_split = text.split(" ")
#     word_match_count_dict = defaultdict(int)

#     for word in list_of_words:
#         if word in text_split:
#             word_match_count_dict[word] += text_split.count(word)
    
#     return word_match_count_dict

# def get_prefix_match_from_text(text, list_of_words):
    
#     text = str(text.lower().strip())
#     list_of_words = [word.lower().strip() for word in list_of_words]
#     text_split = text.split(" ")
#     word_match_count_dict = defaultdict(int)

#     for word in list_of_words:
#         for text_word in text_split:
#             if text_word.startswith(word):
#                 word_match_count_dict[word] += 1
            
    
#     return word_match_count_dict


def get_exact_match_from_text(text, list_of_words):
    
    word_match_count_dict = defaultdict(int)

    for word in list_of_words:
        pattern = re.compile(re.escape(word), re.IGNORECASE)
        match = pattern.findall(text)
        if len(match)>0:
            word_match_count_dict[word] += len(match)
    
    return word_match_count_dict

def get_prefix_match_from_text(text, list_of_words):
    
    word_match_count_dict = defaultdict(int)

    for word in list_of_words:
        pattern = re.compile(r'\b' + re.escape(word), re.IGNORECASE)
        match = pattern.findall(text)
        if len(match)>0:
            word_match_count_dict[word] += len(match)
    
    return word_match_count_dict


def get_exact_and_prefix_match_stat_from_text(text, order_dict):
    text = str(text.lower().strip())
    list_of_exact_words, list_of_prefix_words = order_dict['exact'], order_dict['prefix']
    exact_match_stat = get_exact_match_from_text(text, list_of_exact_words)
    prefix_match_stat = get_prefix_match_from_text(text, list_of_prefix_words)

    data = {
        "exact_match": exact_match_stat,
        "prefix_match": prefix_match_stat
    }
    return data

def get_match_stat_from_text(text, formulation_dict):
    
    text = str(text.lower().strip())
    first_order_dict = formulation_dict['first_order']
    second_order_dict = formulation_dict['second_order']

    first_order_stat = get_exact_and_prefix_match_stat_from_text(text, first_order_dict)
    second_order_stat = get_exact_and_prefix_match_stat_from_text(text, second_order_dict)

    data = {
        "first_order": first_order_stat,
        "second_order": second_order_stat
    }
    return data

def get_grouping_label(formulation_match_stat_dict, use_first_order = True, use_second_order = True, use_multiple_order = False):

    if use_multiple_order:
        raise NotImplementedError("Multiple order is not implemented yet")
    
    orders_to_use = [] + (["first_order"] if use_first_order else []) + (["second_order"] if use_second_order else [])
    new_stat_dict = {}
    all_key_words = []
    for k,v in formulation_match_stat_dict.items():
        total_count = 0
        for order in orders_to_use:
            for k2,v2 in v[order].items():
                total_count += len(v2.keys())
                if len(v2.keys()) > 0:
                    # if k != 'multiple':
                    # print ("WARNING!!! Multiple order is not implemented yet")
                    all_key_words += list(v2.keys())

        new_stat_dict[k] = total_count

    new_stat_dict_raw = new_stat_dict.copy()
    integrated = new_stat_dict.pop('integrated')
    multiple = new_stat_dict.pop('multiple')
    number_of_presented_formulation = len([k for k,v in new_stat_dict.items() if v > 0])

    if number_of_presented_formulation < 2:
        return "Absent 5 P's Formulation", 'Absent Integrated Formulation', all_key_words, new_stat_dict_raw
    elif number_of_presented_formulation >=2 and number_of_presented_formulation < 4:       
        return "Limited 5 P's Formulation", "Absent Integrated Formulation", all_key_words, new_stat_dict_raw
    elif number_of_presented_formulation >= 4:
        if integrated == 0:
            return "Inclusive 5 P's Formulation", "Absent Integrated Formulation", all_key_words, new_stat_dict_raw
        if integrated <= 3:
            return "Inclusive 5 P's Formulation", "Limited Integrated Formulation", all_key_words, new_stat_dict_raw    
        elif integrated >=4:
            return "Inclusive 5 P's Formulation", "Inclusive Integrated Formulation", all_key_words, new_stat_dict_raw
    
def get_formulation_label(text):
    text = str(text.lower().strip())
    formula_stat = {
        "integrated": get_match_stat_from_text(text, integrated_formulations),
        "presentation": get_match_stat_from_text(text, presentation_factors),
        "precipitating": get_match_stat_from_text(text, precipitating_factors),
        "predisposing": get_match_stat_from_text(text, predisposing_factors),
        "perpetuating": get_match_stat_from_text(text, perpetuating_factors),
        "protective": get_match_stat_from_text(text, protective_factors),
        "multiple": get_match_stat_from_text(text, multiple_factors)
    }
    return get_grouping_label(formula_stat), formula_stat


