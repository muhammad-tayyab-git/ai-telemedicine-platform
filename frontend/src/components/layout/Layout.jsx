import { Outlet, NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LayoutDashboard, Activity, ImagePlus, Calendar, Stethoscope, LogOut, ChevronRight } from 'lucide-react'

const patientNav = [
  { to: '/patient',              label: 'Dashboard',       icon: LayoutDashboard, end: true },
  { to: '/patient/symptoms',     label: 'Symptom Check',   icon: Activity },
  { to: '/patient/images',       label: 'Image Screening', icon: ImagePlus },
  { to: '/patient/appointments', label: 'Appointments',    icon: Calendar },
]
const doctorNav = [
  { to: '/doctor',                 label: 'Dashboard',     icon: LayoutDashboard, end: true },
  { to: '/doctor/consultations',   label: 'Consultations', icon: Stethoscope },
  { to: '/doctor/appointments',    label: 'Appointments',  icon: Calendar },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const nav = user?.role === 'DOCTOR' ? doctorNav : patientNav
  const initials = `${user?.firstName?.[0]||''}${user?.lastName?.[0]||''}`

  return (
    <div style={{display:'flex',height:'100vh',background:'var(--color-background-tertiary)'}}>
      <aside style={{width:'232px',flexShrink:0,background:'var(--color-background-primary)',borderRight:'0.5px solid var(--color-border-tertiary)',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'18px 16px 14px',borderBottom:'0.5px solid var(--color-border-tertiary)',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'var(--color-background-info)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Activity size={15} color='var(--color-text-info)'/>
          </div>
          <div>
            <div style={{fontSize:'13px',fontWeight:'500',color:'var(--color-text-primary)'}}>TeleMed AI</div>
            <div style={{fontSize:'11px',color:'var(--color-text-tertiary)'}}>{user?.role==='DOCTOR'?'Doctor Portal':'Patient Portal'}</div>
          </div>
        </div>

        <nav style={{flex:1,padding:'10px 8px',display:'flex',flexDirection:'column',gap:'1px'}}>
          <div style={{fontSize:'10px',fontWeight:'500',color:'var(--color-text-tertiary)',letterSpacing:'.07em',textTransform:'uppercase',padding:'8px 8px 4px'}}>Menu</div>
          {nav.map(({to,label,icon:Icon,end})=>(
            <NavLink key={to} to={to} end={end} style={({isActive})=>({
              display:'flex',alignItems:'center',gap:'9px',padding:'8px 10px',borderRadius:'8px',
              fontSize:'13px',fontWeight:isActive?'500':'400',
              color:isActive?'var(--color-text-info)':'var(--color-text-secondary)',
              background:isActive?'var(--color-background-info)':'transparent',
              textDecoration:'none',transition:'all .15s',
            })}>
              <Icon size={15}/><span style={{flex:1}}>{label}</span><ChevronRight size={11} style={{opacity:.35}}/>
            </NavLink>
          ))}
        </nav>

        <div style={{padding:'10px 8px',borderTop:'0.5px solid var(--color-border-tertiary)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'9px',padding:'8px 10px',borderRadius:'8px',background:'var(--color-background-secondary)',marginBottom:'4px'}}>
            <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'var(--color-background-info)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'500',color:'var(--color-text-info)',flexShrink:0}}>{initials}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:'12px',fontWeight:'500',color:'var(--color-text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.role==='DOCTOR'?'Dr. ':''}{user?.firstName} {user?.lastName}</div>
              <div style={{fontSize:'11px',color:'var(--color-text-tertiary)',textTransform:'capitalize'}}>{user?.role?.toLowerCase()}</div>
            </div>
          </div>
          <button onClick={logout} style={{display:'flex',alignItems:'center',gap:'8px',width:'100%',padding:'7px 10px',borderRadius:'8px',border:'none',background:'transparent',cursor:'pointer',fontSize:'12px',color:'var(--color-text-secondary)'}}>
            <LogOut size={13}/>Sign out
          </button>
        </div>
      </aside>
      <main style={{flex:1,overflowY:'auto'}}><Outlet/></main>
    </div>
  )
}
