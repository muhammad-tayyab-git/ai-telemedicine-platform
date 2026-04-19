from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "symptom-triage"


def test_predict_returns_valid_structure():
    response = client.post("/predict", json={
        "symptoms": "I have a fever, sore throat, and body aches for 3 days"
    })
    assert response.status_code == 200
    data = response.json()
    assert "predicted_condition" in data
    assert "severity_level" in data
    assert "confidence_score" in data
    assert "recommendation" in data
    assert data["severity_level"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert 0.0 <= data["confidence_score"] <= 1.0


def test_predict_too_short():
    response = client.post("/predict", json={"symptoms": "hi"})
    assert response.status_code == 422


def test_predict_critical_symptoms():
    response = client.post("/predict", json={
        "symptoms": "severe chest pain and shortness of breath, difficulty breathing"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["severity_level"] in ["HIGH", "CRITICAL"]


def test_predict_mild_symptoms():
    response = client.post("/predict", json={
        "symptoms": "runny nose, sneezing, mild sore throat and mild fever"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["severity_level"] in ["LOW", "MEDIUM"]
