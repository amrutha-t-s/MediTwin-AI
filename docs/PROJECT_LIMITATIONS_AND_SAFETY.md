# MediTwin AI — Project Limitations & Clinical Safety Disclaimers

## 1. Safety Disclaimer & Regulatory Notice

> ### ⚠️ ESSENTIAL CLINICAL SAFETY NOTICE
> **MediTwin is an educational health-monitoring and observational simulation prototype. It is NOT a medical device, diagnostic software, or prescriptive clinical decision support system.**
>
> 1. **No Medical Diagnoses**: MediTwin does not diagnose diseases, detect acute conditions, or predict medical emergencies.
> 2. **No Medication or Insulin Alterations**: **NEVER change, adjust, titrate, or discontinue prescription medications, insulin dosages, or clinical treatments** based on scores, graphs, insights, or simulations provided by this application.
> 3. **Doctor-Patient Relationship**: MediTwin does not replace consultation with a licensed physician, endocrinologist, or qualified medical practitioner. Always consult a healthcare provider for any health decision.
> 4. **Emergency Situations**: In case of severe hypo/hyperglycemia, hypertensive crisis, chest pain, or any medical emergency, immediately contact your local emergency services (e.g. 911 or local emergency number).

---

## 2. Project Limitations

While MediTwin AI provides structured tools for tracking, pattern visualization, and habit modeling, users and evaluators should understand the following design boundaries:

### 2.1 Observational & Heuristic Modeling (Non-Deterministic)
- **Non-Causal Associations**: The rule-based insight engine identifies correlations (e.g., higher glucose on days with under 6 hours of sleep). Correlation does not imply direct medical causation; unmeasured variables (e.g. hormonal stress, illness, dehydration, ambient temperature) influence biomarker volatility.
- **Low Confidence Rating in Simulations**:
  - All lifestyle scenario simulations (+2,000 steps daily, +1 additional hour of sleep, 7 alcohol-free days) carry an explicit rating of **`Confidence: low`**.
  - **Rationale**: Human physiology is extraordinarily complex. A linear mathematical shift in daily step count or bedtime cannot deterministically forecast biochemical outcomes across heterogeneous individuals without personalized metabolic kinetics.

### 2.2 Manual Entry Variability
- **Self-Reported Data**: The current MVP relies on user-submitted logs. Inherent human variability in portion estimation, timing recall, and adherence reporting can introduce subjective noise into longitudinal aggregations.
- **Data Completeness Thresholds**: Digital Twin state evaluations and Health Consistency scores require multi-day consistency. Sporadic or missing data points will temporarily lower data completeness scores and dampen pattern fidelity.

### 2.3 Strict Pharmacological Prohibition
- **Locked Simulation Guardrail**: The Lifestyle Simulator strictly prohibits simulating changes to insulin units, prescription doses, antihypertensives, oral hypoglycemics, or any pharmaceutical therapy. Both backend API validation and frontend UI permanently lock down medication adjustments.
- **Scope Restriction**: MediTwin models only non-pharmacological lifestyle habits (walking steps, sleep duration, and alcohol pause).

### 2.4 Security & Data Privacy Constraints
- **Public Repositories & Logs**: To protect sensitive health records, no clinical metrics (glucose readings, blood pressure, medications, dosages) are permitted in URL query parameters, unencrypted console outputs, screenshots, or public repositories.
- **De-Identification**: Research consent participation operates strictly on de-identified, aggregated statistical patterns. Direct identity linkages are excluded.

---

## 3. Data Governance & Contact

For regulatory compliance, statutory privacy rights, or data protection inquiries, contact our compliance office:

- **Data Protection Officer (DPO)**: `dpo@meditwin.health`
- **Privacy Operations**: `privacy@meditwin.health`
- **Security Team**: `security@meditwin.health`
- **Corporate Address**: *MediTwin Health Technologies, 100 Innovation Way, Suite 400, Cambridge, MA 02142*
- **SLA**: Inquiries are addressed within 24–48 business hours.
