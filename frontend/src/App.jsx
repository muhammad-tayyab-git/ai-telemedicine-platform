import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import PatientDashboard from './pages/patient/PatientDashboard'
import SymptomPage from './pages/patient/SymptomPage'
import ImageUploadPage from './pages/patient/ImageUploadPage'
import AppointmentsPage from './pages/patient/AppointmentsPage'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import ConsultationsPage from './pages/doctor/ConsultationsPage'
import Layout from './components/layout/Layout'

function getStoredAuth() {
  try {
    const raw = localStorage.getItem('telemedicine-auth')
    if (!raw) return { token: null, user: null }
    const parsed = JSON.parse(raw)
    return parsed.state || { token: null, user: null }
  } catch {
    return { token: null, user: null }
  }
}

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = getStoredAuth()
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"         element={<Navigate to="/login" replace />} />

        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index                element={<PatientDashboard />} />
          <Route path="symptoms"      element={<SymptomPage />} />
          <Route path="images"        element={<ImageUploadPage />} />
          <Route path="appointments"  element={<AppointmentsPage />} />
        </Route>

        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index                element={<DoctorDashboard />} />
          <Route path="consultations" element={<ConsultationsPage />} />
          <Route path="appointments"  element={<AppointmentsPage />} />
        </Route>

        <Route path="/unauthorized" element={
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">You are not authorised to view this page.</p>
          </div>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
