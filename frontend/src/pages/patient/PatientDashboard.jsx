import { useAuthStore } from '../../store/authStore'
import { Link } from 'react-router-dom'
import { Activity, ImagePlus, Calendar, ArrowRight } from 'lucide-react'

const quickActions = [
  {
    to: '/patient/symptoms',
    icon: Activity,
    title: 'Symptom Check',
    description: 'Describe your symptoms and get an AI-powered triage assessment.',
    color: 'bg-primary-50 text-primary-800',
  },
  {
    to: '/patient/images',
    icon: ImagePlus,
    title: 'Image Screening',
    description: 'Upload a medical image (X-ray, MRI) for AI-assisted analysis.',
    color: 'bg-success-50 text-success-600',
  },
  {
    to: '/patient/appointments',
    icon: Calendar,
    title: 'Appointments',
    description: 'Book, view, or manage your consultations with doctors.',
    color: 'bg-warning-50 text-warning-600',
  },
]

export default function PatientDashboard() {
  const { user } = useAuthStore()

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Good day, {user?.firstName}
        </h2>
        <p className="text-gray-500 mt-1">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quickActions.map(({ to, icon: Icon, title, description, color }) => (
          <Link key={to} to={to} className="card hover:shadow-md transition-shadow group">
            <div className={`inline-flex p-2.5 rounded-lg ${color} mb-4`}>
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
            <div className="flex items-center text-sm text-primary-600 font-medium group-hover:gap-2 transition-all">
              Get started <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 card bg-primary-50 border-primary-100">
        <h3 className="font-medium text-primary-800 mb-1">About this platform</h3>
        <p className="text-sm text-primary-600 leading-relaxed">
          This AI-enhanced telemedicine platform uses natural language processing for symptom triage
          and deep learning for medical image screening. All AI results are advisory only —
          always consult a qualified doctor for medical decisions.
        </p>
      </div>
    </div>
  )
}
