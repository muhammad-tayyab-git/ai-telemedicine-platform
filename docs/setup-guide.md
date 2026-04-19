# Local Development Setup Guide

## Prerequisites

Install these tools before starting:

| Tool | Version | Download |
|---|---|---|
| Java JDK | 17+ | https://adoptium.net |
| Maven | 3.9+ | https://maven.apache.org |
| Node.js | 20+ | https://nodejs.org |
| Python | 3.11+ | https://python.org |
| Docker Desktop | Latest | https://docker.com |
| Git | Any | https://git-scm.com |
| IntelliJ IDEA | Community | https://jetbrains.com/idea |

---

## Option A — Run everything with Docker (recommended for demo)

```bash
# 1. Clone
git clone https://github.com/muhammad-tayyab-git/ai-telemedicine-platform.git
cd ai-telemedicine-platform

# 2. Environment setup
cp .env.example .env
# Open .env and set your passwords and JWT secret

# 3. Start all services
docker-compose up --build

# 4. Access
# Frontend:    http://localhost:3000
# Backend API: http://localhost:8080
# Swagger UI:  http://localhost:8080/swagger-ui.html
# Symptom AI:  http://localhost:8001/docs
# Image AI:    http://localhost:8002/docs
```

---

## Option B — Run services individually (recommended for development)

### Step 1 — Start databases

```bash
docker-compose up postgres mongodb -d
```

### Step 2 — Backend (Spring Boot)

```bash
cd backend

# Copy env values into a local properties file OR export them:
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=telemedicine_db
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export JWT_SECRET=your_32_char_minimum_secret_key_here
export SYMPTOM_SERVICE_URL=http://localhost:8001
export IMAGE_SERVICE_URL=http://localhost:8002

mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### Step 3 — AI Symptom Service

```bash
cd ai-symptom-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
# Service runs on http://localhost:8001
# Interactive docs: http://localhost:8001/docs
```

### Step 4 — AI Image Service

```bash
cd ai-image-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
# Service runs on http://localhost:8002
# Interactive docs: http://localhost:8002/docs
```

### Step 5 — Frontend (React)

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Running Tests

```bash
# Backend unit tests
cd backend && mvn test

# Symptom service tests
cd ai-symptom-service && pytest tests/ -v

# Image service tests
cd ai-image-service && pytest tests/ -v
```

---

## Default Test Accounts

After the backend starts, register accounts via Swagger UI or the frontend register page:

- Go to http://localhost:3000/register
- Create a **Patient** account
- Create a **Doctor** account
- Login and explore both dashboards

---

## Git Workflow

```bash
# Always work on develop or a feature branch
git checkout develop
git checkout -b feature/your-feature-name

# After coding
git add .
git commit -m "feat: describe what you built"
git push origin feature/your-feature-name

# Create a Pull Request on GitHub to merge into develop
# Only merge develop → main when a feature is fully complete
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Port 5432 already in use | Stop local PostgreSQL: `sudo service postgresql stop` |
| Port 8080 already in use | Kill process: `lsof -ti:8080 \| xargs kill` |
| Maven build fails | Check Java 17 is active: `java -version` |
| Python import errors | Make sure venv is activated |
| Docker build slow | First build downloads images — subsequent builds use cache |
