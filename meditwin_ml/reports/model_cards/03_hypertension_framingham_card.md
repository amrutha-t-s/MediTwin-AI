# MediTwin Model Card: Framingham 10-Year Cardiovascular Risk Model

## 1. Model Overview
- **Model Identifier:** `Framingham 10-Year Cardiovascular Risk Model`
- **Purpose:** Educational cardiovascular-risk screening model based on historical Framingham epidemiological data.
- **Architecture Selected:** `XGBoost`
- **Intended Users:** University researchers, students, and wellness telemetry simulators.
- **Out-of-Scope Use:** Emergency triage, disease diagnosis, insulin dosage prescription, or medication adjustment.

---

## 2. Dataset Information
- **Dataset Source:** Framingham Heart Study Cohort Dataset (National Heart, Lung, and Blood Institute)
- **Target Variable:** TenYearCHD: 1 = Presence of 10-year coronary heart disease risk, 0 = Absence
- **Number of Input Features:** 15
- **Features:** `male`, `age`, `education`, `current_smoker`, `cigs_per_day`, `bp_meds`, `prevalent_stroke`, `prevalent_hyp`, `diabetes`, `tot_chol`, `sys_bp`, `dia_bp`, `bmi`, `heart_rate`, `glucose`

---

## 3. Evaluation & Performance Metrics
Summary of test set evaluation (Stratified 80/20 split, `random_state=42`):

| Metric | Score |
| :--- | :--- |
| **ACCURACY** | `0.6427` |
| **PRECISION** | `0.5479` |
| **RECALL** | `0.5000` |
| **F1** | `0.5228` |
| **Confusion_matrix** | `[[379, 137], [166, 166]]` |
| **Classification_report** | `{'0': {'precision': 0.6954128440366972, 'recall': 0.7344961240310077, 'f1-score': 0.7144203581526861, 'support': 516.0}, '1': {'precision': 0.5478547854785478, 'recall': 0.5, 'f1-score': 0.5228346456692914, 'support': 332.0}, 'accuracy': 0.6426886792452831, 'macro avg': {'precision': 0.6216338147576226, 'recall': 0.6172480620155039, 'f1-score': 0.6186275019109888, 'support': 848.0}, 'weighted avg': {'precision': 0.6376424720540256, 'recall': 0.6426886792452831, 'f1-score': 0.6394127443030552, 'support': 848.0}}` |
| **ROC_AUC** | `0.6427` |
| **PR_AUC** | `0.5200` |

---

## 4. Ethical Considerations, Bias & Limitations
### Known Limitations:
- Historical mid-20th century cohort predominantly composed of white residents in Framingham, Massachusetts.
- Substantial population demographic changes and updated pharmacotherapies limit modern generalization.
- Missing lab records (glucose and total cholesterol) are imputed via median values.
- Educational prototype score; cannot replace validated clinical tools like ACC/AHA ASCVD Risk Estimator Plus.

### Bias Discussion:
The historical Framingham cohort exhibits severe racial, geographic, and generational homogeneity. It must not be utilized as an authoritative diagnostic risk assessment across diverse modern populations.

### Uncertainty & Calibration:
All screening estimates represent statistical correlations over sampled observational populations. They do not represent causal certainty. A low risk score does not guarantee immunity from illness, nor does a high risk score confirm pathology.

---

## 5. Critical Clinical Safety Disclaimer
> **IMPORTANT:** MediTwin is an educational wellness and lifestyle simulation prototype. It does not diagnose diseases, replace professional medical consultations, prescribe treatment, or recommend altering prescription medications. Always consult a licensed medical clinician for health concerns.
