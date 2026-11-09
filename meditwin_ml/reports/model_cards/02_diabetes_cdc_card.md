# MediTwin Model Card: CDC Diabetes Health Indicators Risk Screening Model

## 1. Model Overview
- **Model Identifier:** `CDC Diabetes Health Indicators Risk Screening Model`
- **Purpose:** Educational risk screening synthesizing survey health indicators and behavioral factors.
- **Architecture Selected:** `RandomForest`
- **Intended Users:** University researchers, students, and wellness telemetry simulators.
- **Out-of-Scope Use:** Emergency triage, disease diagnosis, insulin dosage prescription, or medication adjustment.

---

## 2. Dataset Information
- **Dataset Source:** CDC Behavioral Risk Factor Surveillance System (BRFSS) Health Indicators
- **Target Variable:** diabetes_risk_positive (1 = Prediabetes or Diabetes history screened, 0 = Non-diabetic)
- **Number of Input Features:** 21
- **Features:** `high_bp`, `high_chol`, `chol_check`, `bmi`, `smoker`, `stroke`, `heart_diseaseor_attack`, `phys_activity`, `fruits`, `veggies`, `hvy_alcohol_consump`, `any_healthcare`, `no_docbc_cost`, `gen_hlth`, `ment_hlth`, `phys_hlth`, `diff_walk`, `sex`, `age`, `education`, `income`

---

## 3. Evaluation & Performance Metrics
Summary of test set evaluation (Stratified 80/20 split, `random_state=42`):

| Metric | Score |
| :--- | :--- |
| **ACCURACY** | `0.8628` |
| **PRECISION** | `0.1312` |
| **RECALL** | `0.3264` |
| **F1** | `0.1872` |
| **Confusion_matrix** | `[[4235, 523], [163, 79]]` |
| **Classification_report** | `{'0': {'precision': 0.96293769895407, 'recall': 0.8900798654897015, 'f1-score': 0.9250764525993884, 'support': 4758.0}, '1': {'precision': 0.13122923588039867, 'recall': 0.32644628099173556, 'f1-score': 0.1872037914691943, 'support': 242.0}, 'accuracy': 0.8628, 'macro avg': {'precision': 0.5470834674172343, 'recall': 0.6082630732407186, 'f1-score': 0.5561401220342914, 'support': 5000.0}, 'weighted avg': {'precision': 0.9226830093413042, 'recall': 0.8628, 'f1-score': 0.8893634158006869, 'support': 5000.0}}` |
| **ROC_AUC** | `0.7291` |
| **PR_AUC** | `0.1175` |

---

## 4. Ethical Considerations, Bias & Limitations
### Known Limitations:
- Data derived from telephone survey self-reporting, susceptible to recall and social desirability bias.
- Substantial class imbalance typical of general epidemiological cohorts.
- Lacks confirmatory laboratory glycemic metrics (HbA1c or oral glucose tolerance tests).
- Screening estimate only; does not differentiate Type 1, Type 2, or secondary diabetes.

### Bias Discussion:
Self-reported health surveys frequently underrepresent marginalized or unhoused groups and individuals lacking consistent telephone access.

### Uncertainty & Calibration:
All screening estimates represent statistical correlations over sampled observational populations. They do not represent causal certainty. A low risk score does not guarantee immunity from illness, nor does a high risk score confirm pathology.

---

## 5. Critical Clinical Safety Disclaimer
> **IMPORTANT:** MediTwin is an educational wellness and lifestyle simulation prototype. It does not diagnose diseases, replace professional medical consultations, prescribe treatment, or recommend altering prescription medications. Always consult a licensed medical clinician for health concerns.
