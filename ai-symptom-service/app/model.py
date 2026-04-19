"""
Symptom triage model using ClinicalBERT.

Phase 1: Uses a rule-based fallback so the service starts immediately.
Phase 4: Replace load_model() with actual fine-tuned ClinicalBERT weights.

To fine-tune:
  from transformers import AutoModelForSequenceClassification, AutoTokenizer
  model = AutoModelForSequenceClassification.from_pretrained("medicalai/ClinicalBERT", num_labels=N)
  tokenizer = AutoTokenizer.from_pretrained("medicalai/ClinicalBERT")
  # ... training loop ...
  model.save_pretrained("./models/symptom_classifier")
  tokenizer.save_pretrained("./models/symptom_classifier")
"""

import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

MODEL_PATH = Path("./models/symptom_classifier")

_model = None
_tokenizer = None


def load_model():
    """Load ClinicalBERT model if weights exist, else use rule-based fallback."""
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
        logger.info("No model weights found at %s — using rule-based fallback", MODEL_PATH)


def predict(symptoms_text: str) -> dict:
    """
    Return prediction dict.
    If fine-tuned model is loaded, use it.
    Otherwise use keyword-based rules as a placeholder.
    """
    if _model is not None and _tokenizer is not None:
        return _predict_with_bert(symptoms_text)
    return _predict_rule_based(symptoms_text)


def _predict_with_bert(symptoms_text: str) -> dict:
    """BERT-based classification — used once model weights are available."""
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

    inputs = _tokenizer(
        symptoms_text, return_tensors="pt",
        max_length=512, truncation=True, padding=True
    )

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
    """Keyword-based placeholder — replace with BERT in Phase 4."""
    text = symptoms_text.lower()

    rules = [
        (["chest pain", "shortness of breath", "difficulty breathing"], "Cardiac/Respiratory Emergency", "CRITICAL"),
        (["fever", "cough", "loss of smell", "loss of taste"], "COVID-19 (suspected)", "HIGH"),
        (["fever", "severe headache", "stiff neck", "rash"], "Meningitis (suspected)", "CRITICAL"),
        (["fever", "cough", "chest pain"], "Pneumonia (suspected)", "HIGH"),
        (["headache", "fever", "body ache", "fatigue"], "Influenza", "MEDIUM"),
        (["nausea", "vomiting", "diarrhea", "stomach pain"], "Gastroenteritis", "MEDIUM"),
        (["headache", "nausea", "light sensitivity"], "Migraine", "MEDIUM"),
        (["runny nose", "sore throat", "sneezing", "mild fever"], "Common Cold", "LOW"),
        (["fatigue", "pale skin", "weakness", "dizziness"], "Anemia (suspected)", "MEDIUM"),
        (["excessive thirst", "frequent urination", "fatigue"], "Diabetes (suspected)", "HIGH"),
    ]

    for keywords, condition, severity in rules:
        if sum(1 for kw in keywords if kw in text) >= 2:
            return {
                "predicted_condition": condition,
                "severity_level": severity,
                "confidence_score": 0.72,
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
