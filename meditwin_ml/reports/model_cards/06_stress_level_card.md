# MediTwin Model Card: Stress Pattern Classification Model

## 1. Model Overview
- **Model Identifier:** `Stress Pattern Classification Model`
- **Purpose:** Educational stress level pattern classification associating biometric vitals and sleep consistency.
- **Architecture Selected:** `GradientBoosting`
- **Intended Users:** University researchers, students, and wellness telemetry simulators.
- **Out-of-Scope Use:** Emergency triage, disease diagnosis, insulin dosage prescription, or medication adjustment.

---

## 2. Dataset Information
- **Dataset Source:** Sleep Health and Lifestyle Dataset
- **Target Variable:** Stress Level Tiers: Low Stress (1-4), Moderate Stress (5-6), High Stress (7-10)
- **Number of Input Features:** 12
- **Features:** `age`, `sleep_duration`, `quality_of_sleep`, `physical_activity_level`, `heart_rate`, `daily_steps`, `sys_bp`, `dia_bp`, `gender`, `occupation`, `bmi_category`, `sleep_disorder`

---

## 3. Evaluation & Performance Metrics
Summary of test set evaluation (Stratified 80/20 split, `random_state=42`):

| Metric | Score |
| :--- | :--- |
| **ACCURACY** | `0.6667` |
| **PRECISION** | `0.6609` |
| **RECALL** | `0.6724` |
| **F1** | `0.6609` |
| **Confusion_matrix** | `[[15, 0, 5], [2, 22, 4], [9, 5, 13]]` |
| **Classification_report** | `{'0': {'precision': 0.5769230769230769, 'recall': 0.75, 'f1-score': 0.6521739130434783, 'support': 20.0}, '1': {'precision': 0.8148148148148148, 'recall': 0.7857142857142857, 'f1-score': 0.8, 'support': 28.0}, '2': {'precision': 0.5909090909090909, 'recall': 0.48148148148148145, 'f1-score': 0.5306122448979592, 'support': 27.0}, 'accuracy': 0.6666666666666666, 'macro avg': {'precision': 0.6608823275489941, 'recall': 0.6723985890652556, 'f1-score': 0.6609287193138126, 'support': 75.0}, 'weighted avg': {'precision': 0.670770957437624, 'recall': 0.6666666666666666, 'f1-score': 0.6636001183081929, 'support': 75.0}}` |
| **ROC_AUC** | `0.8396` |

---

## 4. Ethical Considerations, Bias & Limitations
### Known Limitations:
- Observational correlation between sleep duration, activity, and self-scored stress.
- Lacks cortisol, heart-rate variability (HRV), or psychometric inventories (e.g. PSS-10).
- Job occupation categories represent cohort clusters.
- Strictly educational; cannot be used for psychiatric screening or acute stress disorders.

### Bias Discussion:
Subjective stress self-scoring varies widely across cultural backgrounds and individual coping mechanisms. Telemetry models reflect cohort trends rather than psychological diagnostics.

### Uncertainty & Calibration:
All screening estimates represent statistical correlations over sampled observational populations. They do not represent causal certainty. A low risk score does not guarantee immunity from illness, nor does a high risk score confirm pathology.

---

## 5. Critical Clinical Safety Disclaimer
> **IMPORTANT:** MediTwin is an educational wellness and lifestyle simulation prototype. It does not diagnose diseases, replace professional medical consultations, prescribe treatment, or recommend altering prescription medications. Always consult a licensed medical clinician for health concerns.
