# MediTwin AI — Evaluator Demonstration & Workflow Testing Guide

This guide outlines the complete 14-step workflow demonstration for evaluators, instructors, and demonstration audiences.

---

## 1. Quick Demonstration Credentials

A pre-populated demonstration account has been seeded into the database with 14 days of realistic, multi-metric test data:

- **Login URL**: [http://localhost:5173/login](http://localhost:5173/login)
- **Email**: `demo@meditwin.health`
- **Password**: `DemoPassword123!`
- **Role**: `patient` (Patient account with full access)
- **Patient Profile**: Alex Morgan (Female, 42 yrs, Type 2 diabetes managed by diet & Metformin)

> **Automated Workflow Test**: Run `npm run test:workflow` in `backend/` to execute an automated, end-to-end programmatic verification of all 14 steps.

---

## 2. Step-by-Step Interactive Workflow Walkthrough

```text
Welcome page
  ↓
Register
  ↓
Login
  ↓
Onboarding
  ↓
Dashboard
  ↓
Daily health journal
  ↓
Save health record
  ↓
Health history
  ↓
Edit record
  ↓
Trend charts
  ↓
Health insights
  ↓
Digital Twin
  ↓
Lifestyle simulator
  ↓
Logout
```

| Step # | Stage / Page | URL Path | What to Test & Observe | Expected Result |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Welcome Page** | `/` | Open root landing page. Check application introduction, hero banner, feature overview, and prominent safety disclaimer. | Clean, responsive welcome interface with active navigation and disclaimers. |
| **2** | **Register** | `/register` | Click *"Get Started"* or navigate to registration. Enter full name, email, password, and check the mandatory terms & privacy consent checkbox. | Validates email format, password length (≥8 chars), matches confirmation, and creates `User` + `Consent` records (HTTP 201). |
| **3** | **Login** | `/login` | Enter registered credentials or use demo credentials (`demo@meditwin.health` / `DemoPassword123!`). | Issues JWT token, saves role & userId in browser storage, logs `LOGIN` security audit event, and directs to Dashboard. |
| **4** | **Onboarding** | `/onboarding` | Complete the 4-step health profile: Demographics, Biometrics (Height/Weight), Medical Background (Diabetes/BP history), and Lifestyle habits. | Saves baseline `HealthProfile` via `POST /api/profile` and initializes personalized parameters. |
| **5** | **Dashboard** | `/dashboard` | View top overview: Today's metrics, quick biometric cards (Glucose 112 mg/dL, BP 120/78 mmHg, Steps 8,400, Sleep 7.4h), and the **Health Consistency Score**. | Displays: <br>`Health consistency score: 74/100`<br>`Activity: 80`<br>`Sleep: 65`<br>`Medication: 90`<br>`Glucose consistency: 70`<br>Labeled as prototype non-clinical score. |
| **6** | **Daily Health Journal** | `/health-journal` | Navigate to journal. Enter multi-metric entries: Blood glucose, BP systolic/diastolic, heart rate, sleep start/wake times, meal details with dietary flags, and medication adherence. | Comprehensive input validation (OWASP allowlists, type checks, numerical bounds). |
| **7** | **Save Health Record** | `/health-journal` | Click *"Save Journal Entry"*. | Persists record into `DailyHealthLog` table with unique UUID (HTTP 201). Displays green confirmation notification. |
| **8** | **Health History** | `/health-history` | View the historical records table and mobile-friendly cards. Test the search bar (filter by date) and dropdown metric filter (filter by Glucose, BP, Steps, etc.). | Displays tabular logs with Date, Glucose, BP, Steps, Sleep, Medication status, View details, Edit, and Delete actions. Supports pagination. |
| **9** | **Edit Record** | `/health-history` | Click the *"Edit"* button on any record. Modify the glucose reading (e.g. from 115 to 112 mg/dL) or notes, then save. | Updates database in place (`PUT /api/health-logs/:id`). The table immediately reflects the updated reading. |
| **10** | **Trend Charts** | `/trends` | Open Trends page. Switch between 7-day and 30-day views. Observe multi-metric time series lines for glucose, blood pressure, step volume, and sleep duration. | Recharts renders clean temporal curves showing weekly averages and calculated adherence rates. |
| **11** | **Health Insights** | `/insights` or `/dashboard` | Review the rule-based insight engine outputs. Notice rules like *Low average sleep*, *Higher glucose after late meals*, and *Improved readings after exercise*. | Each insight uses strictly associative language (*"associated with"*) and includes its factual basis statement (e.g. *"Based on your last 14 records..."*). |
| **12** | **Digital Twin** | `/digital-twin` | Open Digital Twin page. Inspect the **8-node tree structure** and the normalized `health-state` object. | Displays:<br>`Your MediTwin`<br>`├── Current glucose trend`<br>`├── Current BP trend`<br>`├── Activity pattern`<br>`├── Sleep pattern`<br>`├── Medication adherence`<br>`├── Positive behaviors`<br>`├── Areas needing attention`<br>`└── Last updated time`<br>No exaggerated future body predictions. |
| **13** | **Lifestyle Simulator** | `/lifestyle-simulator` | Select one of the three preset scenarios: *Add 2,000 steps daily*, *Sleep one additional hour*, or *Avoid alcohol for seven days*. Observe comparison layout and locked guardrails. | Displays exact comparison format:<br>`Current pattern versus Simulated pattern`<br>`Current average steps: 4,200/day`<br>`Simulated steps: 6,200/day`<br>`Estimated result: likely improvement in activity consistency`<br>`Confidence: low`<br>Insulin/medication simulation is permanently locked. |
| **14** | **Logout** | `/privacy-consent` or Sidebar | In the sidebar or Privacy page, click *"Logout"* or *"Logout From All Sessions"*. | Clears browser storage, calls backend session revocation (`POST /api/privacy/logout-all`), and redirects safely to `/login`. |

---

## 3. Supplementary Demonstrations

- **Data Export**: On the Privacy page (`/privacy-consent`), click *"Export Data (JSON)"* to verify zero-PHI file download.
- **Role-Based Authorization (RBAC)**:
  - Try accessing `/admin` as a patient → Renders *Access Restricted* shield (HTTP 403).
  - Use the built-in role switcher on `/privacy-consent` (Tab: Role Authorization) to switch to `admin` and access `/admin` to view system telemetry and audit logs.
- **Account Deletion (Danger Zone)**: In `/privacy-consent`, test the double-confirmation modal requiring the user to type `"DELETE"` before purging all records.
