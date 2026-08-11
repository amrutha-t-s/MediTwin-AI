# MediTwin – Health Digital Twin (MVP)

MediTwin is a **digital twin for personal health**. It helps users track daily health metrics and visualize trends, with future plans to simulate how current habits may affect long-term health.

> **MediTwin is a health-monitoring and educational prototype. It does not diagnose diseases, replace a doctor, or recommend changing medication.**

## Repository Structure

- `docs/` – Requirements, architecture, and proposal-related documents.
- `backend/` – Node.js + Express API.
- `frontend/` – React + Vite + Tailwind UI.

## MVP Goals

- User authentication (signup, login, logout).
- Health profile management.
- Daily logging of:
  - Glucose, blood pressure, food, sleep, steps, medication, lifestyle.
- Dashboard with charts and trends.
- Simple, rule-based insights.
- Basic lifestyle scenario tester (“what-if” simulations).

## Running Locally (Development)

### Backend

```bash
cd backend
npm install
node server.js
```

API will run on `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI will run on `http://localhost:5173` (or similar).

## Business Proposal Context

MediTwin targets:

- Individuals managing diabetes, hypertension, or general wellness.
- Clinics and wellness programs that want a simple digital twin tool for patients.
- Future integration with wearables (Fitbit), CGMs, and BP devices.

This MVP proves the core concept: **reliable manual data entry + dashboard + basic insights**, before adding hardware and ML.
