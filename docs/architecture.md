# Architecture Overview

## System Design

The platform follows a **microservices architecture** with four independently deployable services
communicating over REST APIs, all orchestrated with Docker Compose.

## Services

### 1. React Frontend (port 3000)
- Built with Vite + React 18 + TailwindCSS
- State management: Zustand (auth), React Query (server state)
- Communicates exclusively with the Spring Boot backend — never directly with AI services
- Role-based routing: patients and doctors see different dashboards

### 2. Spring Boot Backend (port 8080)
- Acts as the **central gateway** for all business logic
- Handles authentication (JWT), authorisation (RBAC), patient records, appointments
- Calls AI microservices internally and stores results in PostgreSQL
- Exposes Swagger UI at `/swagger-ui.html`

### 3. AI Symptom Triage Service (port 8001)
- Python / FastAPI microservice
- Phase 1: Rule-based keyword classifier (immediate, testable)
- Phase 4: Fine-tuned ClinicalBERT (`medicalai/ClinicalBERT`) on Symptom2Disease dataset
- Endpoint: `POST /predict` → `{ predicted_condition, severity_level, confidence_score, recommendation }`

### 4. AI Image Screening Service (port 8002)
- Python / FastAPI microservice
- Phase 1: Placeholder responses (service starts immediately)
- Phase 4: Fine-tuned ResNet-50 on NIH ChestX-ray14 dataset
- Endpoint: `POST /analyze` (multipart image) → `{ finding, confidence_score, requires_urgent_review }`

## Databases

| Database | Purpose |
|---|---|
| PostgreSQL 15 | Structured data: users, patients, appointments, symptom reports, image results |
| MongoDB 7 | Unstructured / log data: audit logs, AI prediction history, health monitoring events |

## Security

- All external traffic over HTTPS (production)
- JWT tokens with configurable expiry (default 24h)
- Role-based access control: `PATIENT`, `DOCTOR`, `ADMIN`
- Passwords hashed with BCrypt
- AI services on internal Docker network — not exposed publicly
- Encrypted fields for sensitive patient data

## Data Flow — Symptom Triage

```
Patient submits symptoms
    → POST /api/symptoms/analyze  (Backend)
    → Backend calls POST /predict  (Symptom AI Service)
    → AI returns prediction JSON
    → Backend saves SymptomReport to PostgreSQL
    → Backend returns result to Frontend
    → Frontend displays triage result to patient
```

## Data Flow — Image Screening

```
Patient uploads image
    → POST /api/images/analyze  (Backend, multipart)
    → Backend calls POST /analyze  (Image AI Service)
    → AI returns finding JSON
    → Backend saves ImageAnalysisResult to PostgreSQL
    → Backend returns result to Frontend
    → Frontend displays finding to patient
```
