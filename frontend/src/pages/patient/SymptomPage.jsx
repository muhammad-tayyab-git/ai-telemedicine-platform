import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { symptomApi } from '../../api/services'
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react'

const severityBadge = {
  LOW:      { class: 'badge-low',      label: 'Low severity' },
  MEDIUM:   { class: 'badge-medium',   label: 'Medium severity' },
  HIGH:     { class: 'badge-high',     label: 'High severity' },
  CRITICAL: { class: 'badge-critical', label: 'Critical — seek urgent care' },
}

export default function SymptomPage() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = async ({ symptoms }) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await symptomApi.analyze({ symptoms })
      setResult(res.data.data)
      toast.success('Analysis complete')
    } catch {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Symptom Check</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Describe your symptoms in natural language and receive an AI triage assessment.
        </p>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe your symptoms
            </label>
            <textarea
              rows={5}
              className="input-field resize-none"
              placeholder="e.g. I have had a persistent headache, fever of 38.5°C, sore throat, and body aches for the past 3 days..."
              {...register('symptoms', {
                required: 'Please describe your symptoms',
                minLength: { value: 10, message: 'Please provide more detail (at least 10 characters)' },
              })}
            />
            {errors.symptoms && (
              <p className="text-red-500 text-xs mt-1">{errors.symptoms.message}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Analysing...' : 'Analyse symptoms'}
            </button>
            <button type="button" onClick={() => { reset(); setResult(null) }} className="btn-secondary">
              Clear
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="card border-l-4 border-l-primary-400">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-primary-600" />
              <h3 className="font-semibold text-gray-900">AI Triage Result</h3>
            </div>
            <span className={severityBadge[result.severityLevel]?.class || 'badge-medium'}>
              {severityBadge[result.severityLevel]?.label || result.severityLevel}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Predicted condition</p>
              <p className="font-medium text-gray-900 mt-0.5">{result.predictedCondition}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Confidence</p>
              <p className="text-gray-700 mt-0.5">{(result.confidenceScore * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Recommendation</p>
              <p className="text-gray-700 mt-0.5 leading-relaxed">{result.recommendation}</p>
            </div>
            {result.alternativeConditions?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Other possibilities</p>
                <p className="text-gray-600 mt-0.5 text-sm">{result.alternativeConditions.join(', ')}</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-400">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            This is an AI-generated assessment for guidance only. Always consult a qualified doctor.
          </div>
        </div>
      )}
    </div>
  )
}
