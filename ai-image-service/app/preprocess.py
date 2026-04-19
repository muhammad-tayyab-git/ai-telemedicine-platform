from PIL import Image
import io


# Standard ImageNet normalisation used by ResNet / EfficientNet
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
TARGET_SIZE = (224, 224)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp"}
MAX_FILE_SIZE_MB = 10


def validate_image(image_bytes: bytes, filename: str) -> None:
    """Raise ValueError if file is not a valid image or exceeds size limit."""
    import os
    ext = os.path.splitext(filename.lower())[1]
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file type '{ext}'. Allowed: {ALLOWED_EXTENSIONS}")

    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise ValueError(f"File too large ({size_mb:.1f} MB). Max allowed: {MAX_FILE_SIZE_MB} MB")

    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
    except Exception:
        raise ValueError("Invalid or corrupted image file")


def preprocess_image(image_bytes: bytes):
    """
    Load image bytes, resize to 224×224, convert to RGB tensor.
    Returns a torch tensor of shape (1, 3, 224, 224) ready for the model.
    """
    import torch
    from torchvision import transforms

    transform = transforms.Compose([
        transforms.Resize(TARGET_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = transform(image)
    return tensor.unsqueeze(0)  # add batch dimension


def detect_image_type(filename: str) -> str:
    """
    Heuristic image type detection from filename.
    In production this would use DICOM metadata.
    """
    name = filename.lower()
    if any(kw in name for kw in ["xray", "x-ray", "chest", "bone"]):
        return "XRAY"
    if any(kw in name for kw in ["mri", "brain", "spine"]):
        return "MRI"
    if any(kw in name for kw in ["ct", "scan", "abdomen"]):
        return "CT_SCAN"
    if any(kw in name for kw in ["skin", "derm", "lesion", "mole"]):
        return "DERMATOLOGY"
    return "OTHER"
