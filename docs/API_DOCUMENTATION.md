# MediTwin AI — REST API Documentation

The MediTwin API is a RESTful service operating on port `4000`. All protected endpoints require a valid Bearer token in the `Authorization` HTTP header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "fullName": "Alex Morgan",
  "email": "demo@meditwin.health",
  "password": "DemoPassword123!",
  "confirmPassword": "DemoPassword123!",
  "termsAccepted": true,
  "role": "patient"
}
```
- **Response (201 Created)**:
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "6890c77e-bf44-40d4-a478-1d555e0c1d24",
    "fullName": "Alex Morgan",
    "email": "demo@meditwin.health",
    "role": "patient"
  }
}
```

### 1.2 Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "demo@meditwin.health",
  "password": "DemoPassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6890c77e-bf44-40d4-a478-1d555e0c1d24",
    "email": "demo@meditwin.health",
    "role": "patient",
    "fullName": "Alex Morgan"
  }
}
```

---

## 2. Onboarding & Profile (`/api/profile`)

### 2.1 Get Health Profile
- **Method**: `GET`
- **Path**: `/api/profile`
- **Auth**: Bearer Token
- **Response (200 OK)**:
```json
{
  "user": {
    "id": "uuid",
    "fullName": "Alex Morgan",
    "email": "demo@meditwin.health",
    "role": "patient"
  },
  "healthProfile": {
    "gender": "female",
    "dateOfBirth": "1984-06-15T00:00:00.000Z",
    "heightCm": 168,
    "weightKg": 68.5,
    "diabetesStatus": "Type 2",
    "typicalSleep": 6.5,
    "typicalActivity": "moderate"
  }
}
```

### 2.2 Create or Update Health Profile
- **Method**: `POST`
- **Path**: `/api/profile`
- **Auth**: Bearer Token
- **Request Body**: Accepts baseline fields (`dateOfBirth`, `gender`, `heightCm`, `weightKg`, `location`, `diabetesStatus`, `typicalSleep`, `typicalActivity`, `foodPreference`).
- **Response (200 OK)**: Returns updated `healthProfile` object.

---

## 3. Daily Health Journal & Records (`/api/journal` & `/api/health-logs`)

### 3.1 Create Daily Journal Log
- **Method**: `POST`
- **Path**: `/api/journal`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "date": "2026-10-13T12:00:00.000Z",
  "glucose": 114,
  "systolicBP": 120,
  "diastolicBP": 78,
  "pulseRate": 72,
  "steps": 7500,
  "sleepDuration": 7.2,
  "sleepQuality": 4,
  "breakfast": "Oatmeal with berries",
  "breakfastVegetables": true,
  "dinner": "Grilled chicken with broccoli",
  "medicationName": "Metformin",
  "medicationDosage": "500 mg",
  "medicationTaken": "Taken",
  "notes": "Balanced day"
}
```
- **Response (201 Created)**: Returns saved `journal` record with UUID.

### 3.2 Query Health History
- **Method**: `GET`
- **Path**: `/api/health-logs`
- **Auth**: Bearer Token
- **Query Params**:
  - `page`: Page index (default: `1`)
  - `limit`: Records per page (default: `10`)
  - `date`: Filter by exact date (`YYYY-MM-DD`)
  - `metric`: Filter by populated metric (`glucose`, `bp`, `steps`, `sleep`, `medication`)
- **Response (200 OK)**:
```json
{
  "data": [...],
  "pagination": {
    "total": 14,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

### 3.3 Update Single Health Record
- **Method**: `PUT`
- **Path**: `/api/health-logs/:id`
- **Auth**: Bearer Token
- **Request Body**: Modified metrics (`glucose`, `bpSystolic`, `bpDiastolic`, `steps`, `sleepHours`, `notes`).
- **Response (200 OK)**: Returns updated log record.

### 3.4 Delete Single Health Record
- **Method**: `DELETE`
- **Path**: `/api/health-logs/:id`
- **Auth**: Bearer Token
- **Response (200 OK)**: `{ "message": "Log entry deleted successfully." }`

---

## 4. Dashboard & Health Score (`/api/dashboard`)

### 4.1 Get Dashboard Summary & Consistency Score
- **Method**: `GET`
- **Path**: `/api/dashboard` or `/api/dashboard/summary`
- **Auth**: Bearer Token
- **Response (200 OK)**:
```json
{
  "latestGlucose": { "value": 112, "status": "Normal" },
  "latestBP": { "systolic": 120, "diastolic": 78, "status": "Normal" },
  "todaySteps": 8400,
  "sleepDuration": 7.4,
  "weeklyHealthScore": { "score": 74 },
  "healthConsistencyScore": {
    "score": 74,
    "maxScore": 100,
    "displayText": "Health consistency score: 74/100",
    "disclaimer": "Prototype wellness consistency score—not a clinical score.",
    "components": {
      "activity": 80,
      "sleep": 65,
      "medication": 90,
      "glucoseConsistency": 70,
      "bpConsistency": 85,
      "foodAndAlcohol": 75
    }
  }
}
```

---

## 5. Analytics & Trends (`/api/trends`)

### 5.1 Get Multi-Metric Time Series
- **Method**: `GET`
- **Path**: `/api/trends`
- **Auth**: Bearer Token
- **Query Params**: `days` (`7` or `30`, default: `7`)
- **Response (200 OK)**:
```json
{
  "days": 7,
  "timeSeries": [
    {
      "date": "2026-10-12",
      "glucose": 115,
      "bpSystolic": 122,
      "bpDiastolic": 78,
      "steps": 8100,
      "sleepHours": 7.0,
      "adherence": 100
    }
  ],
  "stats": {
    "avgGlucose": 118.4,
    "avgSystolic": 122,
    "avgDiastolic": 78,
    "avgSteps": 8200,
    "avgSleep": 7.2,
    "adherenceRate": 92,
    "totalEntries": 7
  }
}
```

---

## 6. Rule-Based Insights Engine (`/api/insights`)

### 6.1 Get Observational Insights
- **Method**: `GET`
- **Path**: `/api/insights`
- **Auth**: Bearer Token
- **Response (200 OK)**:
```json
{
  "insights": [
    {
      "id": "low_sleep_elevated_glucose",
      "type": "correlation",
      "title": "Low Sleep & Glucose Patterns",
      "message": "Based on your last 14 records, your glucose was higher on days with less than six hours of sleep.",
      "basis": "Based on your last 14 records, days with under 6 hours of sleep were associated with an average fasting glucose of 142 mg/dL compared to 112 mg/dL on days with over 7 hours of sleep.",
      "severity": "medium",
      "disclaimer": "Associative pattern observation—not a clinical diagnosis."
    }
  ],
  "recordsAnalyzed": 14
}
```

---

## 7. Digital Twin State (`/api/digital-twin`)

### 7.1 Get Digital Twin Representation
- **Method**: `GET`
- **Path**: `/api/digital-twin`
- **Auth**: Bearer Token
- **Response (200 OK)**:
```json
{
  "twinTitle": "Your MediTwin",
  "healthState": {
    "glucoseTrend": "stable",
    "bloodPressureTrend": "stable",
    "activityLevel": "moderate",
    "sleepPattern": "irregular",
    "medicationAdherence": 90,
    "dataCompleteness": 86
  },
  "treeRepresentation": "Your MediTwin\n├── Current glucose trend\n├── Current BP trend\n├── Activity pattern\n├── Sleep pattern\n├── Medication adherence\n├── Positive behaviors\n├── Areas needing attention\n└── Last updated time",
  "positiveBehaviors": [
    "Consistent post-dinner physical activity (averaging >8,000 steps daily)",
    "Consistent morning medication adherence (90% adherence rate)"
  ],
  "areasNeedingAttention": [
    "Irregular sleep duration with bedtime variance exceeding 90 minutes",
    "Higher glucose observed following evening meals logged after 8:30 PM"
  ],
  "lastUpdatedTime": "2026-10-13T00:00:00.000Z"
}
```

---

## 8. Lifestyle Simulator (`/api/simulations`)

### 8.1 List Saved Simulations
- **Method**: `GET`
- **Path**: `/api/simulations`
- **Auth**: Bearer Token
- **Response (200 OK)**: Array of saved scenario objects.

### 8.2 Save Simulation Run
- **Method**: `POST`
- **Path**: `/api/simulations`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "name": "Add 2,000 steps daily",
  "description": "Simulating +2,000 steps daily over baseline activity.",
  "changes": {
    "scenarioId": "add_2000_steps",
    "stepDelta": 2000
  },
  "result": {
    "currentPattern": "Current average steps: 4,200/day",
    "simulatedPattern": "Simulated steps: 6,200/day",
    "estimatedResult": "likely improvement in activity consistency",
    "confidence": "low"
  }
}
```
- **Response (201 Created)**: Returns saved scenario record.
- **Safety Enforcement**: Any payload mentioning medication or insulin triggers:
```json
{
  "error": "PROHIBITED_MEDICATION_SIMULATION",
  "message": "Do not simulate insulin or medication changes. MediTwin models only non-pharmacological lifestyle habits."
}
```

---

## 9. Privacy, Consent & Governance (`/api/privacy`)

### 9.1 Get Consent Preferences
- **Method**: `GET`
- **Path**: `/api/privacy/consent`
- **Auth**: Bearer Token
- **Response (200 OK)**:
```json
{
  "termsAndPrivacy": true,
  "researchConsent": true,
  "researchGrantedAt": "2026-10-13T00:00:00.000Z",
  "version": "1.0"
}
```

### 9.2 Update Research Consent
- **Method**: `POST`
- **Path**: `/api/privacy/consent`
- **Auth**: Bearer Token
- **Request Body**: `{ "researchConsent": true }`
- **Response (200 OK)**: `{ "message": "Research-use consent granted.", "researchConsent": true }`

### 9.3 Export Personal Health Data
- **Method**: `GET`
- **Path**: `/api/privacy/export`
- **Auth**: Bearer Token
- **Response (200 OK)**: Complete JSON bundle with header `Content-Disposition: attachment; filename="meditwin_health_export_<date>.json"`.

### 9.4 Logout From All Sessions
- **Method**: `POST`
- **Path**: `/api/privacy/logout-all`
- **Auth**: Bearer Token
- **Response (200 OK)**: `{ "message": "Successfully logged out from all sessions across all devices." }`

### 9.5 Delete Account & Cascade Wipe
- **Method**: `DELETE`
- **Path**: `/api/privacy/account`
- **Auth**: Bearer Token
- **Request Body**: `{ "confirmationText": "DELETE" }`
- **Response (200 OK)**: `{ "message": "Account and all associated personal health records have been permanently deleted." }`

### 9.6 View Security Audit Trail
- **Method**: `GET`
- **Path**: `/api/privacy/audit-logs`
- **Auth**: Bearer Token
- **Response (200 OK)**: Sanitized security audit events (strictly non-PHI).

---

## 10. Administrator Console (`/api/admin`)

- `GET /api/admin/stats` (Requires `admin` role) — Returns total registered users, daily log counts, simulation counts, and audit logs.
- `GET /api/admin/audit-logs` (Requires `admin` role) — Returns system-wide audit telemetry with pagination.
