# Thesis Notes

**Title:** AI-Enhanced Telemedicine Platform for Symptom Triage, Medical Image Screening, and Patient Data Management  
**Author:** Tayyab Muhammad  
**Supervisor:** Dr. Major Sándor Roland  
**University:** Óbuda University

---

## Suggested Chapter Structure

1. **Introduction** — Problem statement, telemedicine context, thesis objectives
2. **Literature Review** — Telemedicine systems, NLP in healthcare, CNN-based medical imaging, Spring Boot + React in production
3. **System Design** — Architecture decisions, technology selection rationale, ER diagram, API design
4. **Implementation** — Backend (Spring Boot), AI services (ClinicalBERT, ResNet), Frontend (React), Security
5. **Testing & Evaluation** — Unit tests, integration tests, AI model accuracy metrics (precision, recall, F1)
6. **Conclusion** — Summary, limitations, future work

---

## Key Datasets

| Dataset | Use | Link |
|---|---|---|
| Symptom2Disease (Kaggle) | ClinicalBERT fine-tuning | https://kaggle.com/datasets/niyarrbarman/symptom2disease |
| NIH ChestX-ray14 | ResNet fine-tuning | https://nihcc.cs.nih.gov/releases/ChestX-ray8 |
| MedNLI | NLP evaluation | https://physionet.org/content/mednli |

---

## AI Models

### Symptom Triage
- Base model: `medicalai/ClinicalBERT` (HuggingFace)
- Fine-tune on Symptom2Disease dataset
- Output: condition label + severity (LOW/MEDIUM/HIGH/CRITICAL) + confidence

### Image Screening
- Base model: ResNet-50 pretrained on ImageNet (`torchvision.models.resnet50`)
- Fine-tune on NIH ChestX-ray14 (14-class multi-label classification)
- Output: finding label + confidence + urgent flag

---

## Development Phases

| Phase | Weeks | Status |
|---|---|---|
| Phase 1 — Project setup & repo scaffold | 1–2 | ✅ Complete |
| Phase 2 — Database schema design | 2–3 | ⬜ Next |
| Phase 3 — Spring Boot backend (auth, patients, appointments) | 3–7 | ⬜ Pending |
| Phase 4 — Python AI microservices (NLP + CNN) | 5–10 | ⬜ Pending |
| Phase 5 — React frontend (all pages) | 7–11 | ⬜ Pending |
| Phase 6 — Integration & testing | 10–13 | ⬜ Pending |
| Phase 7 — Thesis writing | 12–16 | ⬜ Pending |

---

## Useful Commands (Quick Reference)

```bash
# Start everything
docker-compose up --build

# Run backend tests
cd backend && mvn test

# Run AI service tests
cd ai-symptom-service && pytest tests/ -v
cd ai-image-service   && pytest tests/ -v

# Format check frontend
cd frontend && npm run lint

# Create new feature branch
git checkout develop
git checkout -b feature/your-feature-name
```
