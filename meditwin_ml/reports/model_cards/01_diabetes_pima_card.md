# MediTwin Model Card: Pima Diabetes Risk Screening Model

## 1. Model Overview
- **Model Identifier:** `Pima Diabetes Risk Screening Model`
- **Purpose:** Educational screening estimation of type 2 diabetes risk from clinical exam indicators.
- **Architecture Selected:** `RandomForest`
- **Intended Users:** University researchers, students, and wellness telemetry simulators.
- **Out-of-Scope Use:** Emergency triage, disease diagnosis, insulin dosage prescription, or medication adjustment.

---

## 2. Dataset Information
- **Dataset Source:** Pima Indians Diabetes Database (National Institute of Diabetes and Digestive and Kidney Diseases)
- **Target Variable:** Outcome: 0 = Lower educational screening risk, 1 = Higher educational screening risk
- **Number of Input Features:** 8
- **Features:** `pregnancies`, `glucose`, `blood_pressure`, `skin_thickness`, `insulin`, `bmi`, `diabetes_pedigree_function`, `age`

---

## 3. Evaluation & Performance Metrics
Summary of test set evaluation (Stratified 80/20 split, `random_state=42`):

| Metric | Score |
| :--- | :--- |
| **ACCURACY** | `0.8506` |
| **PRECISION** | `0.8571` |
| **RECALL** | `0.9844` |
| **F1** | `0.9164` |
| **Confusion_matrix** | `[[5, 21], [2, 126]]` |
| **Classification_report** | `{'0': {'precision': 0.7142857142857143, 'recall': 0.19230769230769232, 'f1-score': 0.30303030303030304, 'support': 26.0}, '1': {'precision': 0.8571428571428571, 'recall': 0.984375, 'f1-score': 0.9163636363636364, 'support': 128.0}, 'accuracy': 0.8506493506493507, 'macro avg': {'precision': 0.7857142857142857, 'recall': 0.5883413461538461, 'f1-score': 0.6096969696969697, 'support': 154.0}, 'weighted avg': {'precision': 0.8330241187384044, 'recall': 0.8506493506493507, 'f1-score': 0.8128138528138528, 'support': 154.0}}` |
| **ROC_AUC** | `0.7599` |
| **PR_AUC** | `0.9307` |

---

## 4. Ethical Considerations, Bias & Limitations
### Known Limitations:
- Data gathered exclusively from female patients of Pima Indian heritage aged 21 and older.
- Substantial missing values in physiological variables like insulin and skin thickness.
- Does not reflect modern demographic or global multi-ethnic distributions.
- Screening tool only; cannot diagnose impaired glucose tolerance or diabetes mellitus.

### Bias Discussion:
The Pima dataset exhibits distinct geographic and genetic specificity. Extrapolating risk to broader multi-ethnic cohorts carries algorithmic bias.

### Uncertainty & Calibration:
All screening estimates represent statistical correlations over sampled observational populations. They do not represent causal certainty. A low risk score does not guarantee immunity from illness, nor does a high risk score confirm pathology.

---

## 5. Critical Clinical Safety Disclaimer
> **IMPORTANT:** MediTwin is an educational wellness and lifestyle simulation prototype. It does not diagnose diseases, replace professional medical consultations, prescribe treatment, or recommend altering prescription medications. Always consult a licensed medical clinician for health concerns.
