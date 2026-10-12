# MediTwin AI — Personal Health Digital Twin & Lifestyle Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend: React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite_8-61DAFB?logo=react)](frontend/)
[![Backend: Express 5](https://img.shields.io/badge/Backend-Node.js_+_Express_5-green?logo=nodedotjs)](backend/)
[![ORM: Prisma 7](https://img.shields.io/badge/ORM-Prisma_7-2D3748?logo=prisma)](backend/prisma/)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-336791?logo=postgresql)](backend/prisma/)
[![Build: Verified](https://img.shields.io/badge/Build-Passing_(0_Errors)-brightgreen)]()

MediTwin AI is a **personal health digital twin and lifestyle simulation platform**. It models multi-metric physiological and lifestyle habits (blood glucose, blood pressure, sleep, physical activity, nutrition, and medication adherence) into an observational pattern state. MediTwin empowers users to understand longitudinal correlations, test non-pharmacological habit changes, and monitor wellness consistency without diagnostic or clinical claims.

> ### ⚠️ CLINICAL SAFETY DISCLAIMER
> **MediTwin is an educational wellness and simulation prototype—NOT a medical device, diagnostic tool, or clinical decision support software.**
> - MediTwin **does not diagnose diseases, recommend altering medications, or replace professional medical consultations**.
> - **Never adjust insulin dosages or prescription therapies** based on insights or simulations in this application.
> - Simulations reflect non-pharmacological observational heuristics and are explicitly labeled **`Confidence: low`**.
> - In medical emergencies, immediately contact local emergency services.

---

## 📸 Screenshots & UI Showcase

<div align="center">
  <img src="docs/assets/screenshots/dashboard_overview.jpg" alt="MediTwin AI Health Dashboard" width="85%" />
  <p><em>Figure 1: MediTwin Dashboard — Health Consistency Score (74/100), Biometric Overviews, and Activity Patterns</em></p>
</div>

<div align="center">
  <img src="docs/assets/screenshots/lifestyle_simulator.jpg" alt="MediTwin Lifestyle Simulator & Guardrails" width="85%" />
  <p><em>Figure 2: Lifestyle Simulator — Current Pattern vs Simulated Pattern comparison, Low Confidence rating, and Locked Medication Guardrail</em></p>
</div>

---

## 🚀 Quick Start & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher running on `localhost:5432`

---

### Step 1: Clone & Configure Repository
```bash
git clone https://github.com/amrutha-t-s/MediTwin-AI.git
cd meditiwin
```

---

### Step 2: Backend Setup & Database Migration
```bash
cd backend
npm install

# Verify your database connection string in backend/.env:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/meditwin"
# JWT_SECRET="your_secure_random_jwt_secret"
# PORT=4000

# Push Prisma schema to your PostgreSQL database
npx prisma db push

# Seed the pre-configured 14-day demonstration account & test data
npm run seed

# Run automated workflow verification tests (all 14 steps)
npm run test:workflow

# Start backend server
node server.js
```
The backend API will start on **`http://localhost:4000`**.

---

### Step 3: Frontend Setup & Launch
Open a new terminal window:
```bash
cd frontend
npm install

# Run frontend linting & production build checks
npm run lint
npm run build

# Start frontend development server
npm run dev
```
The frontend user interface will open at **`http://localhost:5173`**.

---

## 👤 Demonstration User Account & Test Data

The database includes a pre-seeded demonstration account with **14 consecutive days of multi-metric health data**:

| Property | Demonstration Account Credential |
| :--- | :--- |
| **Email** | `demo@meditwin.health` |
| **Password** | `DemoPassword123!` |
| **Patient Name** | Alex Morgan |
| **Role** | `patient` |
| **Clinical Profile** | 42 yrs female, Type 2 diabetes (lifestyle-managed), pre-hypertension stage 1 |
| **Prescription Baseline** | Metformin 500mg daily (recorded adherence ~90%) |
| **Test Dataset** | 14 days of glucose (108–146 mg/dL), BP (118/74–134/86 mmHg), sleep (5.2–8.0h), steps (3,600–9,400), dietary flags, and saved simulations |

---

## 🧪 Complete 14-Step Workflow Demonstration

The following 14-step workflow demonstrates the end-to-end lifecycle of MediTwin AI. You can test this interactively in your browser or automatically run `npm run test:workflow` in the backend.

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

| Step # | Stage / Feature | URL Path | What to Observe |
| :---: | :--- | :--- | :--- |
| **1** | **Welcome Page** | `/` | Responsive landing page with health twin introduction, feature overview, and clinical safety disclaimer. |
| **2** | **Register** | `/register` | Form validation: checks email format, password (≥8 chars), matches confirmation, and requires terms & privacy consent. |
| **3** | **Login** | `/login` | Authenticates user, issues JWT, logs `LOGIN` audit event, and stores user session. |
| **4** | **Onboarding** | `/onboarding` | 4-step wizard collecting demographics, body measurements (height/weight), diabetes & BP history, and typical activity. |
| **5** | **Dashboard** | `/dashboard` | Displays **Health consistency score: 74/100** with component breakdown: Activity: 80, Sleep: 65, Medication: 90, Glucose consistency: 70. Labeled as a prototype non-clinical score. |
| **6** | **Daily Health Journal** | `/health-journal` | Comprehensive multi-metric entry form with glucose, blood pressure, pulse, sleep hours/quality, meal flags (sugary drink, high carb, veggies), and medication adherence. |
| **7** | **Save Health Record** | `/health-journal` | Commits entry to database (`POST /api/journal`), updates daily summary, and triggers green confirmation alert. |
| **8** | **Health History** | `/health-history` | Tabular display and mobile cards with date search, metric filtering (Glucose, BP, Steps, Sleep), pagination, and action controls. |
| **9** | **Edit Record** | `/health-history` | In-place record editing (`PUT /api/health-logs/:id`) allowing correction of readings and notes with instant table refresh. |
| **10** | **Trend Charts** | `/trends` | Recharts 7-day and 30-day temporal graphs showing multi-metric time series (glucose, BP, steps, sleep, and adherence). |
| **11** | **Health Insights** | `/insights` | Evaluates 7 rule-based insights using strictly associative language (*"associated with"*) and factual basis statements (e.g. *"Based on your last 14 records..."*). |
| **12** | **Digital Twin** | `/digital-twin` | Renders the **8-node pattern tree** and `health-state` JSON object modeling current health trends without exaggerated claims. |
| **13** | **Lifestyle Simulator** | `/lifestyle-simulator` | 3 preset scenarios (*+2,000 steps daily*, *+1h sleep*, *Avoid alcohol 7 days*). Displays: `Current pattern versus Simulated pattern` with `Confidence: low`. Locked guardrail rejects medication simulations. |
| **14** | **Logout** | Sidebar / `/privacy-consent` | Terminates active sessions, triggers server-side session invalidation (`POST /api/privacy/logout-all`), and safely redirects to login. |

---

## 🏛️ System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Presentation Layer (Client)"]
        UI["React 19 + Vite 8 SPA"]
        Router["React Router v7"]
        State["Client State & Auth Token Storage"]
        Charts["Recharts Visualizations"]
    end

    subgraph Security["API Gateway & Security Layer"]
        Helmet["Helmet HTTP Headers Security"]
        CORS["CORS Policy (Origin: localhost:5173)"]
        AuthMiddleware["JWT Authentication Middleware"]
        RBAC["Role-Based Access Control (RBAC)"]
        AuditMiddleware["Secure Audit Logger (Zero PHI)"]
    end

    subgraph Engines["Domain Services & Engine Layer"]
        ScoreEngine["Health Consistency Score Engine\n(Activity: 80, Sleep: 65, Med: 90, Glucose: 70)"]
        InsightEngine["Rule-Based Insight Engine\n(7 Associative Rules with Basis)"]
        TwinEngine["Digital Twin Synthesizer\n(8-Node Pattern Tree & Health-State)"]
        SimulatorEngine["Lifestyle Simulator Engine\n(Non-pharmacological +2k steps, +1h sleep)"]
    end

    subgraph Routes["REST API Gateway (Express 5)"]
        AuthRoutes["/api/auth"]
        ProfileRoutes["/api/profile"]
        JournalRoutes["/api/journal"]
        HealthLogRoutes["/api/health-logs"]
        DashRoutes["/api/dashboard"]
        TrendRoutes["/api/trends"]
        InsightRoutes["/api/insights"]
        TwinRoutes["/api/digital-twin"]
        SimRoutes["/api/simulations"]
        PrivacyRoutes["/api/privacy"]
        AdminRoutes["/api/admin"]
    end

    subgraph Persistence["Persistence & Data Access Layer"]
        Prisma["Prisma ORM Client v7\n(@prisma/adapter-pg)"]
        DB[(PostgreSQL Database\nmeditwin)]
    end

    UI --> Router
    Router --> Security
    Security --> Routes
    Routes --> Engines
    Engines --> Prisma
    Prisma --> DB

    AuthMiddleware -.-> RBAC
    Routes -.-> AuditMiddleware
    AuditMiddleware -.-> DB
```

---

## 🗄️ Database Schema Diagram

```mermaid
erDiagram
    User ||--o| HealthProfile : "has baseline"
    User ||--o{ DailyHealthLog : "logs daily"
    User ||--o{ Medication : "tracks"
    User ||--o{ ScenarioSimulation : "runs"
    User ||--o{ FamilyHistory : "records"
    User ||--o{ Prediction : "receives"
    User ||--o{ Consent : "manages"
    User ||--o{ AuditLog : "generates"

    User {
        uuid id PK
        string email UK
        string passwordHash
        string fullName
        string role "patient | doctor | admin"
        datetime createdAt
        datetime updatedAt
    }

    HealthProfile {
        uuid id PK
        uuid userId FK, UK
        datetime dateOfBirth
        float heightCm
        float weightKg
        string diabetesStatus
        float typicalSleep
        string typicalActivity
    }

    DailyHealthLog {
        uuid id PK
        uuid userId FK
        datetime date "Indexed"
        float glucose "mg/dL"
        int bpSystolic "mmHg"
        int bpDiastolic "mmHg"
        int heartRate "bpm"
        float sleepHours
        int steps
        boolean hasSugaryDrink
        string medicationTaken
        string notes
    }

    Medication {
        uuid id PK
        uuid userId FK
        string name
        string dosage
        string frequency
        boolean isActive
    }

    ScenarioSimulation {
        uuid id PK
        uuid userId FK
        string name
        json changes "Non-pharmacological"
        json result "Heuristic projection"
        datetime createdAt
    }

    Consent {
        uuid id PK
        uuid userId FK
        string consentType "terms_and_privacy | research_use"
        boolean granted
        datetime grantedAt
        datetime revokedAt
    }

    AuditLog {
        uuid id PK
        uuid userId FK
        string action "LOGIN | LOGOUT_ALL | EXPORT"
        string ipAddress
        json details "Strictly Non-PHI"
        datetime createdAt "Indexed"
    }
```

---

## 📡 REST API Reference

| Endpoint | Method | Role / Auth | Description |
| :--- | :---: | :---: | :--- |
| `POST /api/auth/register` | `POST` | Public | Register new user and record mandatory terms consent |
| `POST /api/auth/login` | `POST` | Public | Authenticate user, issue JWT token, and record audit event |
| `GET /api/profile` | `GET` | Bearer Token | Retrieve authenticated user's baseline health profile |
| `POST /api/profile` | `POST` | Bearer Token | Create or update 4-step onboarding health profile |
| `POST /api/journal` | `POST` | Bearer Token | Submit full daily journal entry (vitals, sleep, meals, adherence) |
| `GET /api/health-logs` | `GET` | Bearer Token | Query paginated history with date search and metric filtering |
| `PUT /api/health-logs/:id` | `PUT` | Bearer Token | Update existing daily health record |
| `DELETE /api/health-logs/:id`| `DELETE` | Bearer Token | Granular deletion of a specific day's record |
| `GET /api/dashboard` | `GET` | Bearer Token | Retrieve today's metrics and Health Consistency Score (74/100) |
| `GET /api/trends` | `GET` | Bearer Token | Multi-metric time series aggregations over 7 or 30 days |
| `GET /api/insights` | `GET` | Bearer Token | Evaluates 7 associative rule-based insights with clinical basis |
| `GET /api/digital-twin` | `GET` | Bearer Token | Synthesizes 8-node pattern tree and `health-state` JSON object |
| `GET /api/simulations` | `GET` | Bearer Token | List saved lifestyle simulation runs |
| `POST /api/simulations` | `POST` | Bearer Token | Save simulation. **Rejects insulin/medication changes (HTTP 400)** |
| `GET /api/privacy/consent` | `GET` | Bearer Token | Retrieve user's privacy and research-use consent preferences |
| `POST /api/privacy/consent`| `POST` | Bearer Token | Grant or revoke research-use consent |
| `GET /api/privacy/export` | `GET` | Bearer Token | Download complete health record JSON (zero PHI in URLs) |
| `POST /api/privacy/logout-all`| `POST` | Bearer Token | Cryptographically invalidate all active sessions across devices |
| `DELETE /api/privacy/account`| `DELETE` | Bearer Token | Cascade delete user account and all personal health records |
| `GET /api/admin/stats` | `GET` | Admin Role | Administrative platform statistics (total users, logs, audits) |

*Full request and response schemas are available in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).*

---

## 🔒 Security, Privacy & PHI Guardrails

Because personal health records are sensitive:
1. **Zero PHI in URLs**: Health metrics are never passed through URL parameters.
2. **Zero PHI in Logs**: The audit logging engine (`logAudit`) programmatically redacts clinical metrics (`glucose`, `bpSystolic`, `medicationName`, etc.) prior to writing to the database or console.
3. **Session Revocation**: The `LOGOUT_ALL_SESSIONS` mechanism checks token timestamps on every request, revoking stolen or discarded sessions across all devices.
4. **Role-Based Access Control (RBAC)**: Enforced both on server endpoints (`requireRole`) and client navigation (`ProtectedRoute`), segregating patient data, clinician tools, and system admin logs.

---

## 🔬 Project Limitations & Boundaries

1. **Non-Clinical Nature**: MediTwin is an observational and educational software prototype. It is not an FDA-cleared or CE-marked medical device.
2. **Associative, Non-Causal Rules**: Insights reflect statistical correlations across 14-day observation windows without claiming medical causation.
3. **Simulation Confidence**: Simulations model non-pharmacological habit changes and carry an explicit rating of **`Confidence: low`** to reflect biological complexity.
4. **Medication Guardrail**: MediTwin does not model, calculate, or simulate insulin units, prescription doses, or pharmacological interventions.
5. **Self-Reported Data**: Manual logging relies on user diligence; unrecorded days decrease data completeness percentages.

*For complete details, see [docs/PROJECT_LIMITATIONS_AND_SAFETY.md](docs/PROJECT_LIMITATIONS_AND_SAFETY.md).*

---

## ⌚ Future Hardware-Integration Strategic Plan

MediTwin’s technical roadmap includes continuous physiological data streaming:
- **Continuous Glucose Monitors (CGMs)**: Integration with Dexcom Partner Cloud API (OAuth 2.0 Webhooks) and Abbott FreeStyle LibreLinkUp Gateway for 5-minute telemetry streams.
- **Wearables & Smartwatches**: Bidirectional synchronization with Apple HealthKit, Google Health Connect, and Garmin Health API for sleep staging and step velocities.
- **Smart Hemodynamic Monitors**: Bluetooth Low Energy (BLE) GATT profile `0x1810` for automated blood pressure cuff readings (Omron, Withings).
- **Clinical Interoperability**: Direct HL7 FHIR v4 Observation resource mapping (`LOINC 2339-0` for glucose, `LOINC 85354-9` for BP).

*Read the full technical specification in [docs/HARDWARE_INTEGRATION_PLAN.md](docs/HARDWARE_INTEGRATION_PLAN.md).*

---

## 📚 Project Documentation Directory

- **[docs/DEMONSTRATION_GUIDE.md](docs/DEMONSTRATION_GUIDE.md)** — Evaluator checklist for the 14-step demonstration.
- **[docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)** — Architectural design, security topology, and component breakdown.
- **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** — Entity-relationship diagrams and cascade delete specifications.
- **[docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** — Complete REST API endpoint reference and payload examples.
- **[docs/HARDWARE_INTEGRATION_PLAN.md](docs/HARDWARE_INTEGRATION_PLAN.md)** — Technical roadmap for CGMs, smartwatches, and BLE peripherals.
- **[docs/PROJECT_LIMITATIONS_AND_SAFETY.md](docs/PROJECT_LIMITATIONS_AND_SAFETY.md)** — Clinical disclaimers, low confidence rationale, and governance.

---

## ⚖️ License & Contact

Distributed under the MIT License.

- **Data Protection Officer (DPO)**: `dpo@meditwin.health`
- **Privacy & Security Team**: `privacy@meditwin.health`
- **Location**: *MediTwin Health Technologies, 100 Innovation Way, Suite 400, Cambridge, MA 02142*
