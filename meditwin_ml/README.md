# MEDiTwin Machine Learning Engine
## Personal Health Digital Twin & Lifestyle Simulation Prototype
*Academic Major Project — Senior Machine Learning & Health-Data Science Engineering*

---

## ⚠️ Critical Ethical & Clinical Safety Disclaimer

> **IMPORTANT CLINICAL NOTICE:**
> **MediTwin is an educational wellness and simulation prototype—NOT a medical device, diagnostic system, clinical decision support software, or prescription tool.**
> - MediTwin **does not diagnose diseases, recommend altering medications, replace professional medical consultations, calculate insulin dosages, or guarantee future health outcomes**.
> - Every model output is strictly labeled as an **educational estimate**, **risk-screening pattern**, or **longitudinal trend indicator**.
> - Never use diagnostic language such as *"you have diabetes"* or *"you will get heart disease"*.
> - All outputs emphasize the crucial distinction between **correlation and causation** in observational epidemiological cohorts.
> - In any medical emergency, immediately contact local emergency healthcare services.

---

## 🏛️ Project Architecture & Model Suite

```
meditwin_ml/
├── data/
│   ├── raw/                           # Raw observational CSV datasets
│   ├── processed/                     # Preprocessed parquet / interim files
│   ├── download_or_generate_datasets.py
│   └── README.md                      # Dataset documentation and catalog
├── notebooks/                         # 7 Self-contained analysis notebooks
│   ├── 01_diabetes_risk_pima.ipynb
│   ├── 02_diabetes_risk_cdc.ipynb
│   ├── 03_hypertension_risk_framingham.ipynb
│   ├── 04_cardiovascular_risk_model.ipynb
│   ├── 05_obesity_risk_model.ipynb
│   ├── 06_stress_level_model.ipynb
│   ├── 07_sleep_quality_model.ipynb
│   └── generate_notebooks.py
├── src/                               # Core Python training & inference modules
│   ├── __init__.py
│   ├── common.py                      # Shared metrics, charts, disclaimers
│   ├── diabetes_pima.py               # Model 1
│   ├── diabetes_cdc.py                # Model 2
│   ├── hypertension_framingham.py     # Model 3
│   ├── cardiovascular.py              # Model 4
│   ├── obesity.py                     # Model 5
│   ├── stress.py                      # Model 6
│   ├── sleep_quality.py               # Model 7
│   └── health_summary.py              # Multi-model orchestrator engine
├── artifacts/                         # Exported .joblib models & metadata JSON
├── reports/
│   ├── figures/                       # ROC curves, PR curves, confusion matrices
│   ├── metrics/                       # Evaluation CSV & JSON reports
│   └── model_cards/                   # Detailed Markdown model cards
├── api/                               # FastAPI high-performance REST microservice
│   ├── __init__.py
│   └── main.py
├── tests/                             # Unit tests & API integration tests
│   ├── test_validation.py
│   └── test_api.py
├── train_all_models.py                # Master training execution script
├── requirements.txt                   # Production Python dependencies
├── README.md
└── .gitignore
```

---

## 📊 The Seven Machine Learning Models

| # | Model Domain | Dataset Source | Target Variable | Best Algorithm | Output Wording |
|---|---|---|---|---|---|
| **1** | **Type 2 Diabetes Screening** | [Pima Indians Diabetes](https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database) | `Outcome` (0/1) | Random Forest (Tuned) | *"Higher / Lower educational screening risk"* |
| **2** | **Population Diabetes Screening** | [CDC BRFSS Health Indicators](https://archive.ics.uci.edu/dataset/891/cdc+diabetes+health+indicators) | `Diabetes_012` (Binary) | Random Forest (Tuned) | *"Educational diabetes-risk screening result"* |
| **3** | **Cardiovascular & Hypertension** | [Framingham Heart Study](https://www.kaggle.com/datasets/aasheesh200/framingham-heart-study-dataset) | `TenYearCHD` (0/1) | XGBoost Classifier (Tuned) | *"Educational cardiovascular-risk screening estimate"* |
| **4** | **Cardiovascular Disease Status** | [Cardiovascular Disease Dataset](https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset) | `cardio` (0/1) | Logistic Regression | *"Educational cardiovascular-risk screening estimate"* |
| **5** | **Obesity & Body Mass Category** | [UCI Obesity Estimation](https://archive.ics.uci.edu/dataset/544/estimation+of+obesity+levels+based+on+eating+habits+and+physical+condition) | `NObeyesdad` (7 tiers) | XGBoost Classifier | *"Educational lifestyle-pattern estimate"* |
| **6** | **Stress Level Classification** | [Sleep Health & Lifestyle](https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset) | `Stress Level` (3-8) | Gradient Boosting | *"Educational stress-pattern estimate"* |
| **7** | **Sleep Quality Prediction** | [Sleep Health & Lifestyle](https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset) | `Quality of Sleep` (1-10) | Ridge Regression | *"Educational sleep-pattern estimate"* |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python:** 3.10 or 3.11 installed
- **pip** package manager

### 2. Installation
Navigate to the `meditwin_ml` directory:
```bash
cd meditwin_ml
pip install -r requirements.txt
```

### 3. Dataset Setup
Generate or download the baseline raw datasets:
```bash
python data/download_or_generate_datasets.py
```

### 4. Train All 7 Models
Run the automated end-to-end training pipeline to fit pipelines, evaluate models, and output figures, metrics, and `.joblib` artifacts:
```bash
python train_all_models.py
```

### 5. Run the Automated Test Suite
Run the 20 unit and API integration tests:
```bash
pytest tests/ -v
```

### 6. Launch the FastAPI Microservice
Start the FastAPI server on port `8000`:
```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger API documentation will be available at:
**[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health & model registry check |
| `POST` | `/predict/diabetes-risk-pima` | PIMA clinical diabetes risk screening |
| `POST` | `/predict/diabetes-risk-cdc` | CDC survey diabetes risk screening |
| `POST` | `/predict/cardio-risk-framingham` | Framingham 10-year cardiovascular screening |
| `POST` | `/predict/cardio-risk` | Physiological cardiovascular disease screening |
| `POST` | `/predict/obesity-risk` | Lifestyle body mass tier categorization |
| `POST` | `/predict/stress-level` | Multiclass stress level pattern estimation |
| `POST` | `/predict/sleep-quality` | Continuous sleep quality regression score |
| `POST` | `/health-summary` | Multi-model unified educational summary |

---

## 📓 Running the Jupyter Notebooks

To launch interactive analysis notebooks:
```bash
jupyter lab notebooks/
```
Open any of the 7 self-contained notebooks (`01` through `07`) to explore EDA tables, correlation matrices, confusion heatmaps, and ROC curves interactively.
