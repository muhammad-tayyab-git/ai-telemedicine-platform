import io
from PIL import Image
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def _make_test_image(size=(224, 224), color="RGB") -> bytes:
    """Create a minimal valid PNG image in memory."""
    img = Image.new(color, size, color=(128, 128, 128))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "image-screening"


def test_analyze_valid_image():
    img_bytes = _make_test_image()
    response = client.post(
        "/analyze",
        files={"file": ("test_xray.png", img_bytes, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "finding" in data
    assert "confidence_score" in data
    assert "recommendation" in data
    assert "image_type" in data
    assert "requires_urgent_review" in data
    assert 0.0 <= data["confidence_score"] <= 1.0


def test_analyze_detects_xray_type():
    img_bytes = _make_test_image()
    response = client.post(
        "/analyze",
        files={"file": ("chest_xray.png", img_bytes, "image/png")}
    )
    assert response.status_code == 200
    assert response.json()["image_type"] == "XRAY"


def test_analyze_invalid_file_type():
    response = client.post(
        "/analyze",
        files={"file": ("report.pdf", b"%PDF fake content", "application/pdf")}
    )
    assert response.status_code == 422
