# AI-Enhanced Telemedicine Platform

> Bachelor's Thesis — Óbuda University  
> Author: **Tayyab Muhammad**  
> Supervisor: Dr. Major Sándor Roland

A full-stack telemedicine platform integrating AI-powered symptom triage, medical image screening, and patient data management.

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│           React Frontend  (port 3000)           │
└────────────────────┬────────────────────────────┘
                     │ REST / HTTPS
┌────────────────────▼────────────────────────────┐
│        Spring Boot Backend  (port 8080)         │
│  Auth · Patient Records · Appointments · RBAC   │
└───────┬──────────────────────────┬──────────────┘
        │ REST                     │ REST
┌───────▼────────┐      ┌──────────▼──────────┐
│ Symptom Triage │      │  Image Screening    │
│ Python/FastAPI │      │  Python/FastAPI     │
│   (port 8001)  │      │    (port 8002)      │
│ BERT/ClinBERT  │      │  ResNet/EfficientNet│
└────────────────┘      └─────────────────────┘
        │                          │
┌───────▼──────────────────────────▼──────────────┐
│  PostgreSQL (structured)  +  MongoDB (logs)     │
└─────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, React Query, Zustand |
| Backend | Java 17, Spring Boot 3, Spring Security, JPA |
| AI Service 1 | Python 3.11, FastAPI, HuggingFace Transformers, ClinicalBERT |
| AI Service 2 | Python 3.11, FastAPI, PyTorch, ResNet / EfficientNet |
| Database | PostgreSQL 15 + MongoDB 7 |
| DevOps | Docker, Docker Compose, GitHub Actions CI |

## Project Structure

```
ai-telemedicine-platform/
├── frontend/               # React + Vite application
├── backend/                # Spring Boot REST API
├── ai-symptom-service/     # NLP symptom triage microservice
├── ai-image-service/       # CNN medical image screening microservice
├── docs/                   # Architecture docs, API spec, DB schema
├── docker-compose.yml      # Run all services with one command
└── .env.example            # Environment variable template
```

## Getting Started

### Prerequisites
- Docker Desktop installed and running
- Git

### Run the full platform

```bash
# 1. Clone the repository
git clone https://github.com/muhammad-tayyab-git/ai-telemedicine-platform.git
cd ai-telemedicine-platform

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start all services
docker-compose up --build

# 4. Access the app
# Frontend:   http://localhost:3000
# Backend:    http://localhost:8080
# API Docs:   http://localhost:8080/swagger-ui.html
# Symptom AI: http://localhost:8001/docs
# Image AI:   http://localhost:8002/docs
```

### Run services individually (development)

```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm install && npm run dev

# Symptom AI service
cd ai-symptom-service && pip install -r requirements.txt && uvicorn main:app --reload --port 8001

# Image AI service
cd ai-image-service && pip install -r requirements.txt && uvicorn main:app --reload --port 8002
```

## Development Branches

| Branch | Purpose |
|---|---|
| `main` | Stable, supervisor-reviewed code |
| `develop` | Active development |
| `feature/*` | Individual feature branches |

## License

Academic use only — Debrecen University thesis project.
