import { useAuthStore } from '../../store/authStore'
import { Link } from 'react-router-dom'
import { Activity, ImagePlus, Calendar, ArrowRight, Heart, Thermometer, Wind, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const S = {
  page: { padding: '28px 32px', maxWidth: '960px', margin: '0 auto' },
  greeting: { marginBottom: '24px' },
  greetTitle: { fontSize: '22px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '4px' },
  greetSub: { fontSize: '13px', color: 'var(--color-text-secondary)' },
  sectionLabel: { fontSize: '11px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '10px', marginTop: '24px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  card: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '16px 18px' },
  metricCard: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' },
  metricIcon: { width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  metricVal: { fontSize: '22px', fontWeight: '500', color: 'var(--color-text-primary)', lineHeight: 1.2 },
  metricLabel: { fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '2px' },
  metricSub: { fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' },
  actionCard: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '18px', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'box-shadow .2s, border-color .2s' },
  actionIcon: { width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' },
  alertCard: { borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' },
  timelineItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: '0.5px solid var(--color-border-tertiary)' },
  timeDot: { width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0 },
}

const vitals = [
  { icon: Heart, label: 'Heart rate', value: '72', unit: 'bpm', sub: 'Normal range', color: '#faece7', iconColor: '#d85a30' },
  { icon: Thermometer, label: 'Temperature', value: '36.6', unit: '°C', sub: 'Normal', color: '#e1f5ee', iconColor: '#1d9e75' },
  { icon: Wind, label: 'SpO2', value: '98', unit: '%', sub: 'Good oxygen levels', color: '#e6f1fb', iconColor: '#378add' },
]

const recentActivity = [
  { label: 'Symptom check completed', time: '2 days ago', color: '#378add', severity: 'LOW', result: 'Common Cold' },
  { label: 'Image screening uploaded', time: '5 days ago', color: '#1d9e75', severity: 'MRI', result: 'No abnormality' },
  { label: 'Appointment with Dr. Ahmed', time: '1 week ago', color: '#ba7517', severity: 'Completed', result: 'Follow-up scheduled' },
]

const alerts = [
  { type: 'info', icon: Calendar, text: 'Next appointment: Tomorrow at 10:00 AM with Dr. Ahmed', color: '#e6f1fb', textColor: '#0c447c', iconColor: '#378add' },
  { type: 'warn', icon: AlertTriangle, text: 'Your last symptom report was rated MEDIUM severity — follow-up recommended', color: '#faeeda', textColor: '#633806', iconColor: '#ba7517' },
]

const quickActions = [
  { to: '/patient/symptoms', icon: Activity, label: 'Check symptoms', desc: 'AI triage in seconds', bg: '#e6f1fb', iconColor: '#378add' },
  { to: '/patient/images', icon: ImagePlus, label: 'Upload scan', desc: 'X-ray, MRI, CT analysis', bg: '#e1f5ee', iconColor: '#1d9e75' },
  { to: '/patient/appointments', icon: Calendar, label: 'Appointments', desc: 'View & book consultations', bg: '#faeeda', iconColor: '#ba7517' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function PatientDashboard() {
  const { user } = useAuthStore()
  return (
    <div style={S.page}>
      <div style={S.greeting}>
        <div style={S.greetTitle}>{getGreeting()}, {user?.firstName} 👋</div>
        <div style={S.greetSub}>Here is your health summary for today — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>

      {/* Alerts */}
      {alerts.map((a, i) => (
        <div key={i} style={{ ...S.alertCard, background: a.color, border: `0.5px solid ${a.iconColor}30` }}>
          <a.icon size={15} color={a.iconColor} style={{ marginTop: '1px', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: a.textColor, lineHeight: 1.5 }}>{a.text}</span>
        </div>
      ))}

      {/* Vitals */}
      <div style={S.sectionLabel}>Health vitals — indicative values</div>
      <div style={S.grid3}>
        {vitals.map(({ icon: Icon, label, value, unit, sub, color, iconColor }) => (
          <div key={label} style={S.metricCard}>
            <div style={{ ...S.metricIcon, background: color }}>
              <Icon size={18} color={iconColor} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                <span style={S.metricVal}>{value}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{unit}</span>
              </div>
              <div style={S.metricLabel}>{label}</div>
              <div style={{ ...S.metricSub, color: '#1d9e75' }}>✓ {sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={S.sectionLabel}>Quick actions</div>
      <div style={S.grid3}>
        {quickActions.map(({ to, icon: Icon, label, desc, bg, iconColor }) => (
          <Link key={to} to={to} style={S.actionCard}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'var(--color-border-secondary)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-border-tertiary)' }}>
            <div style={{ ...S.actionIcon, background: bg }}>
              <Icon size={18} color={iconColor} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '3px' }}>{label}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', flex: 1 }}>{desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '12px', color: iconColor, fontWeight: '500' }}>
              Open <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ ...S.grid2, marginTop: '12px' }}>

        {/* Recent activity */}
        <div style={S.card}>
          <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '12px' }}>Recent activity</div>
          {recentActivity.map((item, i) => (
            <div key={i} style={{ ...S.timelineItem, borderBottom: i < recentActivity.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
              <div style={{ ...S.timeDot, background: item.color }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '1px' }}>{item.result}</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>{item.time}</div>
            </div>
          ))}
        </div>

        {/* Health tips */}
        <div style={S.card}>
          <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '12px' }}>Health tips for today</div>
          {[
            { icon: '💧', tip: 'Stay hydrated — aim for 8 glasses of water today' },
            { icon: '🚶', tip: 'A 30-minute walk can significantly improve your mood' },
            { icon: '😴', tip: '7–9 hours of sleep supports a healthy immune system' },
            { icon: '🥗', tip: 'Include vegetables in every meal for better nutrition' },
          ].map(({ icon, tip }, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: i < 3 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
              <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: '16px', padding: '10px 14px', background: 'var(--color-background-secondary)', borderRadius: '8px', fontSize: '11px', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
        ⚠️ All AI results on this platform are for guidance only. Vitals shown are indicative. Always consult a qualified healthcare professional for medical decisions.
      </div>
    </div>
  )
}
