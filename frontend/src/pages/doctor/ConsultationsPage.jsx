import { Stethoscope } from 'lucide-react'
export default function ConsultationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Consultations</h2>
        <p className="text-gray-500 mt-1 text-sm">Review AI-triaged patient symptom reports.</p>
      </div>
      <div className="card text-center py-12">
        <Stethoscope size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No pending consultations.</p>
        <p className="text-gray-400 text-xs mt-1">Patient reports will appear here once submitted.</p>
      </div>
    </div>
  )
}
