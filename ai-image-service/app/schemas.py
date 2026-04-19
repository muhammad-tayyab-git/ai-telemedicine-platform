from pydantic import BaseModel, Field
from enum import Enum


class ImageType(str, Enum):
    XRAY = "XRAY"
    MRI = "MRI"
    CT_SCAN = "CT_SCAN"
    DERMATOLOGY = "DERMATOLOGY"
    OTHER = "OTHER"


class ImageAnalysisResponse(BaseModel):
    finding: str = Field(description="Primary finding from the image analysis")
    confidence_score: float = Field(ge=0.0, le=1.0, description="Model confidence 0–1")
    recommendation: str = Field(description="Suggested next steps based on finding")
    image_type: ImageType = Field(description="Type of medical image analysed")
    alternative_findings: list[str] = Field(
        default=[],
        description="Other possible findings"
    )
    requires_urgent_review: bool = Field(
        default=False,
        description="True if a radiologist should review urgently"
    )
