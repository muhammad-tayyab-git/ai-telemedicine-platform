import api from './axiosInstance'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

// ─── Symptoms ─────────────────────────────────────────────────────────────────
export const symptomApi = {
  analyze:      (data) => api.post('/symptoms/analyze', data),
  getMyReports: ()     => api.get('/symptoms/my-reports'),
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
}

// ─── Doctors ──────────────────────────────────────────────────────────────────
export const doctorApi = {
  getAll: () => api.get('/doctors'),
}
