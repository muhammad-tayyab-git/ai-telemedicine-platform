import re


def clean_symptoms(text: str) -> str:
    """
    Clean and normalise raw symptom text before passing to the model.
    - Lowercase
    - Remove special characters except commas, periods, hyphens
    - Collapse multiple spaces
    - Strip leading/trailing whitespace
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s,.\-]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_keywords(text: str) -> list[str]:
    """
    Extract medically relevant keywords from symptom text.
    Used for the rule-based fallback in model.py.
    """
    symptom_keywords = [
        "fever", "cough", "headache", "fatigue", "nausea", "vomiting",
        "diarrhea", "chest pain", "shortness of breath", "sore throat",
        "runny nose", "body ache", "dizziness", "rash", "swelling",
        "loss of taste", "loss of smell", "difficulty breathing",
        "stomach pain", "back pain", "joint pain", "muscle pain",
        "pale skin", "weakness", "excessive thirst", "frequent urination",
        "light sensitivity", "stiff neck", "confusion", "blurred vision",
    ]
    found = [kw for kw in symptom_keywords if kw in text]
    return found
