# MediTwin – MVP Requirements (Business Proposal Version)

## 1. Product Vision

MediTwin is a **digital twin for personal health**. It helps users track daily health metrics (glucose, blood pressure, food, sleep, activity, medication, lifestyle) and visualize trends. Over time, it will simulate how current habits may affect future health and suggest safer lifestyle choices.

This MVP focuses on **manual data entry + dashboard + basic insights**, without hardware integration or machine learning.

> **MediTwin is a health-monitoring and educational prototype. It does not diagnose diseases, replace a doctor, or recommend changing medication.**

---

## 2. Target Users & Roles

### 2.1 Patient / User

Primary user of the app. Capabilities:

- Create an account.
- Log in and log out.
- Complete a health profile (age, sex, height, weight, conditions, medications, family history).
- Enter daily data:
  - Glucose (mg/dL)
  - Blood pressure (systolic/diastolic)
  - Food summary
  - Sleep (hours)
  - Steps / activity
  - Medication taken (yes/no + notes)
  - Lifestyle factors (alcohol, smoking, stress, etc.)
- View charts and trends (7-day, 30-day).
- Receive simple, rule-based insights.
- Test “what-if” lifestyle scenarios (e.g., “What if I walk 30 minutes more per day?”).

### 2.2 Doctor / Health Advisor

Secondary user (read-only view in MVP). Capabilities:

- View assigned patients’ profiles and trends.
- Review daily logs and insights.
- (Future) Add notes or recommendations visible to the patient.

For MVP, this role is **planned but not fully implemented**; we just design the data model so it can be added later.

### 2.3 Administrator

Internal role for platform management. Capabilities:

- Manage user accounts (view, deactivate).
- View aggregated, anonymized usage statistics.
- Manage system settings (in future versions).

For MVP, admin features are **minimal**; we mostly ensure the system can support them later.

---

## 3. MVP Feature List (User-Facing)

### 3.1 Authentication

- User can:
  - Sign up with email + password.
  - Log in with email + password.
  - Log out.
- Passwords are stored securely (hashed).
- Sessions are managed via JWT tokens.

### 3.2 Health Profile

User can create/update a profile with:

- Age
- Sex
- Height (cm)
- Weight (kg)
- Known conditions (e.g., diabetes, hypertension)
- Current medications
- Family history of major diseases
- (Optional) Doctor notes field for future use

### 3.3 Daily Health Log

User can enter, once per day (or multiple entries per day if needed):

- Date
- Glucose (mg/dL)
- Blood pressure (systolic / diastolic)
- Food summary (free text, optionally calories later)
- Sleep duration (hours)
- Steps / physical activity
- Medication adherence (taken / not taken + notes)
- Lifestyle:
  - Alcohol units
  - Smoking (yes/no, amount)
  - Stress level (subjective scale)
  - Other notes

### 3.4 Dashboard, Charts, and Trends

User can:

- See a summary dashboard with:
  - Recent glucose readings.
  - Recent blood pressure readings.
  - Sleep and steps trends.
- View charts for:
  - Glucose over time (7-day, 30-day).
  - Blood pressure over time.
  - Sleep and steps over time.
- Filter by date range.

### 3.5 Simple Insights

System provides **rule-based, non-diagnostic** insights such as:

- “Your average glucose this week is higher than your last week.”
- “You are sleeping less than 7 hours on average.”
- “You missed medication on X days this month.”
- “Your blood pressure readings are often above 140/90.”

These are **educational prompts**, not medical advice.

### 3.6 Lifestyle Scenario Tester (“Digital Twin” Lite)

User can:

- Create a scenario with assumed changes, e.g.:
  - “Walk 30 minutes more per day (+3000 steps).”
  - “Reduce alcohol by 2 units per week.”
  - “Sleep 1 hour more per night.”
- See a **projected impact** on simple metrics (e.g., estimated average glucose, estimated BP) using **rule-based heuristics** (no ML in MVP).
- Save scenarios for later review.

In MVP, this is a **basic simulation**; later versions will refine the logic and add ML.

---

## 4. Non-Functional Requirements (MVP)

- **Security**:
  - Passwords hashed with bcrypt.
  - API protected with JWT.
  - Basic input validation.
- **Usability**:
  - Clean, mobile-friendly UI.
  - Simple navigation: Dashboard, Profile, Log, Scenarios.
- **Performance**:
  - Pages load within ~2 seconds on typical broadband.
- **Scalability (planned)**:
  - Data model supports many users.
  - Architecture can later integrate devices (Fitbit, CGM, BP monitors).
- **Compliance mindset**:
  - Clear disclaimer that this is not a medical device.
  - No claims of diagnosis or treatment.

---

## 5. Out of Scope for MVP

- Direct integration with Fitbit, CGM, or BP devices.
- Machine learning models for prediction.
- Multi-doctor workflows, appointments, or chat.
- Payments, subscriptions, or billing.
- Advanced analytics or population-level studies.

These will be described in the proposal as **future roadmap items**.

---

## 6. Success Metrics (for Proposal)

For the MVP phase, success means:

- Users can reliably:
  - Sign up, log in, and manage their profile.
  - Enter daily data for at least 30 days.
  - View clear charts and trends.
  - Understand at least 3–5 simple insights.
  - Create and review at least one lifestyle scenario.
- System is stable enough for:
  - Demo in class.
  - Demo for potential partners (clinics, wellness coaches).
- Proposal clearly shows:
  - Problem: poor self-management of diabetes and lifestyle.
  - Solution: MediTwin digital twin for health.
  - Business potential: B2C wellness, B2B2C via clinics/employers.

---

## 7. Legal & Ethical Disclaimer

> **MediTwin is a health-monitoring and educational prototype. It does not diagnose diseases, replace a doctor, or recommend changing medication. All insights and simulations are for informational and educational purposes only. Users should consult qualified healthcare professionals for medical advice, diagnosis, or treatment.**

This disclaimer must appear:

- In the app (e.g., on login or dashboard footer).
- In all presentation slides and documents.
- In any public demo or proposal material.
