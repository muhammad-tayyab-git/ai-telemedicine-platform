# Database Schema

## PostgreSQL Tables

### users
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Auto-generated |
| email | VARCHAR UNIQUE | Login identifier |
| password | VARCHAR | BCrypt hashed |
| first_name | VARCHAR | |
| last_name | VARCHAR | |
| role | ENUM | PATIENT, DOCTOR, ADMIN |
| enabled | BOOLEAN | Default true |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

### patients
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → users | One-to-one |
| date_of_birth | DATE | |
| gender | VARCHAR | |
| phone_number | VARCHAR | |
| address | TEXT | |
| medical_history | TEXT | |
| allergies | TEXT | |
| current_medications | TEXT | |
| blood_type | VARCHAR | |
| created_at | TIMESTAMP | |

### symptom_reports
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| patient_id | UUID FK → patients | |
| symptoms_text | TEXT | Raw patient input |
| predicted_condition | VARCHAR | From AI service |
| severity_level | ENUM | LOW, MEDIUM, HIGH, CRITICAL |
| confidence_score | DOUBLE | 0.0 – 1.0 |
| ai_recommendation | TEXT | |
| status | ENUM | PENDING, PROCESSED, REVIEWED |
| created_at | TIMESTAMP | |

### appointments
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| patient_id | UUID FK → patients | |
| doctor_id | UUID FK → users | Must have DOCTOR role |
| scheduled_at | TIMESTAMP | |
| status | ENUM | SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED |
| type | ENUM | TELECONSULTATION, IN_PERSON, FOLLOW_UP |
| notes | TEXT | Patient notes |
| doctor_notes | TEXT | Doctor notes after consultation |
| created_at | TIMESTAMP | |

## MongoDB Collections

### ai_prediction_logs
Stores every AI prediction for audit and model improvement.
```json
{
  "_id": "ObjectId",
  "type": "SYMPTOM | IMAGE",
  "patientId": "uuid",
  "input": "raw symptoms text or image filename",
  "output": { "predicted_condition": "...", "severity_level": "...", "confidence_score": 0.87 },
  "modelVersion": "clinicalbert-v1",
  "createdAt": "ISODate"
}
```

### health_monitoring_events
Tracks patient health trends over time.
```json
{
  "_id": "ObjectId",
  "patientId": "uuid",
  "eventType": "SYMPTOM_REPORT | IMAGE_UPLOAD | APPOINTMENT",
  "riskLevel": "LOW | MEDIUM | HIGH",
  "metadata": {},
  "createdAt": "ISODate"
}
```
