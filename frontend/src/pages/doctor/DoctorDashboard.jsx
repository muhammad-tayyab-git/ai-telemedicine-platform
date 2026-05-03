import { useAuthStore } from '../../store/authStore'
import { Link } from 'react-router-dom'
import { Stethoscope, Calendar, Users, AlertTriangle, Activity, Clock, CheckCircle, ArrowRight, TrendingUp, FileText } from 'lucide-react'

const S = {
  page: { padding: '28px 32px', maxWidth: '960px', margin: '0 auto' },
  sectionLabel: { fontSize: '11px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '10px', marginTop: '24px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  card: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '16px 18px' },
  statCard: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '14px 16px' },
  badge: (color, bg) => ({ display: 'inline-block', fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '20px', background: bg, color }),
  row: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '0.5px solid var(--color-border-tertiary)' },
}

const severityStyle = {
  LOW:      { bg: '#e1f5ee', color: '#085041' },
  MEDIUM:   { bg: '#faeeda', color: '#633806' },
  HIGH:     { bg: '#faece7', color: '#712b13' },
  CRITICAL: { bg: '#fcebeb', color: '#791f1f' },
}

const stats = [
  { icon: Users, label: 'Total patients', value: '24', sub: '+3 this week', color: '#e6f1fb', iconColor: '#378add' },
  { icon: Activity, label: 'Pending reviews', value: '7', sub: '2 high priority', color: '#faece7', iconColor: '#d85a30' },
  { icon: Calendar, label: "Today's appointments", value: '5', sub: 'Next at 10:00 AM', color: '#e1f5ee', iconColor: '#1d9e75' },
  { icon: CheckCircle, label: 'Resolved today', value: '3', sub: 'Good progress', color: '#eeedfe', iconColor: '#534ab7' },
]

const pendingReports = [
  { patient: 'Ahmed Hassan', age: 34, symptoms: 'Chest pain, shortness of breath, dizziness', severity: 'CRITICAL', time: '15 min ago', id: 'RPT001' },
  { patient: 'Sara Malik', age: 28, symptoms: 'Fever, cough, loss of taste for 3 days', severity: 'HIGH', time: '1 hr ago', id: 'RPT002' },
  { patient: 'Omar Farouq', age: 52, symptoms: 'Red swollen eyes, runny nose, mild fever', severity: 'MEDIUM', time: '2 hrs ago', id: 'RPT003' },
  { patient: 'Fatima Al-Zahra', age: 45, symptoms: 'Persistent headache, light sensitivity', severity: 'MEDIUM', time: '3 hrs ago', id: 'RPT004' },
  { patient: 'Khalid Nour', age: 21, symptoms: 'Sore throat, runny nose, mild cough', severity: 'LOW', time: '5 hrs ago', id: 'RPT005' },
]

const appointments = [
  { patient: 'Ahmed Hassan', time: '10:00 AM', type: 'Follow-up', status: 'Confirmed' },
  { patient: 'Sara Malik', time: '11:30 AM', type: 'Consultation', status: 'Confirmed' },
  { patient: 'Layla Ibrahim', time: '1:00 PM', type: 'New patient', status: 'Pending' },
  { patient: 'Omar Farouq', time: '2:30 PM', type: 'Review results', status: 'Confirmed' },
  { patient: 'Nadia Saleh', time: '4:00 PM', type: 'Follow-up', status: 'Confirmed' },
]

const imageReviews = [
  { patient: 'Tariq Al-Said', type: 'XRAY', finding: 'Possible consolidation detected', urgent: true, time: '30 min ago' },
  { patient: 'Amira Hassan', type: 'MRI', finding: 'Soft tissue within normal limits', urgent: false, time: '2 hrs ago' },
  { patient: 'Yusuf Qasim', type: 'CT_SCAN', finding: 'No acute findings identified', urgent: false, time: '4 hrs ago' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DoctorDashboard() {
  const { user } = useAuthStore()
  return (
    <div style={S.page}>

      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            {getGreeting()}, Dr. {user?.lastName} 👨‍⚕️
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · {pendingReports.filter(r => r.severity === 'CRITICAL' || r.severity === 'HIGH').length} urgent cases need attention
          </div>
        </div>
        <div style={{ padding: '8px 14px', background: '#fcebeb', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={13} color='#a32d2d' />
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#791f1f' }}>{pendingReports.filter(r => r.severity === 'CRITICAL').length} critical alert</span>
        </div>
      </div>

      {/* Stats */}
      <div style={S.grid4}>
        {stats.map(({ icon: Icon, label, value, sub, color, iconColor }) => (
          <div key={label} style={S.statCard}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <Icon size={16} color={iconColor} />
            </div>
            <div style={{ fontSize: '22px', fontWeight: '500', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{label}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '3px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ ...S.grid2, marginTop: '12px' }}>

        {/* Pending symptom reports */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>Pending symptom reports</div>
            <Link to='/doctor/consultations' style={{ fontSize: '11px', color: 'var(--color-text-info)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>View all <ArrowRight size={11} /></Link>
          </div>
          {pendingReports.map((r, i) => (
            <div key={r.id} style={{ ...S.row, borderBottom: i < pendingReports.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-background-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                {r.patient.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{r.patient}</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>age {r.age}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.symptoms}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                <span style={S.badge(severityStyle[r.severity].color, severityStyle[r.severity].bg)}>{r.severity}</span>
                <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>{r.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Today's schedule */}
          <div style={S.card}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color='var(--color-text-secondary)' /> Today's schedule
            </div>
            {appointments.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < appointments.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-info)', minWidth: '60px' }}>{a.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{a.patient}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{a.type}</div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: '500', padding: '2px 7px', borderRadius: '20px', background: a.status === 'Confirmed' ? '#e1f5ee' : '#faeeda', color: a.status === 'Confirmed' ? '#085041' : '#633806' }}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>

          {/* Image reviews */}
          <div style={S.card}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} color='var(--color-text-secondary)' /> Image reviews pending
            </div>
            {imageReviews.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: i < imageReviews.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
                <div style={{ padding: '3px 7px', borderRadius: '5px', background: '#e6f1fb', fontSize: '10px', fontWeight: '500', color: '#0c447c', flexShrink: 0, marginTop: '1px' }}>{r.type}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{r.patient}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '1px' }}>{r.finding}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                  {r.urgent && <span style={{ fontSize: '10px', fontWeight: '500', padding: '2px 6px', borderRadius: '20px', background: '#fcebeb', color: '#791f1f' }}>Urgent</span>}
                  <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>{r.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly stats */}
          <div style={S.card}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} color='var(--color-text-secondary)' /> This week's overview
            </div>
            {[
              { label: 'Consultations completed', value: 18, total: 22, color: '#378add' },
              { label: 'Symptom reports reviewed', value: 31, total: 38, color: '#1d9e75' },
              { label: 'Images analysed', value: 12, total: 15, color: '#ba7517' },
            ].map(({ label, value, total, color }) => (
              <div key={label} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{value}/{total}</span>
                </div>
                <div style={{ height: '4px', background: 'var(--color-background-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(value / total) * 100}%`, background: color, borderRadius: '2px', transition: 'width .5s' }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
