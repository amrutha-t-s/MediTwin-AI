# MediTwin Model Card: Obesity & Body Mass Category Estimation Model

## 1. Model Overview
- **Model Identifier:** `Obesity & Body Mass Category Estimation Model`
- **Purpose:** Educational lifestyle-pattern estimate based on nutritional habits, hydration, and physical exertion.
- **Architecture Selected:** `XGBoost`
- **Intended Users:** University researchers, students, and wellness telemetry simulators.
- **Out-of-Scope Use:** Emergency triage, disease diagnosis, insulin dosage prescription, or medication adjustment.

---

## 2. Dataset Information
- **Dataset Source:** UCI Estimation of Obesity Levels Based on Eating Habits and Physical Condition (Mexico, Peru, Colombia)
- **Target Variable:** NObeyesdad (7 multiclass body mass categories)
- **Number of Input Features:** 16
- **Features:** `age`, `height`, `weight`, `fcvc`, `ncp`, `ch2o`, `faf`, `tue`, `gender`, `family_history_with_overweight`, `favc`, `caec`, `smoke`, `scc`, `calc`, `mtrans`

---

## 3. Evaluation & Performance Metrics
Summary of test set evaluation (Stratified 80/20 split, `random_state=42`):

| Metric | Score |
| :--- | :--- |
| **ACCURACY** | `0.8983` |
| **PRECISION** | `0.8945` |
| **RECALL** | `0.8797` |
| **F1** | `0.8846` |
| **Confusion_matrix** | `[[43, 3, 0, 0, 0, 0, 0], [0, 80, 0, 0, 0, 2, 0], [0, 0, 80, 3, 0, 0, 1], [0, 0, 3, 61, 0, 0, 0], [0, 0, 0, 11, 54, 0, 0], [0, 3, 0, 0, 0, 33, 7], [0, 0, 5, 0, 0, 5, 29]]` |
| **Classification_report** | `{'0': {'precision': 1.0, 'recall': 0.9347826086956522, 'f1-score': 0.9662921348314607, 'support': 46.0}, '1': {'precision': 0.9302325581395349, 'recall': 0.975609756097561, 'f1-score': 0.9523809523809523, 'support': 82.0}, '2': {'precision': 0.9090909090909091, 'recall': 0.9523809523809523, 'f1-score': 0.9302325581395349, 'support': 84.0}, '3': {'precision': 0.8133333333333334, 'recall': 0.953125, 'f1-score': 0.8776978417266187, 'support': 64.0}, '4': {'precision': 1.0, 'recall': 0.8307692307692308, 'f1-score': 0.907563025210084, 'support': 65.0}, '5': {'precision': 0.825, 'recall': 0.7674418604651163, 'f1-score': 0.7951807228915663, 'support': 43.0}, '6': {'precision': 0.7837837837837838, 'recall': 0.7435897435897436, 'f1-score': 0.7631578947368421, 'support': 39.0}, 'accuracy': 0.8983451536643026, 'macro avg': {'precision': 0.8944915120496516, 'recall': 0.8796713074283222, 'f1-score': 0.8846435899881513, 'support': 423.0}, 'weighted avg': {'precision': 0.9024553357730003, 'recall': 0.8983451536643026, 'f1-score': 0.8978827391712516, 'support': 423.0}}` |
| **ROC_AUC** | `0.9931` |

---

## 4. Ethical Considerations, Bias & Limitations
### Known Limitations:
- Data primarily surveyed from young adults in urban Latin America, limiting cultural culinary generalization.
- Weight and height alone do not distinguish muscular hypertrophy from visceral adiposity.
- Uses supportive, non-stigmatizing observational classifications for education only.
- Clinical evaluation by a registered dietitian or endocrinologist remains essential.

### Bias Discussion:
Body mass index heuristics can misclassify muscular athletic demographics as elevated tiers and understate metabolic health risks in elderly populations with sarcopenia.

### Uncertainty & Calibration:
All screening estimates represent statistical correlations over sampled observational populations. They do not represent causal certainty. A low risk score does not guarantee immunity from illness, nor does a high risk score confirm pathology.

---

## 5. Critical Clinical Safety Disclaimer
> **IMPORTANT:** MediTwin is an educational wellness and lifestyle simulation prototype. It does not diagnose diseases, replace professional medical consultations, prescribe treatment, or recommend altering prescription medications. Always consult a licensed medical clinician for health concerns.
