# MediTwin Model Card: Sleep Quality Trend Estimation Model

## 1. Model Overview
- **Model Identifier:** `Sleep Quality Trend Estimation Model`
- **Purpose:** Educational regression model correlating sleep duration, stress score, and exercise with sleep quality index.
- **Architecture Selected:** `RidgeRegression`
- **Intended Users:** University researchers, students, and wellness telemetry simulators.
- **Out-of-Scope Use:** Emergency triage, disease diagnosis, insulin dosage prescription, or medication adjustment.

---

## 2. Dataset Information
- **Dataset Source:** Sleep Health and Lifestyle Dataset
- **Target Variable:** Quality of Sleep (Continuous index scaled 1 to 10)
- **Number of Input Features:** 12
- **Features:** `age`, `sleep_duration`, `physical_activity_level`, `stress_level`, `heart_rate`, `daily_steps`, `sys_bp`, `dia_bp`, `gender`, `occupation`, `bmi_category`, `sleep_disorder`

---

## 3. Evaluation & Performance Metrics
Summary of test set evaluation (Stratified 80/20 split, `random_state=42`):

| Metric | Score |
| :--- | :--- |
| **MAE** | `0.4608` |
| **RMSE** | `0.5488` |
| **R2** | `0.7694` |
| **Y_pred_sample** | `[5.816584626756818, 6.663296561236125, 7.251299494582241, 4.453832412499279, 6.700956893257091, 6.069224188520432, 7.03722698222062, 5.703247861865463, 7.487499757613649, 6.2175846607570175]` |

---

## 4. Ethical Considerations, Bias & Limitations
### Known Limitations:
- Quality ratings derived from subjective survey scoring rather than polysomnography (PSG) sleep studies.
- Lacks sleep architecture breakdown (REM vs Deep/Slow-Wave Sleep duration).
- Caffeine, circadian shift work, and evening screen exposure are not modeled.
- Screening prototype only; does not diagnose obstructive sleep apnea, narcolepsy, or restless legs syndrome.

### Bias Discussion:
Subjective sleep ratings differ based on lifestyle expectations and self-perceived sleep satisfaction. Wearable accelerometry or medical polysomnography is required for clinical sleep assessments.

### Uncertainty & Calibration:
All screening estimates represent statistical correlations over sampled observational populations. They do not represent causal certainty. A low risk score does not guarantee immunity from illness, nor does a high risk score confirm pathology.

---

## 5. Critical Clinical Safety Disclaimer
> **IMPORTANT:** MediTwin is an educational wellness and lifestyle simulation prototype. It does not diagnose diseases, replace professional medical consultations, prescribe treatment, or recommend altering prescription medications. Always consult a licensed medical clinician for health concerns.
