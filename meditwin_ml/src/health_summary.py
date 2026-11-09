"""
MediTwin Health Summary Engine
Multi-model orchestrator that evaluates independent machine learning models
and synthesizes a transparent, rule-based educational summary.
"""
from typing import Dict, Any, Optional
import numpy as np

from .diabetes_pima import predict_pima_diabetes_risk
from .diabetes_cdc import predict_cdc_diabetes_risk
from .hypertension_framingham import predict_framingham_cardio_risk
from .cardiovascular import predict_cardiovascular_risk
from .obesity import predict_obesity_risk
from .stress import predict_stress_level
from .sleep_quality import predict_sleep_quality
from .common import UNIVERSAL_DISCLAIMER

def compute_bmi(weight_kg: Optional[float], height_cm: Optional[float]) -> Optional[float]:
    if weight_kg and height_cm and height_cm > 0:
        return round(float(weight_kg) / ((float(height_cm) / 100.0) ** 2), 1)
    return None

def parse_blood_pressure(bp_str: Any) -> tuple:
    """Safely parse blood pressure into (sys, dia)."""
    if isinstance(bp_str, str) and "/" in bp_str:
        parts = bp_str.split("/")
        try:
            return float(parts[0]), float(parts[1])
        except (ValueError, IndexError):
            pass
    return None, None

def generate_health_summary(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes all 7 models independently and provides an educational summary.
    Does not merge model probabilities into a clinical score.
    """
    age = data.get("age")
    sex = str(data.get("sex") or "Female").capitalize()
    male_binary = 1 if sex.lower() in ["male", "m"] else 0
    gender_cardio = 2 if male_binary == 1 else 1
    height_cm = data.get("height") or data.get("height_cm")
    weight_kg = data.get("weight") or data.get("weight_kg")
    bmi = data.get("bmi") or compute_bmi(weight_kg, height_cm)

    glucose = data.get("glucose")
    bp_raw = data.get("blood_pressure")
    sys_bp, dia_bp = parse_blood_pressure(bp_raw)
    if sys_bp is None:
        sys_bp = data.get("sys_bp") or data.get("systolic")
    if dia_bp is None:
        dia_bp = data.get("dia_bp") or data.get("diastolic")

    sleep_hours = data.get("sleep_hours") or data.get("sleep") or 7.0
    steps = data.get("steps") or 6000
    smoking = 1 if str(data.get("smoking_status", "")).lower() in ["smoker", "yes", "true", "1"] else 0
    alcohol = 1 if data.get("alcohol_units", 0) and float(data.get("alcohol_units", 0)) > 2 else 0

    results = {}

    # 1. Model 1: PIMA Diabetes
    if glucose is not None and bmi is not None and age is not None:
        try:
            pima_res = predict_pima_diabetes_risk({
                "glucose": glucose,
                "bmi": bmi,
                "age": age,
                "blood_pressure": dia_bp or 72,
                "pregnancies": data.get("pregnancies", 1 if sex == "Female" else 0),
                "skin_thickness": data.get("skin_thickness", 20),
                "insulin": data.get("insulin", 80),
                "diabetes_pedigree_function": data.get("diabetes_pedigree_function", 0.47)
            })
            results["diabetes_pima"] = pima_res
        except Exception as e:
            results["diabetes_pima"] = {"status": "error", "message": str(e)}
    else:
        results["diabetes_pima"] = {
            "status": "Not enough data",
            "required_fields": ["glucose", "bmi", "age"],
            "disclaimer": "Educational screening estimate only. Not a diagnosis."
        }

    # 2. Model 2: CDC Diabetes Health Indicators
    try:
        cdc_res = predict_cdc_diabetes_risk({
            "high_bp": 1 if sys_bp and sys_bp >= 130 else 0,
            "high_chol": 1 if data.get("cholesterol_high") else 0,
            "chol_check": 1,
            "bmi": bmi or 25,
            "smoker": smoking,
            "stroke": 0,
            "heart_diseaseor_attack": 0,
            "phys_activity": 1 if steps and steps >= 5000 else 0,
            "fruits": 1,
            "veggies": 1 if data.get("food_quality") != "poor" else 0,
            "hvy_alcohol_consump": alcohol,
            "any_healthcare": 1,
            "no_docbc_cost": 0,
            "gen_hlth": 2 if (bmi and bmi < 28 and glucose and glucose < 120) else 3,
            "ment_hlth": 2,
            "phys_hlth": 2,
            "diff_walk": 0,
            "sex": male_binary,
            "age": min(13, max(1, int((age or 35) / 5) - 3)),
            "education": 5,
            "income": 6
        })
        results["diabetes_cdc"] = cdc_res
    except Exception as e:
        results["diabetes_cdc"] = {"status": "error", "message": str(e)}

    # 3. Model 3: Framingham Cardiovascular
    if age is not None and sys_bp is not None:
        try:
            fram_res = predict_framingham_cardio_risk({
                "male": male_binary,
                "age": age,
                "education": 3,
                "current_smoker": smoking,
                "cigs_per_day": 10 if smoking else 0,
                "bp_meds": 0,
                "prevalent_stroke": 0,
                "prevalent_hyp": 1 if sys_bp >= 140 else 0,
                "diabetes": 1 if glucose and glucose >= 126 else 0,
                "tot_chol": data.get("tot_chol", 200),
                "sys_bp": sys_bp,
                "dia_bp": dia_bp or 80,
                "bmi": bmi or 25.0,
                "heart_rate": data.get("heart_rate", 72),
                "glucose": glucose or 90
            })
            results["cardio_framingham"] = fram_res
        except Exception as e:
            results["cardio_framingham"] = {"status": "error", "message": str(e)}
    else:
        results["cardio_framingham"] = {
            "status": "Not enough data",
            "required_fields": ["age", "sys_bp"],
            "disclaimer": "Educational screening estimate only. Not a diagnosis."
        }

    # 4. Model 4: Cardiovascular Disease Classification
    if sys_bp is not None and height_cm is not None and weight_kg is not None:
        try:
            cardio_res = predict_cardiovascular_risk({
                "age_years": age or 45,
                "gender": gender_cardio,
                "height": height_cm,
                "weight": weight_kg,
                "ap_hi": sys_bp,
                "ap_lo": dia_bp or (sys_bp * 0.65),
                "cholesterol": 2 if data.get("cholesterol_high") else 1,
                "gluc": 2 if glucose and glucose > 125 else 1,
                "smoke": smoking,
                "alco": alcohol,
                "active": 1 if steps and steps >= 6000 else 0,
                "bmi": bmi
            })
            results["cardiovascular"] = cardio_res
        except Exception as e:
            results["cardiovascular"] = {"status": "error", "message": str(e)}
    else:
        results["cardiovascular"] = {
            "status": "Not enough data",
            "required_fields": ["sys_bp", "height", "weight"],
            "disclaimer": "Educational screening estimate only. Not a diagnosis."
        }

    # 5. Model 5: Obesity Category Estimation
    if height_cm is not None and weight_kg is not None:
        try:
            obesity_res = predict_obesity_risk({
                "gender": sex,
                "age": age or 30,
                "height": height_cm,
                "weight": weight_kg,
                "family_history_with_overweight": "yes" if data.get("family_history") else "no",
                "favc": "yes" if data.get("food_quality") == "poor" else "no",
                "fcvc": 2.5 if data.get("food_quality") == "good" else 1.8,
                "ncp": 3,
                "caec": "Sometimes",
                "smoke": "yes" if smoking else "no",
                "ch2o": 2.2,
                "scc": "no",
                "faf": min(3.0, (steps / 4000.0)),
                "tue": 1.0,
                "calc": "Sometimes" if alcohol else "no",
                "mtrans": "Public_Transportation"
            })
            results["obesity"] = obesity_res
        except Exception as e:
            results["obesity"] = {"status": "error", "message": str(e)}
    else:
        results["obesity"] = {
            "status": "Not enough data",
            "required_fields": ["height", "weight"],
            "disclaimer": "Educational screening estimate only. Not a diagnosis."
        }

    # 6. Model 6: Stress Pattern
    try:
        stress_res = predict_stress_level({
            "age": age or 35,
            "sleep_duration": sleep_hours,
            "quality_of_sleep": data.get("sleep_quality", 7),
            "physical_activity_level": min(90, int(steps / 100)),
            "heart_rate": data.get("heart_rate", 72),
            "daily_steps": steps,
            "sys_bp": sys_bp or 120,
            "dia_bp": dia_bp or 80,
            "gender": sex,
            "occupation": data.get("occupation", "Professional"),
            "bmi_category": "Normal" if (bmi and bmi < 25) else "Overweight",
            "sleep_disorder": "None"
        })
        results["stress"] = stress_res
    except Exception as e:
        results["stress"] = {"status": "error", "message": str(e)}

    # 7. Model 7: Sleep Quality Prediction
    try:
        sleep_res = predict_sleep_quality({
            "age": age or 35,
            "sleep_duration": sleep_hours,
            "physical_activity_level": min(90, int(steps / 100)),
            "stress_level": data.get("stress_level", 5),
            "heart_rate": data.get("heart_rate", 72),
            "daily_steps": steps,
            "sys_bp": sys_bp or 120,
            "dia_bp": dia_bp or 80,
            "gender": sex,
            "occupation": data.get("occupation", "Professional"),
            "bmi_category": "Normal" if (bmi and bmi < 25) else "Overweight",
            "sleep_disorder": "None"
        })
        results["sleep_quality"] = sleep_res
    except Exception as e:
        results["sleep_quality"] = {"status": "error", "message": str(e)}

    # Transparent rule-based UI summary
    observations = []
    if glucose and glucose > 130:
        observations.append("Elevated glycemic telemetry flagged in screening models.")
    if sys_bp and sys_bp > 130:
        observations.append("Systolic pressure readings indicate prehypertension pattern.")
    if sleep_hours and sleep_hours < 6.0:
        observations.append("Sleep duration is below recommended 7–9 hour restorative baseline.")
    if steps and steps >= 8000:
        observations.append("Consistently positive daily physical activity (>8,000 steps).")

    summary_message = (
        "Educational health-pattern summary: "
        + (" ".join(observations) if observations else "Biometrics align with steady baseline observational patterns.")
        + " Consider discussing this information with a qualified healthcare professional."
    )

    return {
        "status": "success",
        "overall_summary": summary_message,
        "models": results,
        "input_profile": {
            "age": age,
            "sex": sex,
            "bmi": bmi,
            "glucose": glucose,
            "systolic_bp": sys_bp,
            "diastolic_bp": dia_bp,
            "sleep_hours": sleep_hours,
            "daily_steps": steps
        },
        "disclaimer": UNIVERSAL_DISCLAIMER
    }
