"""
Script to generate all 7 comprehensive Jupyter Notebooks for MediTwin ML.
Complies with all university project guidelines and safety rules.
"""
import os
import nbformat as nbf

NOTEBOOKS_DIR = os.path.dirname(os.path.abspath(__file__))

def create_notebook(filename, title, model_num, dataset_name, target_col, src_module, desc):
    nb = nbf.v4.new_notebook()

    cells = []
    # 1. Header & Title
    cells.append(nbf.v4.new_markdown_cell(f"""# MEDiTwin Model {model_num:02d}: {title}

**Personal Health Digital Twin & Lifestyle Simulation Prototype**
*Academic Major Project — University Research Submission*

---

### ⚠️ Critical Clinical Safety Disclaimer
> **NOTICE:** MediTwin is an educational wellness and simulation research prototype—**NOT a medical device, diagnostic system, or clinical decision support platform**.
> - It does not diagnose diseases, replace medical practitioners, prescribe treatment, or recommend altering prescription medications.
> - All outputs represent educational estimates, screening patterns, or longitudinal trend indicators.
> - Predictive correlations in observational cohorts must not be construed as clinical causality.
"""))

    # 2. Dataset Information & Setup
    cells.append(nbf.v4.new_markdown_cell(f"""## 1. Environment Setup & Data Loading
- **Dataset:** `{dataset_name}`
- **Target Variable:** `{target_col}`
- **Description:** {desc}
"""))

    cells.append(nbf.v4.new_code_cell(f"""import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Ensure src modules are resolvable
sys.path.insert(0, os.path.abspath(".."))
from src.{src_module} import (
    load_and_preprocess_data,
    train_and_evaluate,
    FEATURES if hasattr(sys.modules.get('src.{src_module}'), 'FEATURES') else ALL_FEATURES
)
from src.common import RAW_DATA_DIR, clean_columns, to_snake_case

print("Environment and packages loaded successfully.")
"""))

    # 3. Exploratory Data Analysis
    cells.append(nbf.v4.new_markdown_cell("""## 2. Exploratory Data Analysis (EDA)
In accordance with project requirements, we inspect:
1. Dataset shape (rows, columns)
2. Column names & data types
3. Missing values analysis
4. Duplicate row detection
5. Target variable distribution
6. Summary descriptive statistics
"""))

    cells.append(nbf.v4.new_code_cell(f"""raw_csv = os.path.join(RAW_DATA_DIR, "{dataset_name}")
df_raw = pd.read_csv(raw_csv)

print("=== 1. DATASET SHAPE ===")
print(f"Total Rows: {{df_raw.shape[0]}}, Total Columns: {{df_raw.shape[1]}}")

print("\\n=== 2. COLUMNS & DATA TYPES ===")
print(df_raw.dtypes)

print("\\n=== 3. MISSING VALUES COUNT ===")
missing = df_raw.isnull().sum()
print(missing[missing > 0] if missing.sum() > 0 else "No NaN values detected in raw load.")

print("\\n=== 4. DUPLICATE ROWS ===")
print(f"Duplicate rows detected: {{df_raw.duplicated().sum()}}")

print("\\n=== 5. TARGET DISTRIBUTION ===")
clean_df = clean_columns(df_raw)
print(clean_df.iloc[:, -1].value_counts(dropna=False))

print("\\n=== 6. BASIC SUMMARY STATISTICS ===")
df_raw.describe().round(2)
"""))

    # 4. Pipeline & Model Training
    cells.append(nbf.v4.new_markdown_cell("""## 3. Preprocessing, Imputation & Model Training
We evaluate four separate algorithm families:
1. **Logistic / Linear Regression**
2. **Decision Tree**
3. **Random Forest**
4. **XGBoost (Extreme Gradient Boosting)**

All models are integrated into reproducible scikit-learn `Pipeline` and `ColumnTransformer` workflows using `random_state=42` and `test_size=0.20`.
"""))

    cells.append(nbf.v4.new_code_cell("""# Run pipeline training, cross-validation, chart generation, and artifact export
best_model, metadata = train_and_evaluate()

print("\\n=== BEST MODEL TRAINING METADATA ===")
print(json.dumps(metadata, indent=2, default=str))
"""))

    # 5. Model Performance Comparison
    cells.append(nbf.v4.new_markdown_cell("""## 4. Model Evaluation & Comparison Table
Reviewing test set metrics (Accuracy, Precision, Recall, F1-Score, ROC-AUC, PR-AUC).
"""))

    cells.append(nbf.v4.new_code_cell(f"""from src.common import METRICS_DIR

comparison_csv = [f for f in os.listdir(METRICS_DIR) if f.startswith("{model_num:02d}") and f.endswith(".csv")][0]
comp_df = pd.read_csv(os.path.join(METRICS_DIR, comparison_csv))
print("Model Comparison Table (Sorted by Primary Score):")
comp_df
"""))

    # 6. Figures & Visualizations
    cells.append(nbf.v4.new_markdown_cell("""## 5. Visualizations & Diagnostic Charts
Displaying target distribution, confusion matrices, ROC/PR curves, and feature importance.
"""))

    cells.append(nbf.v4.new_code_cell(f"""from src.common import FIGURES_DIR
from PIL import Image

model_figures = [f for f in os.listdir(FIGURES_DIR) if f.startswith("{model_num:02d}")]
print(f"Generated Figures ({{len(model_figures)}}):")
for fig in sorted(model_figures):
    print(f" - {{fig}}")
"""))

    # 7. Model Card & Limitations
    cells.append(nbf.v4.new_markdown_cell(f"""## 6. Model Card, Ethical Considerations & Uncertainty
A full ethical model card is automatically exported to `reports/model_cards/{model_num:02d}_*_card.md`.
"""))

    cells.append(nbf.v4.new_code_cell(f"""from src.common import MODEL_CARDS_DIR

card_files = [f for f in os.listdir(MODEL_CARDS_DIR) if f.startswith("{model_num:02d}")]
if card_files:
    card_path = os.path.join(MODEL_CARDS_DIR, card_files[0])
    with open(card_path, "r", encoding="utf-8") as f:
        print(f.read())
"""))

    # 8. Inference Testing
    cells.append(nbf.v4.new_markdown_cell("""## 7. API-Ready Prediction Function & Boundary Testing
Testing sample inference with validity checks, uncertainty notes, and mandatory clinical disclaimer.
"""))

    cells.append(nbf.v4.new_code_cell(f"""import importlib
mod = importlib.import_module("src.{src_module}")
predict_fn = [getattr(mod, f) for f in dir(mod) if f.startswith("predict_")][0]

sample_test_input = {{}}
# Execute sample inference
sample_output = predict_fn(sample_test_input)
print("Sample Model Prediction Output:")
print(json.dumps(sample_output, indent=2))
"""))

    nb.cells = cells
    out_path = os.path.join(NOTEBOOKS_DIR, filename)
    with open(out_path, "w", encoding="utf-8") as f:
        nbf.write(nb, f)
    print(f"[OK] Generated notebook -> {filename}")

def main():
    notebooks = [
        (
            "01_diabetes_risk_pima.ipynb",
            "PIMA Diabetes Risk Screening Model",
            1,
            "pima_diabetes.csv",
            "Outcome (0 = Lower risk, 1 = Higher risk)",
            "diabetes_pima",
            "Clinical screening for Type 2 diabetes risk based on fasting glucose, insulin, and body mass index."
        ),
        (
            "02_diabetes_risk_cdc.ipynb",
            "CDC Diabetes Health Indicators Risk Screening Model",
            2,
            "cdc_diabetes_health_indicators.csv",
            "Diabetes_012 -> diabetes_risk_positive (0 = Non-diabetic, 1 = Prediabetes/Diabetes history)",
            "diabetes_cdc",
            "Population-scale lifestyle survey screening using BRFSS health indicators and physical habits."
        ),
        (
            "03_hypertension_risk_framingham.ipynb",
            "Framingham Cardiovascular & Hypertension Risk Model",
            3,
            "framingham.csv",
            "TenYearCHD (0 = No CHD risk, 1 = 10-Year CHD risk screened)",
            "hypertension_framingham",
            "Historical epidemiological cohort model predicting 10-year coronary heart disease probability."
        ),
        (
            "04_cardiovascular_risk_model.ipynb",
            "Cardiovascular Disease Risk Classification Model",
            4,
            "cardiovascular.csv",
            "cardio (0 = Absence, 1 = Presence)",
            "cardiovascular",
            "Multi-metric physiological classification using blood pressure, cholesterol, and physical activity."
        ),
        (
            "05_obesity_risk_model.ipynb",
            "Obesity & Body Mass Category Estimation Model",
            5,
            "obesity_levels.csv",
            "NObeyesdad (7 multiclass body composition tiers)",
            "obesity",
            "Lifestyle, dietary frequency, and hydration estimation of body composition pattern tiers."
        ),
        (
            "06_stress_level_model.ipynb",
            "Stress Pattern Classification Model",
            6,
            "sleep_health_lifestyle.csv",
            "Stress Level (Multiclass rating scale 3-8)",
            "stress",
            "Wearable ambulatory lifestyle screening associating sleep duration, steps, and heart rate with stress index."
        ),
        (
            "07_sleep_quality_model.ipynb",
            "Sleep Quality Prediction Model",
            7,
            "sleep_health_lifestyle.csv",
            "Quality of Sleep (Rating scale 1 to 10)",
            "sleep_quality",
            "Continuous regression modeling sleep restorative quality from lifestyle habits and circadian duration."
        )
    ]

    for nb_args in notebooks:
        create_notebook(*nb_args)
    print("\nAll 7 Jupyter Notebooks successfully created in notebooks/")

if __name__ == "__main__":
    main()
