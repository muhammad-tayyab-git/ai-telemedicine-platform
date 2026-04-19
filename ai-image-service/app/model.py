"""
Medical image screening model using ResNet-50 / EfficientNet-B0.

Phase 1: Returns a rule-based placeholder so the service starts immediately.
Phase 4: Replace load_model() with fine-tuned weights from NIH Chest X-ray dataset.

To fine-tune:
  import torchvision.models as models
  model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
  model.fc = torch.nn.Linear(model.fc.in_features, NUM_CLASSES)
  # ... training loop on NIH ChestX-ray14 ...
  torch.save(model.state_dict(), "./models/image_classifier.pt")
"""

import logging
from pathlib import Path

logger = logging.getLogger(__name__)

MODEL_PATH = Path("./models/image_classifier.pt")

_model = None

XRAY_LABELS = [
    "No Finding", "Atelectasis", "Cardiomegaly", "Effusion",
    "Infiltration", "Mass", "Nodule", "Pneumonia",
    "Pneumothorax", "Consolidation"
]

URGENT_CONDITIONS = {
    "Pneumothorax", "Cardiomegaly", "Pneumonia", "Mass", "Consolidation"
}


def load_model():
    """Load ResNet-50 weights if available, else use placeholder."""
    global _model

    if MODEL_PATH.exists():
        try:
            import torch
            import torchvision.models as models

            logger.info("Loading image classifier from %s", MODEL_PATH)
            base = models.resnet50(weights=None)
            base.fc = torch.nn.Linear(base.fc.in_features, len(XRAY_LABELS))
            base.load_state_dict(torch.load(str(MODEL_PATH), map_location="cpu"))
            base.eval()
            _model = base
            logger.info("Image classifier loaded successfully")
        except Exception as e:
            logger.warning("Failed to load model: %s — using placeholder", e)
    else:
        logger.info("No model weights at %s — using placeholder responses", MODEL_PATH)


def predict(image_tensor, image_type: str) -> dict:
    """Return prediction dict for the given image tensor."""
    if _model is not None:
        return _predict_with_model(image_tensor, image_type)
    return _predict_placeholder(image_type)


def _predict_with_model(image_tensor, image_type: str) -> dict:
    """ResNet-based classification."""
    import torch

    with torch.no_grad():
        outputs = _model(image_tensor)
        probs = torch.softmax(outputs, dim=1)[0]

    top_idx = int(probs.argmax())
    top_label = XRAY_LABELS[top_idx]
    confidence = float(probs[top_idx])

    alt_indices = probs.topk(3).indices.tolist()
    alternatives = [XRAY_LABELS[i] for i in alt_indices if i != top_idx]

    return {
        "finding": top_label,
        "confidence_score": round(confidence, 4),
        "recommendation": _build_recommendation(top_label),
        "image_type": image_type,
        "alternative_findings": alternatives[:2],
        "requires_urgent_review": top_label in URGENT_CONDITIONS and confidence > 0.6,
    }


def _predict_placeholder(image_type: str) -> dict:
    """Placeholder response — replace with real model in Phase 4."""
    return {
        "finding": "No obvious abnormality detected (placeholder — model not loaded)",
        "confidence_score": 0.0,
        "recommendation": (
            "This is a placeholder response. Once the AI model is trained and loaded, "
            "real analysis will be provided. Please have this image reviewed by a radiologist."
        ),
        "image_type": image_type,
        "alternative_findings": [],
        "requires_urgent_review": False,
    }


def _build_recommendation(finding: str) -> str:
    if finding == "No Finding":
        return "No significant abnormality detected. Continue routine monitoring."
    if finding in URGENT_CONDITIONS:
        return f"{finding} detected. Urgent radiologist review recommended."
    return f"{finding} detected. Please follow up with your doctor for further evaluation."
