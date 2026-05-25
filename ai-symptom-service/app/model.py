"""
Symptom triage model — enriched input support.
Phase 1: Rule-based classifier using symptom keywords + context.
Phase 4: Fine-tuned ClinicalBERT on Symptom2Disease dataset.
"""
import logging
import re
from pathlib import Path

logger = logging.getLogger(__name__)
MODEL_PATH = Path("./models/symptom_classifier")
_model = None
_tokenizer = None


def load_model():
    global _model, _tokenizer
    if not MODEL_PATH.exists():
        logger.info("No model weights — using enhanced rule-based classifier")
        return
    try:
        from transformers import AutoModelForSequenceClassification, AutoTokenizer
        _tokenizer = AutoTokenizer.from_pretrained(str(MODEL_PATH))
        _model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_PATH))
        _model.eval()
        logger.info("ClinicalBERT loaded")
    except Exception as e:
        logger.warning("Model load failed: %s — using rule-based", e)


def predict(symptoms_text: str) -> dict:
    if _model is not None and _tokenizer is not None:
        return _predict_with_bert(symptoms_text)
    return _predict_rule_based(symptoms_text)


def _predict_with_bert(text: str) -> dict:
    import torch
    LABELS = [
        "Common Cold", "Influenza", "COVID-19", "Pneumonia",
        "Gastroenteritis", "Migraine", "Hypertension", "Diabetes",
        "Appendicitis", "Anemia", "Allergic Rhinitis", "Allergic Conjunctivitis"
    ]
    SEVERITY = {
        "Common Cold": "LOW", "Influenza": "MEDIUM", "COVID-19": "HIGH",
        "Pneumonia": "HIGH", "Gastroenteritis": "MEDIUM", "Migraine": "MEDIUM",
        "Hypertension": "HIGH", "Diabetes": "HIGH", "Appendicitis": "CRITICAL",
        "Anemia": "MEDIUM", "Allergic Rhinitis": "LOW", "Allergic Conjunctivitis": "LOW"
    }
    inputs = _tokenizer(text, return_tensors="pt", max_length=512, truncation=True, padding=True)
    with __import__('torch').no_grad():
        probs = __import__('torch').softmax(_model(**inputs).logits, dim=-1)[0]
    top = int(probs.argmax())
    label = LABELS[top] if top < len(LABELS) else "Unknown"
    conf = float(probs[top])
    alts = [LABELS[i] for i in probs.topk(3).indices.tolist() if i != top and i < len(LABELS)]
    return {
        "predicted_condition": label,
        "severity_level": SEVERITY.get(label, "MEDIUM"),
        "confidence_score": round(conf, 4),
        "recommendation": _build_recommendation(label, SEVERITY.get(label, "MEDIUM")),
        "alternative_conditions": alts[:2],
    }


def _predict_rule_based(text: str) -> dict:
    t = text.lower()

    # Extract context fields from the enriched natural language string
    age_group   = _extract(t, r'age group ([a-z0-9\-+]+)')
    duration    = _extract(t, r'duration: ([^.]+)')
    sev_match   = _extract(t, r'severity: (\d+)/10')
    severity_n  = int(sev_match) if sev_match and sev_match.isdigit() else 5
    has_pollen  = 'high' in t and 'pollen' in t
    season      = _extract(t, r'season: ([a-z]+)')

    rules = [
        # Critical cardiac / respiratory
        (["chest pain", "shortness of breath"],                 "Cardiac / Respiratory Emergency",          "CRITICAL", 0.91),
        (["chest pain", "heart palpitations"],                  "Cardiac Arrhythmia (suspected)",           "CRITICAL", 0.88),
        (["chest pain", "arm pain", "sweating"],                "Myocardial Infarction (suspected)",        "CRITICAL", 0.93),
        # Neurological
        (["fever", "stiff neck", "severe headache"],            "Meningitis (suspected)",                   "CRITICAL", 0.89),
        # Respiratory infections
        (["fever", "cough", "loss of taste"],                   "COVID-19 (suspected)",                     "HIGH",     0.83),
        (["fever", "cough", "loss of smell"],                   "COVID-19 (suspected)",                     "HIGH",     0.82),
        (["fever", "cough", "chest pain"],                      "Pneumonia (suspected)",                    "HIGH",     0.79),
        (["fever", "cough", "shortness of breath"],             "Pneumonia (suspected)",                    "HIGH",     0.77),
        # Allergy — eye + nasal
        (["watery eyes", "eye itching", "sneezing"],            "Allergic Rhinoconjunctivitis",             "LOW",      0.87),
        (["watery eyes", "runny nose", "sneezing"],             "Allergic Rhinoconjunctivitis",             "LOW",      0.86),
        (["watery eyes", "runny nose"],                         "Allergic Rhinitis",                        "LOW",      0.82),
        (["eye itching", "eye redness"],                        "Allergic Conjunctivitis",                  "LOW",      0.80),
        (["sneezing", "runny nose", "nasal congestion"],        "Allergic Rhinitis",                        "LOW",      0.84),
        # Flu / viral
        (["fever", "body aches", "fatigue", "headache"],        "Influenza",                                "MEDIUM",   0.85),
        (["fever", "body aches", "fatigue"],                    "Influenza",                                "MEDIUM",   0.80),
        (["fever", "sore throat", "fatigue"],                   "Viral Pharyngitis / Flu",                  "MEDIUM",   0.78),
        # Cold
        (["runny nose", "sneezing", "sore throat"],             "Common Cold",                              "LOW",      0.88),
        (["runny nose", "sore throat", "cough"],                "Common Cold",                              "LOW",      0.85),
        # GI
        (["nausea", "vomiting", "diarrhea"],                    "Gastroenteritis",                          "MEDIUM",   0.82),
        (["stomach pain", "nausea", "diarrhea"],                "Gastroenteritis",                          "MEDIUM",   0.79),
        (["stomach pain", "bloating", "indigestion"],           "Dyspepsia / GERD",                        "LOW",      0.74),
        # Headache
        (["headache", "nausea", "light sensitivity"],           "Migraine",                                 "MEDIUM",   0.77),
        (["headache", "neck stiffness", "fever"],               "Possible Meningism",                       "HIGH",     0.80),
        # Senior-specific
        (["dizziness", "balance problems", "weakness"],         "Possible Vestibular / Neurological Issue", "HIGH",     0.75),
        (["shortness of breath", "fatigue", "chest tightness"], "Possible Cardiac / Pulmonary Issue",       "HIGH",     0.78),
        # Child-specific
        (["earache", "fever", "sore throat"],                   "Acute Otitis Media",                       "MEDIUM",   0.81),
        (["stomach pain", "vomiting", "fever"],                 "Possible Appendicitis",                    "HIGH",     0.76),
        # Dermatology
        (["skin rash", "itching", "redness"],                   "Allergic Dermatitis",                      "LOW",      0.78),
    ]

    for keywords, condition, severity, confidence in rules:
        matched = sum(1 for kw in keywords if kw in t)
        threshold = max(2, len(keywords) - 1)
        if matched >= threshold:
            # Boost severity if high severity score reported
            if severity_n >= 8 and severity == "MEDIUM":
                severity = "HIGH"
            # Boost for high pollen + allergy conditions
            if has_pollen and "allerg" in condition.lower():
                confidence = min(0.96, confidence + 0.06)
            return {
                "predicted_condition": condition,
                "severity_level": severity,
                "confidence_score": round(confidence, 4),
                "recommendation": _build_recommendation(condition, severity, duration, age_group),
                "alternative_conditions": [],
            }

    return {
        "predicted_condition": "Undetermined — further evaluation needed",
        "severity_level": "MEDIUM",
        "confidence_score": 0.40,
        "recommendation": "Your symptoms could not be matched to a specific pattern. Please consult a doctor for a thorough evaluation.",
        "alternative_conditions": [],
    }


def _extract(text, pattern):
    m = re.search(pattern, text)
    return m.group(1).strip() if m else None


def _build_recommendation(condition: str, severity: str, duration: str = None, age_group: str = None) -> str:
    dur_note = f" You mentioned having these symptoms for {duration}." if duration else ""
    age_note = f" For {age_group} patients, " if age_group else " "

    if severity == "CRITICAL":
        return "URGENT: Seek emergency medical care immediately or call emergency services."

    if severity == "HIGH":
        base = "Please consult a doctor as soon as possible — ideally within 24 hours."
        return base + dur_note

    if "allerg" in condition.lower():
        rec = "Consider antihistamine medication (e.g. cetirizine or fexofenadine) for relief."
        rec += " Limit outdoor exposure between 6–10 AM when pollen levels peak."
        rec += dur_note
        return rec

    if severity == "MEDIUM":
        return f"Schedule an appointment with your doctor within the next 2–3 days.{dur_note}"

    return f"Rest, stay hydrated, and monitor your symptoms.{dur_note} See a doctor if symptoms worsen or persist beyond 5 days."
