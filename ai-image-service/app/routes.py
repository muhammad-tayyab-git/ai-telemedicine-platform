from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas import ImageAnalysisResponse
from app.preprocess import validate_image, preprocess_image, detect_image_type
from app import model

router = APIRouter()


@router.on_event("startup")
async def startup_event():
    """Load the ML model when the service starts."""
    model.load_model()


@router.post("/analyze", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyse a medical image (X-ray, MRI, CT scan, dermatology photo).

    - **file**: Image file (JPG, PNG, BMP, TIFF — max 10 MB)

    Returns the primary finding, confidence score, image type,
    and whether urgent radiologist review is required.
    """
    image_bytes = await file.read()

    try:
        validate_image(image_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        image_type = detect_image_type(file.filename)
        tensor = preprocess_image(image_bytes)
        result = model.predict(tensor, image_type)
        return ImageAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")
