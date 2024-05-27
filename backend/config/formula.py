
integrated_formulations = {

    "first_order":{
        "exact": ["goals", "diagnosis", "differential", "dx", "gap", "driver", "risks", "risk state", "risk status", "foreseeable", "available resources"],
        "prefix": []
    },
    "second_order":{
        "exact": [],
        "prefix": []
    } 

}

presentation_factors = {
    "first_order": {
        "exact": [ "symptom"],
        "prefix": ["present", "histor"]    
    }, 
    "second_order": {
        "exact": ["admission-to", "arrived", "concerns", "current-episode", "experiencing"],
        "prefix": []
    }
}


precipitating_factors = {
    "first_order": {
        "exact": ["context", "trigger"],
        "prefix": ["percipit"]
    },
    "second_order": {
        "exact": ["relapse", "instigate", "induced", "exacerbated"],
        "prefix": []
    }
}

predisposing_factors = {
    "first_order": {
        "exact": ["background"],
        "prefix": ["predispos", "vulnerab"]
    },
    "second_order": {
        "exact": ["hereditary", "pattern", "records", "genetically"],
        "prefix": []
    }
}

perpetuating_factors = {
    "first_order": {
        "exact": ["contribute", "maintain"],
        "prefix": ["perpetuat"]
    },
    "second_order": {
        "exact": ["lasted", "ongoing", "regular use"],
        "prefix": []
    }
}

protective_factors = {
    "first_order": {
        "exact": ["strength", "potential"],
        "prefix": ["protect"]
    },
    "second_order": {
        "exact": ["compliant", "coping", "hobbies", "improved", "improvement", "loving", "relationship", "friendship", "connection", "supported", "supportive"],
        "prefix": []
    }
}

multiple_factors = {
    "first_order": {
        "exact": ["background", "trigger", "hx"],
        "prefix": ["histor"]
    },
    "second_order": {
        "exact": ["substance", "abuse", "stressors", "support", "experience"],
        "prefix": []
    }

}