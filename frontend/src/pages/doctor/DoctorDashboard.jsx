import { useAuthStore } from '../../store/authStore'
import { Link } from 'react-router-dom'
import { Stethoscope, Calendar, ArrowRight } from 'lucide-react'

const quickActions = [
  { to: '/doctor/consultations', icon: Stethoscope, title: 'Consultations', description: 'Review patient symptom reports and AI triage results.', color: 'bg-primary-50 text-primary-800' },
  { to: '/doctor/appointments',  icon: Calendar,    title: 'Appointments',  description: 'View and manage your scheduled patient appointments.',   color: 'bg-success-50 text-success-600' },
]

export default function DoctorDashboard() {
  const { user } = useAuthStore()
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome, Dr. {user?.lastName}</h2>
        <p className="text-gray-500 mt-1">Manage your patients and consultations.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quickActions.map(({ to, icon: Icon, title, description, color }) => (
          <Link key={to} to={to} className="card hover:shadow-md transition-shadow group">
            <div className={`inline-flex p-2.5 rounded-lg ${color} mb-4`}><Icon size={20} /></div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
            <div className="flex items-center text-sm text-primary-600 font-medium">Open <ArrowRight size={14} className="ml-1" /></div>
          </Link>
        ))}
      </div>
    </div>
  )
}
