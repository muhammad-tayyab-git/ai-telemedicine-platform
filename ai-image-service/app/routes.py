from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas import ImageAnalysisResponse
from app.preprocess import validate_image, detect_image_type
from app import model

router = APIRouter()


@router.on_event("startup")
async def startup_event():
    model.load_model()


@router.post("/analyze", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyse a medical image (X-ray, MRI, CT scan, dermatology photo).
    Accepts JPG, PNG, BMP, TIFF — max 10 MB.
    """
    image_bytes = await file.read()

    try:
        validate_image(image_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        image_type = detect_image_type(file.filename)
        result = model.predict(image_bytes, image_type)
        return ImageAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")
