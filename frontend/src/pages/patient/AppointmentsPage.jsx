import { useQuery } from '@tanstack/react-query'
import { appointmentApi } from '../../api/services'
import { Calendar, Clock } from 'lucide-react'

const statusColors = {
  SCHEDULED:    'bg-blue-50 text-blue-700',
  CONFIRMED:    'bg-green-50 text-green-700',
  COMPLETED:    'bg-gray-100 text-gray-600',
  CANCELLED:    'bg-red-50 text-red-600',
  IN_PROGRESS:  'bg-yellow-50 text-yellow-700',
}

export default function AppointmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentApi.getAll().then(r => r.data.data),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Appointments</h2>
          <p className="text-gray-500 mt-1 text-sm">Your scheduled consultations</p>
        </div>
      </div>

      {isLoading && <p className="text-gray-400 text-sm">Loading appointments...</p>}

      {!isLoading && (!data || data.length === 0) && (
        <div className="card text-center py-12">
          <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No appointments yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {data?.map((apt) => (
          <div key={apt.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <Clock size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Dr. {apt.doctorName || 'Doctor'}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(apt.scheduledAt).toLocaleString()}
                </p>
                {apt.notes && <p className="text-xs text-gray-400 mt-0.5">{apt.notes}</p>}
              </div>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[apt.status] || 'bg-gray-100 text-gray-600'}`}>
              {apt.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
