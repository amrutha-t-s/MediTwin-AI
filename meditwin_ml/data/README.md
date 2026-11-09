# MediTwin Machine Learning Datasets

This directory contains the datasets for the seven distinct machine-learning models in the **MEDiTwin** personal health digital twin prototype.

## ⚠️ Ethical & Clinical Safety Disclaimer
All datasets are intended solely for educational, academic, and non-diagnostic risk-screening research. No model trained on these datasets provides medical advice, diagnosis, treatment plans, insulin dosage adjustments, or clinical forecasts.

---

## Dataset Directory Structure

```
data/
├── raw/
│   ├── pima_diabetes.csv
│   ├── cdc_diabetes_health_indicators.csv
│   ├── framingham.csv
│   ├── cardiovascular.csv
│   ├── obesity_levels.csv
│   └── sleep_health_lifestyle.csv
├── processed/
└── download_or_generate_datasets.py
```

---

## Dataset Catalog & Sources

### 1. Pima Indians Diabetes Dataset
- **File:** `data/raw/pima_diabetes.csv`
- **Target:** `outcome` (0 = Lower educational screening risk, 1 = Higher educational screening risk)
- **Source:** [Kaggle UCI Pima Indians Diabetes Database](https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database)
- **Observations:** 768 female adult patients of Pima Indian heritage.
- **Key Features:** Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age.
- **Note:** Biologically implausible zeros in Glucose, Blood Pressure, Skin Thickness, Insulin, and BMI are treated as missing values and imputed with median statistics.

### 2. CDC Diabetes Health Indicators (BRFSS)
- **File:** `data/raw/cdc_diabetes_health_indicators.csv`
- **Target:** `Diabetes_012` (0 = No diabetes, 1 = Prediabetes, 2 = Diabetes) -> Binary: `diabetes_risk_positive` (1 if 1 or 2, else 0).
- **Source:** [UCI Machine Learning Repository / CDC BRFSS](https://archive.ics.uci.edu/dataset/891/cdc+diabetes+health+indicators)
- **Features:** 21 health indicator lifestyle and demographic survey items.

### 3. Framingham Heart Study Dataset
- **File:** `data/raw/framingham.csv`
- **Target:** `TenYearCHD` (1 = 10-year risk screened, 0 = No risk screened)
- **Source:** [Kaggle Framingham Heart Study Dataset](https://www.kaggle.com/datasets/aasheesh200/framingham-heart-study-dataset)
- **Features:** 15 historical demographic and physiological factors including age, smoking, systolic/diastolic blood pressure, cholesterol, glucose, and hypertension history.

### 4. Cardiovascular Disease Dataset
- **File:** `data/raw/cardiovascular.csv`
- **Target:** `cardio` (1 = Presence, 0 = Absence)
- **Source:** [Kaggle Cardiovascular Disease Dataset](https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset)
- **Cleaning:** Strict validation filters remove biologically implausible blood pressure readings (e.g., negative or extreme values >250 systolic).

### 5. Estimation of Obesity Levels Based on Eating Habits and Physical Condition
- **File:** `data/raw/obesity_levels.csv`
- **Target:** `NObeyesdad` (7 categorical classes: Insufficient_Weight, Normal_Weight, Overweight_Level_I, Overweight_Level_II, Obesity_Type_I, Obesity_Type_II, Obesity_Type_III).
- **Source:** [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/544/estimation+of+obesity+levels+based+on+eating+habits+and+physical+condition)

### 6 & 7. Sleep Health and Lifestyle Dataset
- **File:** `data/raw/sleep_health_lifestyle.csv`
- **Targets:**
  - Model 6 (Stress): `Stress Level` (Multiclass rating)
  - Model 7 (Sleep Quality): `Quality of Sleep` (Rating 1–10)
- **Source:** [Kaggle Sleep Health and Lifestyle Dataset](https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset)
