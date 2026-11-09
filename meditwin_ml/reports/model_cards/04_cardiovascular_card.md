# MediTwin Model Card: Cardiovascular Disease Risk Classification Model

## 1. Model Overview
- **Model Identifier:** `Cardiovascular Disease Risk Classification Model`
- **Purpose:** Educational risk screening synthesizing ambulatory biometrics (blood pressure, cholesterol, BMI).
- **Architecture Selected:** `LogisticRegression`
- **Intended Users:** University researchers, students, and wellness telemetry simulators.
- **Out-of-Scope Use:** Emergency triage, disease diagnosis, insulin dosage prescription, or medication adjustment.

---

## 2. Dataset Information
- **Dataset Source:** Cardiovascular Disease Dataset (70,000 observational patient examination records)
- **Target Variable:** cardio: 1 = Presence of cardiovascular condition screened, 0 = Absence
- **Number of Input Features:** 12
- **Features:** `age_years`, `gender`, `height`, `weight`, `ap_hi`, `ap_lo`, `cholesterol`, `gluc`, `smoke`, `alco`, `active`, `bmi`

---

## 3. Evaluation & Performance Metrics
Summary of test set evaluation (Stratified 80/20 split, `random_state=42`):

| Metric | Score |
| :--- | :--- |
| **ACCURACY** | `0.7023` |
| **PRECISION** | `0.7171` |
| **RECALL** | `0.9338` |
| **F1** | `0.8112` |
| **Confusion_matrix** | `[[250, 1007], [181, 2552]]` |
| **Classification_report** | `{'0': {'precision': 0.580046403712297, 'recall': 0.19888623707239458, 'f1-score': 0.2962085308056872, 'support': 1257.0}, '1': {'precision': 0.7170553526271425, 'recall': 0.933772411269667, 'f1-score': 0.8111888111888111, 'support': 2733.0}, 'accuracy': 0.7022556390977444, 'macro avg': {'precision': 0.6485508781697198, 'recall': 0.5663293241710308, 'f1-score': 0.5536986709972491, 'support': 3990.0}, 'weighted avg': {'precision': 0.6738923830066009, 'recall': 0.7022556390977444, 'f1-score': 0.6489506627072105, 'support': 3990.0}}` |
| **ROC_AUC** | `0.6870` |
| **PR_AUC** | `0.8159` |

---

## 4. Ethical Considerations, Bias & Limitations
### Known Limitations:
- Examination records represent cross-sectional clinic visits without longitudinal angiography verification.
- Features like smoking and alcohol consumption are recorded binarily without quantification of dosage/duration.
- Blood pressure readings require repeated ambulatory telemetry rather than single-snapshot evaluations.
- Educational prototype score; cannot be utilized in acute cardiac emergencies or chest pain evaluation.

### Bias Discussion:
Cross-sectional clinical examination data reflects patients actively presenting to healthcare facilities, potentially overestimating baseline risk relative to asymptomatic community cohorts.

### Uncertainty & Calibration:
All screening estimates represent statistical correlations over sampled observational populations. They do not represent causal certainty. A low risk score does not guarantee immunity from illness, nor does a high risk score confirm pathology.

---

## 5. Critical Clinical Safety Disclaimer
> **IMPORTANT:** MediTwin is an educational wellness and lifestyle simulation prototype. It does not diagnose diseases, replace professional medical consultations, prescribe treatment, or recommend altering prescription medications. Always consult a licensed medical clinician for health concerns.
