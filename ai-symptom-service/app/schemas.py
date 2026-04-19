from pydantic import BaseModel, Field
from enum import Enum


class SeverityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class SymptomRequest(BaseModel):
    symptoms: str = Field(
        ...,
        min_length=5,
        max_length=2000,
        description="Patient-reported symptoms in natural language",
        example="I have a persistent headache, fever of 38.5C, and sore throat for 3 days"
    )


class SymptomPredictionResponse(BaseModel):
    predicted_condition: str = Field(description="Most likely medical condition")
    severity_level: SeverityLevel = Field(description="Severity classification")
    confidence_score: float = Field(ge=0.0, le=1.0, description="Model confidence 0–1")
    recommendation: str = Field(description="Suggested next steps for the patient")
    alternative_conditions: list[str] = Field(
        default=[],
        description="Other possible conditions"
    )
