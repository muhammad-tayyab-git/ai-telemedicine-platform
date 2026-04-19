import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard, Activity, ImagePlus,
  Calendar, Stethoscope, LogOut, User
} from 'lucide-react'

const patientNav = [
  { to: '/patient',             label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/patient/symptoms',    label: 'Symptom Check', icon: Activity },
  { to: '/patient/images',      label: 'Image Upload',  icon: ImagePlus },
  { to: '/patient/appointments',label: 'Appointments',  icon: Calendar },
]

const doctorNav = [
  { to: '/doctor',                  label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/doctor/consultations',    label: 'Consultations',  icon: Stethoscope },
  { to: '/doctor/appointments',     label: 'Appointments',   icon: Calendar },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const nav = user?.role === 'DOCTOR' ? doctorNav : patientNav

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-primary-800">TeleMedicine</h1>
          <p className="text-xs text-gray-400 mt-0.5">AI-Enhanced Platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/patient' || to === '/doctor'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={16} className="text-primary-800" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
