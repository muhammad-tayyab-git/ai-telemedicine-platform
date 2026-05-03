import { useState } from 'react'
import { Search, Filter, AlertTriangle, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'

const severityStyle = {
  LOW:      { bg: '#e1f5ee', color: '#085041' },
  MEDIUM:   { bg: '#faeeda', color: '#633806' },
  HIGH:     { bg: '#faece7', color: '#712b13' },
  CRITICAL: { bg: '#fcebeb', color: '#791f1f' },
}

const allReports = [
  { id: 'RPT001', patient: 'Ahmed Hassan', age: 34, gender: 'Male', symptoms: 'Chest pain and shortness of breath when walking, heart beating fast, feeling dizzy and lightheaded', condition: 'Cardiac / Respiratory Emergency', severity: 'CRITICAL', confidence: 91, recommendation: 'URGENT: Seek emergency medical care immediately or call emergency services.', time: '15 min ago', status: 'Pending' },
  { id: 'RPT002', patient: 'Sara Malik', age: 28, gender: 'Female', symptoms: 'Fever, persistent cough, loss of taste and smell for 3 days, body aches and fatigue', condition: 'COVID-19 (suspected)', severity: 'HIGH', confidence: 82, recommendation: 'Please consult a doctor as soon as possible, ideally within 24 hours.', time: '1 hr ago', status: 'Pending' },
  { id: 'RPT003', patient: 'Omar Farouq', age: 52, gender: 'Male', symptoms: 'Red swollen eyes, eye irritation, watering eyes, runny nose and mild fever for 2 days', condition: 'Allergic Conjunctivitis with Rhinitis', severity: 'MEDIUM', confidence: 80, recommendation: 'Schedule an appointment with your doctor within the next few days.', time: '2 hrs ago', status: 'Pending' },
  { id: 'RPT004', patient: 'Fatima Al-Zahra', age: 45, gender: 'Female', symptoms: 'Persistent headache on one side, nausea, sensitivity to light and sound', condition: 'Migraine', severity: 'MEDIUM', confidence: 76, recommendation: 'Schedule an appointment with your doctor within the next few days.', time: '3 hrs ago', status: 'Reviewed' },
  { id: 'RPT005', patient: 'Khalid Nour', age: 21, gender: 'Male', symptoms: 'Sore throat, runny nose, mild cough and sneezing for 1 day', condition: 'Common Cold', severity: 'LOW', confidence: 88, recommendation: 'Rest, stay hydrated, and monitor your symptoms.', time: '5 hrs ago', status: 'Reviewed' },
  { id: 'RPT006', patient: 'Layla Ibrahim', age: 38, gender: 'Female', symptoms: 'Nausea, vomiting, stomach pain and diarrhea after eating out', condition: 'Gastroenteritis', severity: 'MEDIUM', confidence: 79, recommendation: 'Stay well hydrated. See a doctor if symptoms persist beyond 48 hours.', time: '6 hrs ago', status: 'Pending' },
]

export default function ConsultationsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [statuses, setStatuses] = useState({})

  const filters = ['All', 'Pending', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'Reviewed']

  const filtered = allReports.filter(r => {
    const s = r.patient.toLowerCase().includes(search.toLowerCase()) || r.condition.toLowerCase().includes(search.toLowerCase()) || r.symptoms.toLowerCase().includes(search.toLowerCase())
    if (filter === 'All') return s
    if (filter === 'Pending') return s && (statuses[r.id] || r.status) === 'Pending'
    if (filter === 'Reviewed') return s && (statuses[r.id] || r.status) === 'Reviewed'
    return s && r.severity === filter
  })

  const markReviewed = (id) => setStatuses(p => ({ ...p, [id]: 'Reviewed' }))

  return (
    <div style={{ padding: '28px 32px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '4px' }}>Patient consultations</div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Review AI-triaged symptom reports and add your clinical notes</div>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients, conditions, symptoms..." style={{ width: '100%', paddingLeft: '30px', paddingRight: '10px', height: '34px', border: '0.5px solid var(--color-border-secondary)', borderRadius: '8px', fontSize: '12px', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', border: '0.5px solid', borderColor: filter === f ? 'transparent' : 'var(--color-border-secondary)', background: filter === f ? 'var(--color-background-info)' : 'transparent', color: filter === f ? 'var(--color-text-info)' : 'var(--color-text-secondary)', cursor: 'pointer' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {['CRITICAL','HIGH','MEDIUM','LOW'].map(sev => {
          const count = allReports.filter(r => r.severity === sev).length
          return (
            <div key={sev} style={{ padding: '5px 12px', borderRadius: '8px', background: severityStyle[sev].bg, fontSize: '11px', fontWeight: '500', color: severityStyle[sev].color }}>
              {count} {sev}
            </div>
          )
        })}
        <div style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: '8px', background: 'var(--color-background-secondary)', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
          {filtered.length} showing
        </div>
      </div>

      {/* Reports list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(r => {
          const status = statuses[r.id] || r.status
          const isExpanded = expanded === r.id
          return (
            <div key={r.id} style={{ background: 'var(--color-background-primary)', border: `0.5px solid ${r.severity === 'CRITICAL' ? '#f09595' : 'var(--color-border-tertiary)'}`, borderRadius: '12px', overflow: 'hidden' }}>
              {/* Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', cursor: 'pointer' }} onClick={() => setExpanded(isExpanded ? null : r.id)}>
                {/* Avatar */}
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-background-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                  {r.patient.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{r.patient}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{r.gender}, {r.age}</span>
                    {r.severity === 'CRITICAL' && <AlertTriangle size={12} color='#a32d2d' />}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    AI: <b style={{ fontWeight: '500' }}>{r.condition}</b> · {r.symptoms.slice(0, 60)}…
                  </div>
                </div>
                {/* Right badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '20px', background: severityStyle[r.severity].bg, color: severityStyle[r.severity].color }}>{r.severity}</span>
                  <span style={{ fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '20px', background: status === 'Reviewed' ? '#e1f5ee' : 'var(--color-background-secondary)', color: status === 'Reviewed' ? '#085041' : 'var(--color-text-tertiary)' }}>{status}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', minWidth: '60px', textAlign: 'right' }}>{r.time}</span>
                  {isExpanded ? <ChevronUp size={14} color='var(--color-text-tertiary)' /> : <ChevronDown size={14} color='var(--color-text-tertiary)' />}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', padding: '14px 16px', background: 'var(--color-background-secondary)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '4px' }}>Patient reported symptoms</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{r.symptoms}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '4px' }}>AI triage result</div>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{r.condition}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Confidence: {r.confidence}%</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>{r.recommendation}</div>
                    </div>
                  </div>
                  {/* Doctor notes */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Your clinical notes</div>
                    <textarea placeholder="Add your clinical assessment, diagnosis, and follow-up instructions..." style={{ width: '100%', minHeight: '70px', padding: '8px 10px', border: '0.5px solid var(--color-border-secondary)', borderRadius: '8px', fontSize: '12px', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => markReviewed(r.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#1d9e75', color: 'white', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                      <CheckCircle size={13} /> Mark as reviewed
                    </button>
                    <button style={{ padding: '7px 14px', borderRadius: '8px', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: '12px', cursor: 'pointer' }}>
                      Schedule appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
