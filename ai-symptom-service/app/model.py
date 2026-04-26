"""
Symptom triage model using ClinicalBERT.
Phase 1: Rule-based fallback so the service starts immediately.
Phase 4: Replace load_model() with fine-tuned ClinicalBERT weights.
"""

import logging
from pathlib import Path

logger = logging.getLogger(__name__)
MODEL_PATH = Path("./models/symptom_classifier")
_model = None
_tokenizer = None


def load_model():
    global _model, _tokenizer
    if MODEL_PATH.exists():
        try:
            from transformers import AutoModelForSequenceClassification, AutoTokenizer
            logger.info("Loading ClinicalBERT model from %s", MODEL_PATH)
            _tokenizer = AutoTokenizer.from_pretrained(str(MODEL_PATH))
            _model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_PATH))
            _model.eval()
            logger.info("ClinicalBERT model loaded successfully")
        except Exception as e:
            logger.warning("Failed to load model: %s — using rule-based fallback", e)
    else:
        logger.info("No model weights found — using rule-based fallback")


def predict(symptoms_text: str) -> dict:
    if _model is not None and _tokenizer is not None:
        return _predict_with_bert(symptoms_text)
    return _predict_rule_based(symptoms_text)


def _predict_with_bert(symptoms_text: str) -> dict:
    import torch
    LABELS = [
        "Common Cold", "Influenza", "COVID-19", "Pneumonia",
        "Gastroenteritis", "Migraine", "Hypertension", "Diabetes",
        "Appendicitis", "Anemia"
    ]
    SEVERITY_MAP = {
        "Common Cold": "LOW", "Influenza": "MEDIUM", "COVID-19": "HIGH",
        "Pneumonia": "HIGH", "Gastroenteritis": "MEDIUM", "Migraine": "MEDIUM",
        "Hypertension": "HIGH", "Diabetes": "HIGH",
        "Appendicitis": "CRITICAL", "Anemia": "MEDIUM"
    }
    inputs = _tokenizer(symptoms_text, return_tensors="pt", max_length=512, truncation=True, padding=True)
    with torch.no_grad():
        outputs = _model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1)[0]
    top_idx = int(probs.argmax())
    top_label = LABELS[top_idx] if top_idx < len(LABELS) else "Unknown"
    confidence = float(probs[top_idx])
    alt_indices = probs.topk(3).indices.tolist()
    alternatives = [LABELS[i] for i in alt_indices if i != top_idx and i < len(LABELS)]
    return {
        "predicted_condition": top_label,
        "severity_level": SEVERITY_MAP.get(top_label, "MEDIUM"),
        "confidence_score": round(confidence, 4),
        "recommendation": _build_recommendation(top_label, SEVERITY_MAP.get(top_label, "MEDIUM")),
        "alternative_conditions": alternatives[:2],
    }


def _predict_rule_based(symptoms_text: str) -> dict:
    text = symptoms_text.lower()

    rules = [
        (
            ["chest pain", "shortness of breath", "difficulty breathing", "heart beating fast", "heart is beating fast"],
            "Cardiac / Respiratory Emergency",
            "CRITICAL",
            0.91
        ),
        (
            ["fever", "cough", "loss of smell", "loss of taste"],
            "COVID-19 (suspected)",
            "HIGH",
            0.82
        ),
        (
            ["fever", "severe headache", "stiff neck", "rash"],
            "Meningitis (suspected)",
            "CRITICAL",
            0.88
        ),
        (
            ["fever", "cough", "chest pain"],
            "Pneumonia (suspected)",
            "HIGH",
            0.78
        ),
        (
            ["red eyes", "watery eyes", "eye irritation", "swollen eyes", "itchy eyes"],
            "Allergic Conjunctivitis",
            "LOW",
            0.85
        ),
        (
            ["irritation", "eyes", "red", "watering", "flu"],
            "Allergic Conjunctivitis with Rhinitis",
            "LOW",
            0.80
        ),
        (
            ["headache", "fever", "body ache", "fatigue", "weak"],
            "Influenza",
            "MEDIUM",
            0.84
        ),
        (
            ["nausea", "vomiting", "diarrhea", "stomach pain"],
            "Gastroenteritis",
            "MEDIUM",
            0.79
        ),
        (
            ["headache", "nausea", "light sensitivity"],
            "Migraine",
            "MEDIUM",
            0.76
        ),
        (
            ["runny nose", "sore throat", "sneezing", "mild fever"],
            "Common Cold",
            "LOW",
            0.88
        ),
        (
            ["runny nose", "sore throat", "sneezing"],
            "Common Cold",
            "LOW",
            0.83
        ),
        (
            ["fatigue", "pale skin", "weakness", "dizziness"],
            "Anemia (suspected)",
            "MEDIUM",
            0.72
        ),
        (
            ["excessive thirst", "frequent urination", "fatigue"],
            "Diabetes (suspected)",
            "HIGH",
            0.77
        ),
    ]

    for keywords, condition, severity, confidence in rules:
        matched = sum(1 for kw in keywords if kw in text)
        threshold = 2 if len(keywords) >= 3 else 1
        if matched >= threshold:
            return {
                "predicted_condition": condition,
                "severity_level": severity,
                "confidence_score": confidence,
                "recommendation": _build_recommendation(condition, severity),
                "alternative_conditions": [],
            }

    return {
        "predicted_condition": "Undetermined — further evaluation needed",
        "severity_level": "MEDIUM",
        "confidence_score": 0.40,
        "recommendation": "Please consult a doctor for a thorough evaluation.",
        "alternative_conditions": [],
    }


def _build_recommendation(condition: str, severity: str) -> str:
    if severity == "CRITICAL":
        return "URGENT: Seek emergency medical care immediately or call emergency services."
    if severity == "HIGH":
        return "Please consult a doctor as soon as possible, ideally within 24 hours."
    if severity == "MEDIUM":
        return "Schedule an appointment with your doctor within the next few days."
    return "Rest, stay hydrated, and monitor your symptoms. See a doctor if symptoms worsen."
