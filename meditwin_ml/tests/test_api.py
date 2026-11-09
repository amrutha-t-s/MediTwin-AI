"""
Integration tests for FastAPI endpoints: request validation, HTTP status codes, and JSON schemas.
"""
import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from api.main import app

client = TestClient(app)

def test_health_check_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["models_registered"] == 7
    assert "disclaimer" in data

def test_pima_endpoint_valid():
    payload = {
        "glucose": 130,
        "bmi": 27.5,
        "age": 38,
        "blood_pressure": 75
    }
    res = client.post("/predict/diabetes-risk-pima", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "result" in data
    assert "probability" in data
    assert "disclaimer" in data

def test_pima_endpoint_invalid_input_400():
    # Negative glucose is out of bounds
    payload = {"glucose": -10, "bmi": 25, "age": 40}
    res = client.post("/predict/diabetes-risk-pima", json=payload)
    assert res.status_code == 400
    data = res.json()
    assert "error" in data
    assert "Validation Error" in data["error"]

def test_cdc_endpoint_valid():
    payload = {
        "bmi": 26.5,
        "high_bp": 0,
        "high_chol": 0,
        "phys_activity": 1
    }
    res = client.post("/predict/diabetes-risk-cdc", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "result" in data
    assert "probability" in data

def test_framingham_endpoint_valid():
    payload = {
        "age": 48,
        "sys_bp": 128,
        "tot_chol": 195,
        "current_smoker": 0
    }
    res = client.post("/predict/cardio-risk-framingham", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "result" in data
    assert "probability" in data

def test_cardiovascular_endpoint_valid():
    payload = {
        "height": 170,
        "weight": 72,
        "ap_hi": 122,
        "ap_lo": 78,
        "age_years": 44
    }
    res = client.post("/predict/cardio-risk", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "result" in data
    assert "probability" in data

def test_cardiovascular_endpoint_invalid_bp_400():
    # ap_lo >= ap_hi is biologically invalid
    payload = {
        "height": 170,
        "weight": 72,
        "ap_hi": 110,
        "ap_lo": 130
    }
    res = client.post("/predict/cardio-risk", json=payload)
    assert res.status_code == 400

def test_obesity_endpoint_valid():
    payload = {
        "height": 1.72,
        "weight": 68.0,
        "age": 26,
        "gender": "Female"
    }
    res = client.post("/predict/obesity-risk", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "result" in data
    assert "raw_category" in data

def test_stress_endpoint_valid():
    payload = {
        "sleep_duration": 6.8,
        "daily_steps": 6200,
        "heart_rate": 70
    }
    res = client.post("/predict/stress-level", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "result" in data
    assert "estimated_stress_score" in data

def test_sleep_quality_endpoint_valid():
    payload = {
        "sleep_duration": 7.2,
        "stress_level": 5,
        "daily_steps": 7000
    }
    res = client.post("/predict/sleep-quality", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "result" in data
    assert "estimated_quality_score" in data

def test_health_summary_endpoint_valid():
    payload = {
        "age": 36,
        "sex": "Female",
        "height": 165,
        "weight": 62,
        "glucose": 105,
        "blood_pressure": "118/76",
        "sleep_hours": 7.5,
        "steps": 8500
    }
    res = client.post("/health-summary", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "overall_summary" in data
    assert "models" in data
    assert "disclaimer" in data
