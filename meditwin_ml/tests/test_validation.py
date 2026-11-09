"""
Unit tests for input validation, boundary checks, and safety rules across all 7 models.
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.diabetes_pima import predict_pima_diabetes_risk
from src.diabetes_cdc import predict_cdc_diabetes_risk
from src.hypertension_framingham import predict_framingham_cardio_risk
from src.cardiovascular import predict_cardiovascular_risk
from src.obesity import predict_obesity_risk
from src.stress import predict_stress_level
from src.sleep_quality import predict_sleep_quality
from src.health_summary import generate_health_summary

FORBIDDEN_PHRASES = [
    "you have diabetes",
    "you will get heart disease",
    "stop medication",
    "change insulin",
    "this is medical advice"
]

def assert_safety_compliance(response_dict):
    assert "disclaimer" in response_dict, "Response must include a disclaimer"
    assert "uncertainty" in response_dict, "Response must include an uncertainty statement"
    
    # Textual scan
    full_text = " ".join([str(v) for v in response_dict.values()]).lower()
    for phrase in FORBIDDEN_PHRASES:
        assert phrase not in full_text, f"Safety violation: response contained forbidden phrase '{phrase}'"

def test_pima_diabetes_valid_and_safety():
    res = predict_pima_diabetes_risk({
        "glucose": 135,
        "bmi": 28.5,
        "age": 42,
        "blood_pressure": 76
    })
    assert "result" in res
    assert "probability" in res
    assert 0.0 <= res["probability"] <= 1.0
    assert_safety_compliance(res)

def test_cdc_diabetes_valid_and_safety():
    res = predict_cdc_diabetes_risk({
        "high_bp": 1,
        "high_chol": 1,
        "bmi": 31.0,
        "phys_activity": 0
    })
    assert "result" in res
    assert "probability" in res
    assert_safety_compliance(res)

def test_framingham_cardio_valid_and_safety():
    res = predict_framingham_cardio_risk({
        "age": 52,
        "sys_bp": 142,
        "tot_chol": 220,
        "current_smoker": 1
    })
    assert "result" in res
    assert "probability" in res
    assert_safety_compliance(res)

def test_cardiovascular_valid_and_safety():
    res = predict_cardiovascular_risk({
        "height": 172,
        "weight": 78,
        "ap_hi": 130,
        "ap_lo": 82,
        "age_years": 50
    })
    assert "result" in res
    assert "probability" in res
    assert_safety_compliance(res)

def test_obesity_valid_and_safety():
    res = predict_obesity_risk({
        "height": 1.75,
        "weight": 74.0,
        "gender": "Male"
    })
    assert "result" in res
    assert "probability" in res
    assert "Educational lifestyle-pattern estimate" in res["result"]
    assert_safety_compliance(res)

def test_stress_level_valid_and_safety():
    res = predict_stress_level({
        "sleep_duration": 6.5,
        "daily_steps": 5500,
        "heart_rate": 74
    })
    assert "result" in res
    assert "estimated_stress_score" in res
    assert_safety_compliance(res)

def test_sleep_quality_valid_and_safety():
    res = predict_sleep_quality({
        "sleep_duration": 7.5,
        "stress_level": 4,
        "daily_steps": 7500
    })
    assert "result" in res
    assert "estimated_quality_score" in res
    assert 1.0 <= res["estimated_quality_score"] <= 10.0
    assert_safety_compliance(res)

def test_health_summary_engine():
    data = {
        "age": 42,
        "sex": "Female",
        "height": 168,
        "weight": 68,
        "glucose": 115,
        "blood_pressure": "124/78",
        "sleep_hours": 7.2,
        "steps": 7500
    }
    summary = generate_health_summary(data)
    assert summary["status"] == "success"
    assert "overall_summary" in summary
    assert "models" in summary
    assert "disclaimer" in summary
    assert len(summary["models"]) == 7

def test_health_summary_missing_fields_graceful():
    # Only height provided, other models should report "Not enough data" without crashing
    data = {"height": 170}
    summary = generate_health_summary(data)
    assert summary["status"] == "success"
    assert summary["models"]["diabetes_pima"]["status"] == "Not enough data"
    assert summary["models"]["cardio_framingham"]["status"] == "Not enough data"
