# API Specification

Full interactive docs available at `http://localhost:8080/swagger-ui.html` when backend is running.

---

## Authentication

All endpoints except `/api/auth/**` require a Bearer token in the header:
```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### POST /api/auth/register
Register a new patient or doctor account.

**Request:**
```json
{
  "email": "tayyab@example.com",
  "password": "securepass123",
  "firstName": "Tayyab",
  "lastName": "Muhammad",
  "role": "PATIENT"
}
```
**Response 201:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGci...",
    "tokenType": "Bearer",
    "user": { "id": "uuid", "email": "...", "firstName": "Tayyab", "role": "PATIENT" }
  }
}
```

### POST /api/auth/login
```json
{ "email": "tayyab@example.com", "password": "securepass123" }
```

---

## Symptom Endpoints

### POST /api/symptoms/analyze
Analyse patient symptoms using the AI triage service.

**Request:**
```json
{ "symptoms": "I have had fever, sore throat, and body aches for 3 days" }
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "predictedCondition": "Influenza",
    "severityLevel": "MEDIUM",
    "confidenceScore": 0.84,
    "recommendation": "Schedule an appointment within the next few days.",
    "alternativeConditions": ["Common Cold", "COVID-19"]
  }
}
```

### GET /api/symptoms/{patientId}
Get all symptom reports for a patient (Doctor/Admin only).

---

## Image Endpoints

### POST /api/images/analyze
Upload a medical image for AI screening.

**Request:** `multipart/form-data` with field `file` (JPG/PNG, max 10MB)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "finding": "Pneumonia (suspected)",
    "confidenceScore": 0.79,
    "imageType": "XRAY",
    "recommendation": "Urgent radiologist review recommended.",
    "requiresUrgentReview": true
  }
}
```

---

## Appointment Endpoints

### GET /api/appointments
Get all appointments for the authenticated user.

### POST /api/appointments
Book a new appointment.
```json
{
  "doctorId": "uuid",
  "scheduledAt": "2025-06-15T10:00:00",
  "type": "TELECONSULTATION",
  "notes": "Follow-up for symptom report"
}
```

### PATCH /api/appointments/{id}/cancel
Cancel an appointment.

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2025-04-19T10:00:00"
}
```

| Status | Meaning |
|---|---|
| 400 | Validation error — check `data` field for field-level errors |
| 401 | Missing or invalid JWT token |
| 403 | Insufficient role permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already registered) |
| 500 | Internal server error |
