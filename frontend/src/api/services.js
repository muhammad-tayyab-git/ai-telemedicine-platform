import api from './axiosInstance'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

// ─── Symptoms ─────────────────────────────────────────────────────────────────
export const symptomApi = {
  // enriched analysis — accepts selectedSymptoms[], ageGroup, duration, severity etc.
  analyze:      (data) => api.post('/symptoms/analyze', data),
  getMyReports: ()     => api.get('/symptoms/my-reports'),
  // context: age-aware, weather-aware symptom list
  getContext:   (params) => api.get('/symptoms/context', { params }),
  // cascade: related symptoms for a primary symptom
  getCascade:   (symptom) => api.get('/symptoms/cascade', { params: { symptom } }),
}

// ─── Images ───────────────────────────────────────────────────────────────────
export const imageApi = {
  analyze: (formData) => api.post('/images/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export const appointmentApi = {
  getAll:  ()          => api.get('/appointments'),
  create:  (data)      => api.post('/appointments', data),
  update:  (id, data)  => api.put(`/appointments/${id}`, data),
  cancel:  (id)        => api.patch(`/appointments/${id}/cancel`),
}

// ─── Patients ─────────────────────────────────────────────────────────────────
export const patientApi = {
  getProfile:    ()     => api.get('/patients/me'),
  updateProfile: (data) => api.put('/patients/me', data),
  getDashboard:  ()     => api.get('/patients/dashboard'),
}

// ─── Doctors ──────────────────────────────────────────────────────────────────
export const doctorApi = {
  getAll: () => api.get('/doctors'),
}
