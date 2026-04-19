import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import PatientDashboard from './pages/patient/PatientDashboard'
import SymptomPage from './pages/patient/SymptomPage'
import ImageUploadPage from './pages/patient/ImageUploadPage'
import AppointmentsPage from './pages/patient/AppointmentsPage'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import ConsultationsPage from './pages/doctor/ConsultationsPage'
import Layout from './components/layout/Layout'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"         element={<Navigate to="/login" replace />} />

        {/* Patient routes */}
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

        {/* Doctor routes */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index                   element={<DoctorDashboard />} />
          <Route path="consultations"    element={<ConsultationsPage />} />
          <Route path="appointments"     element={<AppointmentsPage />} />
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
