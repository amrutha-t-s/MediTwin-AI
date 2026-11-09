"""
FastAPI REST API for MediTwin Personal Health Digital Twin & Lifestyle Simulator.
Serves 7 specialized machine learning models and the consolidated Health Summary Engine.
"""
import os
import sys
from typing import List, Optional, Any, Dict
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

# Add package root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.diabetes_pima import predict_pima_diabetes_risk
from src.diabetes_cdc import predict_cdc_diabetes_risk
from src.hypertension_framingham import predict_framingham_cardio_risk
from src.cardiovascular import predict_cardiovascular_risk
from src.obesity import predict_obesity_risk
from src.stress import predict_stress_level
from src.sleep_quality import predict_sleep_quality
from src.health_summary import generate_health_summary
from src.common import UNIVERSAL_DISCLAIMER

app = FastAPI(
    title="MediTwin Health ML API",
    description="Educational Machine Learning & Lifestyle Simulation Microservice for MediTwin AI.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4000",
        "http://127.0.0.1:4000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom validation error handler returning HTTP 400
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err.get("loc", [])])
        errors.append(f"{field}: {err.get('msg')}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Validation Error",
            "message": "Invalid input parameters provided.",
            "details": errors,
            "disclaimer": UNIVERSAL_DISCLAIMER
        }
    )

@app.exception_handler(FileNotFoundError)
async def artifact_not_found_handler(request: Request, exc: FileNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "Model Artifact Unavailable",
            "message": "Required model artifact (.joblib) is not available. Ensure models have been trained.",
            "disclaimer": UNIVERSAL_DISCLAIMER
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # Hide internal stack traces from client
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred during model inference.",
            "disclaimer": UNIVERSAL_DISCLAIMER
        }
    )

# ============================================================================
# PYDANTIC SCHEMAS
# ============================================================================

class PimaRequest(BaseModel):
    glucose: float = Field(..., ge=20, le=350, description="Plasma glucose concentration")
    bmi: float = Field(..., ge=10, le=80, description="Body mass index (kg/m^2)")
    age: float = Field(..., ge=10, le=120, description="Age in years")
    blood_pressure: Optional[float] = Field(72.0, ge=30, le=200)
    pregnancies: Optional[float] = Field(0.0, ge=0, le=25)
    skin_thickness: Optional[float] = Field(20.0, ge=0, le=110)
    insulin: Optional[float] = Field(80.0, ge=0, le=900)
    diabetes_pedigree_function: Optional[float] = Field(0.47, ge=0.01, le=3.0)

class CDCRequest(BaseModel):
    high_bp: Optional[int] = Field(0, ge=0, le=1)
    high_chol: Optional[int] = Field(0, ge=0, le=1)
    bmi: float = Field(..., ge=10, le=80)
    smoker: Optional[int] = Field(0, ge=0, le=1)
    stroke: Optional[int] = Field(0, ge=0, le=1)
    heart_diseaseor_attack: Optional[int] = Field(0, ge=0, le=1)
    phys_activity: Optional[int] = Field(1, ge=0, le=1)
    fruits: Optional[int] = Field(1, ge=0, le=1)
    veggies: Optional[int] = Field(1, ge=0, le=1)
    hvy_alcohol_consump: Optional[int] = Field(0, ge=0, le=1)
    gen_hlth: Optional[int] = Field(2, ge=1, le=5)
    sex: Optional[int] = Field(0, ge=0, le=1)
    age: Optional[int] = Field(5, ge=1, le=13)

class FraminghamRequest(BaseModel):
    age: float = Field(..., ge=20, le=100)
    sys_bp: float = Field(..., ge=70, le=280)
    male: Optional[int] = Field(0, ge=0, le=1)
    current_smoker: Optional[int] = Field(0, ge=0, le=1)
    cigs_per_day: Optional[float] = Field(0.0, ge=0, le=100)
    prevalent_hyp: Optional[int] = Field(0, ge=0, le=1)
    diabetes: Optional[int] = Field(0, ge=0, le=1)
    tot_chol: Optional[float] = Field(200.0, ge=80, le=600)
    dia_bp: Optional[float] = Field(80.0, ge=40, le=160)
    bmi: Optional[float] = Field(25.0, ge=12, le=70)
    heart_rate: Optional[float] = Field(72.0, ge=35, le=220)
    glucose: Optional[float] = Field(85.0, ge=40, le=400)

class CardiovascularRequest(BaseModel):
    height: float = Field(..., ge=90, le=240, description="Height in cm")
    weight: float = Field(..., ge=30, le=250, description="Weight in kg")
    ap_hi: float = Field(..., ge=70, le=260, description="Systolic blood pressure")
    ap_lo: Optional[float] = Field(80.0, ge=40, le=160, description="Diastolic blood pressure")
    age_years: Optional[float] = Field(45.0, ge=18, le=110)
    gender: Optional[int] = Field(1, ge=1, le=2, description="1=Female, 2=Male")
    cholesterol: Optional[int] = Field(1, ge=1, le=3)
    gluc: Optional[int] = Field(1, ge=1, le=3)
    smoke: Optional[int] = Field(0, ge=0, le=1)
    alco: Optional[int] = Field(0, ge=0, le=1)
    active: Optional[int] = Field(1, ge=0, le=1)

    @field_validator("ap_lo")
    @classmethod
    def validate_bp_difference(cls, v, info):
        ap_hi = info.data.get("ap_hi")
        if ap_hi is not None and v is not None and v >= ap_hi:
            raise ValueError("Diastolic blood pressure (ap_lo) must be lower than systolic (ap_hi).")
        return v

class ObesityRequest(BaseModel):
    height: float = Field(..., ge=0.9, le=2.5, description="Height in meters (or cm will be converted)")
    weight: float = Field(..., ge=25.0, le=250.0, description="Weight in kg")
    age: Optional[float] = Field(25.0, ge=10, le=100)
    gender: Optional[str] = Field("Female")
    family_history_with_overweight: Optional[str] = Field("no")
    favc: Optional[str] = Field("no", description="Frequent consumption of high caloric food")
    fcvc: Optional[float] = Field(2.0, ge=1.0, le=3.0, description="Frequency of vegetables")
    ncp: Optional[float] = Field(3.0, ge=1.0, le=4.0, description="Number of main meals")
    ch2o: Optional[float] = Field(2.0, ge=1.0, le=3.0, description="Daily water intake")
    faf: Optional[float] = Field(1.0, ge=0.0, le=3.0, description="Physical activity frequency")

class StressRequest(BaseModel):
    sleep_duration: float = Field(..., ge=2.0, le=14.0, description="Daily sleep hours")
    daily_steps: Optional[float] = Field(6000.0, ge=0, le=40000)
    heart_rate: Optional[float] = Field(72.0, ge=40, le=180)
    quality_of_sleep: Optional[float] = Field(7.0, ge=1.0, le=10.0)
    physical_activity_level: Optional[float] = Field(60.0, ge=0, le=180)
    sys_bp: Optional[float] = Field(120.0, ge=70, le=240)
    dia_bp: Optional[float] = Field(80.0, ge=40, le=150)
    gender: Optional[str] = Field("Male")
    bmi_category: Optional[str] = Field("Normal")

class SleepQualityRequest(BaseModel):
    sleep_duration: float = Field(..., ge=2.0, le=14.0, description="Daily sleep hours")
    stress_level: Optional[float] = Field(5.0, ge=1.0, le=10.0, description="Self-reported stress level")
    daily_steps: Optional[float] = Field(6000.0, ge=0, le=40000)
    heart_rate: Optional[float] = Field(72.0, ge=40, le=180)
    physical_activity_level: Optional[float] = Field(60.0, ge=0, le=180)
    sys_bp: Optional[float] = Field(120.0, ge=70, le=240)
    dia_bp: Optional[float] = Field(80.0, ge=40, le=150)
    gender: Optional[str] = Field("Female")
    bmi_category: Optional[str] = Field("Normal")

class HealthSummaryRequest(BaseModel):
    age: Optional[float] = Field(None, ge=10, le=120)
    sex: Optional[str] = Field("Female")
    height: Optional[float] = Field(None, ge=50, le=250)
    weight: Optional[float] = Field(None, ge=20, le=300)
    bmi: Optional[float] = Field(None, ge=10, le=80)
    glucose: Optional[float] = Field(None, ge=20, le=400)
    blood_pressure: Optional[str] = Field(None, description="E.g., 120/80")
    sys_bp: Optional[float] = Field(None, ge=60, le=260)
    dia_bp: Optional[float] = Field(None, ge=40, le=160)
    sleep_hours: Optional[float] = Field(None, ge=2, le=16)
    steps: Optional[float] = Field(None, ge=0, le=50000)
    alcohol_units: Optional[float] = Field(0.0, ge=0)
    stress_level: Optional[float] = Field(5.0, ge=1, le=10)
    smoking_status: Optional[str] = Field("no")
    food_quality: Optional[str] = Field("balanced")
    family_history: Optional[str] = Field("no")

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
def health_check():
    """Service health and readiness check."""
    return {
        "status": "healthy",
        "service": "MediTwin Machine Learning Engine",
        "version": "1.0.0",
        "models_registered": 7,
        "disclaimer": UNIVERSAL_DISCLAIMER
    }

@app.post("/predict/diabetes-risk-pima")
def predict_diabetes_pima_endpoint(req: PimaRequest):
    """Predict educational diabetes risk from clinical variables (PIMA)."""
    return predict_pima_diabetes_risk(req.model_dump())

@app.post("/predict/diabetes-risk-cdc")
def predict_diabetes_cdc_endpoint(req: CDCRequest):
    """Predict educational diabetes risk from lifestyle survey indicators (CDC)."""
    return predict_cdc_diabetes_risk(req.model_dump())

@app.post("/predict/cardio-risk-framingham")
def predict_framingham_endpoint(req: FraminghamRequest):
    """Predict 10-year cardiovascular risk screening estimate (Framingham)."""
    return predict_framingham_cardio_risk(req.model_dump())

@app.post("/predict/cardio-risk")
def predict_cardio_endpoint(req: CardiovascularRequest):
    """Classify cardiovascular disease pattern from physiological exam data."""
    return predict_cardiovascular_risk(req.model_dump())

@app.post("/predict/obesity-risk")
def predict_obesity_endpoint(req: ObesityRequest):
    """Estimate body mass and lifestyle pattern tier (UCI Obesity)."""
    return predict_obesity_risk(req.model_dump())

@app.post("/predict/stress-level")
def predict_stress_endpoint(req: StressRequest):
    """Classify stress pattern from sleep and lifestyle telemetry."""
    return predict_stress_level(req.model_dump())

@app.post("/predict/sleep-quality")
def predict_sleep_endpoint(req: SleepQualityRequest):
    """Estimate sleep quality index (1-10) from biometrics and habits."""
    return predict_sleep_quality(req.model_dump())

@app.post("/health-summary")
def health_summary_endpoint(req: HealthSummaryRequest):
    """Multi-model educational summary engine integrating all seven models."""
    return generate_health_summary(req.model_dump())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
