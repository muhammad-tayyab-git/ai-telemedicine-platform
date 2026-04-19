from fastapi import APIRouter, HTTPException
from app.schemas import SymptomRequest, SymptomPredictionResponse
from app.preprocess import clean_symptoms
from app import model

router = APIRouter()


@router.on_event("startup")
async def startup_event():
    """Load the ML model when the service starts."""
    model.load_model()


@router.post("/predict", response_model=SymptomPredictionResponse)
async def predict_symptoms(request: SymptomRequest):
    """
    Analyse patient-reported symptoms and return a triage prediction.

    - **symptoms**: Free-text description of symptoms (5–2000 characters)

    Returns predicted condition, severity level, confidence score,
    and recommended next steps.
    """
    try:
        cleaned = clean_symptoms(request.symptoms)
        if len(cleaned) < 5:
            raise HTTPException(
                status_code=422,
                detail="Symptoms text too short after cleaning. Please provide more detail."
            )
        result = model.predict(cleaned)
        return SymptomPredictionResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
