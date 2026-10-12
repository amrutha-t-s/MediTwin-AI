# MediTwin AI — Database Schema Specification

## 1. Entity-Relationship Diagram (ERD)

The database schema is modeled in PostgreSQL and managed through Prisma ORM v7. It establishes cascading relational integrity and strict user-level data segregation.

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
        string resetToken
        datetime resetTokenExpire
        datetime createdAt
        datetime updatedAt
    }

    HealthProfile {
        uuid id PK
        uuid userId FK, UK
        int age
        string sex
        string gender
        datetime dateOfBirth
        float heightCm
        float weightKg
        string bloodGroup
        string location
        string diabetesStatus
        string diabetesType
        int diagnosisYear
        float fastingGlucose
        float hba1c
        string bloodPressureHistory
        string cholesterol
        string kidneyHistory
        string heartHistory
        string otherConditions
        string allergies
        string familyHistory
        float typicalSleep
        string typicalActivity
        string foodPreference
        string smoking
        string alcohol
        datetime createdAt
        datetime updatedAt
    }

    DailyHealthLog {
        uuid id PK
        uuid userId FK
        datetime date "Index"
        float glucose "mg/dL"
        int bpSystolic "mmHg"
        int bpDiastolic "mmHg"
        int heartRate "bpm"
        float weightKg
        float waistCircumference
        float sleepHours
        float sleepDuration
        int sleepQuality "1-5 scale"
        int nightAwakenings
        string sleepStartTime
        string wakeUpTime
        int steps
        int exerciseMinutes
        string exerciseType
        float sittingHours
        float waterLiters
        string foodSummary
        json foodDetails
        boolean hasSugaryDrink
        boolean hasFriedFood
        boolean isHighCarb
        boolean hasVegetables
        int mealSatisfaction "1-5 scale"
        string medicationName
        string medicationDosage
        string medicationFrequency
        string medicationTaken "Taken | Missed"
        string missedReason
        string alcohol
        string smoking
        int stressLevel "1-5 scale"
        int energyLevel "1-5 scale"
        string symptoms
        string notes
        datetime createdAt
        datetime updatedAt
    }

    Medication {
        uuid id PK
        uuid userId FK
        string name
        string dosage
        string frequency
        datetime startDate
        datetime endDate
        string instructions
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    ScenarioSimulation {
        uuid id PK
        uuid userId FK
        string name
        string description
        json changes "Non-pharmacological inputs"
        json result "Heuristic projection"
        datetime createdAt
    }

    FamilyHistory {
        uuid id PK
        uuid userId FK
        string relation
        string condition
        string notes
        datetime createdAt
    }

    Prediction {
        uuid id PK
        uuid userId FK
        string predictionType
        string result
        float confidence
        string explanation
        datetime createdAt
    }

    Consent {
        uuid id PK
        uuid userId FK
        string consentType "terms_and_privacy | research_use"
        boolean granted
        string version
        datetime grantedAt
        datetime revokedAt
        datetime createdAt
        datetime updatedAt
    }

    AuditLog {
        uuid id PK
        uuid userId FK "Nullable for unlinked"
        string action "LOGIN | LOGOUT_ALL | EXPORT"
        string entity "User | Consent | HealthLog"
        string entityId
        string ipAddress
        string userAgent
        json details "Strictly non-PHI metadata"
        datetime createdAt "Index"
    }
```

---

## 2. Table Specifications & Cardinality

### 2.1 `User`
- **Primary Key**: `id` (UUID v4)
- **Unique Fields**: `email` (lowercased and normalized)
- **Security Attributes**: `passwordHash` (bcrypt 12 salt rounds). Never exposed in API responses.
- **Role Field**: `role` (`patient`, `doctor`, `admin`, default: `patient`).
- **Deletion Cascade**: Owns relations with `onDelete: Cascade`. Deleting a user irrevocably purges all associated biometrics, logs, simulations, and consents.

### 2.2 `HealthProfile`
- **Cardinality**: `1:1` with `User` (`userId` marked `@unique`).
- **Purpose**: Stores baseline demographic and clinical context (Type 2 diabetes diagnosis year, baseline HbA1c, typical sleep, baseline activity).

### 2.3 `DailyHealthLog`
- **Cardinality**: `1:N` with `User`.
- **Indices**:
  - `@@index([userId])` for rapid per-patient metric lookups.
  - `@@index([date])` for chronological window queries across 7, 14, and 30-day intervals.
- **Data Protection**: Clinical biometrics are isolated to this table and never copied into security audit trails.

### 2.4 `Medication`
- **Cardinality**: `1:N` with `User`.
- **Purpose**: Tracks active medication schedules and dosages.
- **Safety Boundary**: Read-only in simulations; medication parameters cannot be altered by simulator projections.

### 2.5 `ScenarioSimulation`
- **Cardinality**: `1:N` with `User`.
- **Purpose**: Persists lifestyle what-if evaluations (+2,000 steps daily, +1h sleep, 7 alcohol-free days).
- **Structure**: Stores `changes` and `result` payloads containing current pattern vs. simulated pattern and transparent confidence ratings (`Confidence: low`).

### 2.6 `Consent`
- **Cardinality**: `1:N` with `User`.
- **Types**:
  - `terms_and_privacy`: Mandatory terms acceptance at account registration.
  - `research_use`: Optional de-identified aggregate research participation (revocable anytime).

### 2.7 `AuditLog`
- **Indices**: `@@index([userId])`, `@@index([createdAt])`.
- **Privacy Rule**: Strictly sanitizes the `details` JSON field to prevent storing glucose, blood pressure, medications, dosages, or food entries.
