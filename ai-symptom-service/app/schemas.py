from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional


class SeverityLevel(str, Enum):
    LOW      = "LOW"
    MEDIUM   = "MEDIUM"
    HIGH     = "HIGH"
    CRITICAL = "CRITICAL"


class SymptomRequest(BaseModel):
    symptoms: str = Field(
        ...,
        min_length=5,
        max_length=5000,
        description="Natural language symptom description — enriched by backend",
        example="Patient profile: age group adult. Symptoms: Sneezing, Watery eyes, Runny nose. Duration: 2-3 days. Severity: 5/10. Location: Budapest. Season: spring. Pollen level: high."
    )


class SymptomPredictionResponse(BaseModel):
    predicted_condition:  str            = Field(description="Most likely medical condition")
    severity_level:       SeverityLevel  = Field(description="Severity classification")
    confidence_score:     float          = Field(ge=0.0, le=1.0)
    recommendation:       str            = Field(description="Personalised next steps")
    alternative_conditions: list[str]    = Field(default=[])
