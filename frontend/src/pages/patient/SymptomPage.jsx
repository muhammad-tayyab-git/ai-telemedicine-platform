import { useState, useEffect, useRef } from 'react'
import { symptomApi } from '../../api/services'
import toast from 'react-hot-toast'

const ALL_SYMPTOMS = [
  'Abdominal pain','Acid reflux','Acne','Ankle pain','Anxiety','Arm pain','Back pain',
  'Balance problems','Bloating','Blurred vision','Body aches','Burning urination',
  'Chest pain','Chest tightness','Chills','Confusion','Constipation','Cough','Cramps',
  'Depression','Diarrhea','Difficulty swallowing','Dizziness','Dry mouth','Dry skin',
  'Earache','Eye discharge','Eye itching','Eye redness','Eye swelling','Facial pain',
  'Fatigue','Fever','Frequent urination','Hair loss','Headache','Heart palpitations',
  'Heartburn','Hip pain','Hoarse voice','Hot flashes','Indigestion','Itching',
  'Itchy nose','Itchy skin','Itchy throat','Joint pain','Knee pain','Light sensitivity',
  'Loss of appetite','Loss of smell','Loss of taste','Memory issues','Mouth sores',
  'Mucus/phlegm','Muscle cramps','Muscle weakness','Nasal congestion','Nausea',
  'Neck pain','Neck stiffness','Night sweats','Nosebleed','Numbness','Postnasal drip',
  'Rash','Ringing in ears','Runny nose','Shortness of breath','Shoulder pain',
  'Skin irritation','Sleep issues','Sneezing','Sore throat','Stomach pain','Swelling',
  'Swollen glands','Throat irritation','Tingling','Trembling','Urinary urgency',
  'Vision changes','Vomiting','Watery eyes','Weakness','Weight loss','Wheezing',
]

const CASCADE = {
  'Fever':['Chills','Body aches','Night sweats','Loss of appetite','Headache','Fatigue'],
  'Cough':['Sore throat','Chest tightness','Shortness of breath','Mucus/phlegm','Hoarse voice'],
  'Watery eyes':['Eye itching','Eye redness','Light sensitivity','Eye swelling'],
  'Sneezing':['Runny nose','Nasal congestion','Itchy nose','Postnasal drip','Loss of smell'],
  'Headache':['Nausea','Light sensitivity','Neck stiffness','Dizziness'],
  'Chest pain':['Shortness of breath','Heart palpitations','Arm pain','Sweating','Nausea'],
  'Shortness of breath':['Chest tightness','Wheezing','Cough','Fatigue','Dizziness'],
  'Fatigue':['Muscle weakness','Poor concentration','Sleep issues','Low mood','Loss of appetite'],
  'Stomach pain':['Nausea','Vomiting','Diarrhea','Bloating','Loss of appetite'],
  'Joint pain':['Swelling','Stiffness','Redness around joint'],
  'Skin rash':['Itching','Redness','Swelling','Dry skin'],
  'Dizziness':['Nausea','Balance problems','Ringing in ears','Blurred vision'],
  'Sore throat':['Difficulty swallowing','Swollen glands','Hoarse voice','Ear pain','Fever'],
  'Runny nose':['Sneezing','Nasal congestion','Postnasal drip','Sore throat','Loss of smell'],
}

const AGE_GROUPS = [
  { value:'child',    label:'0–12 years', sub:'Child' },
  { value:'teen',     label:'13–17 years', sub:'Teen' },
  { value:'adult',    label:'18–40 years', sub:'Adult' },
  { value:'midadult', label:'41–60 years', sub:'Middle-aged' },
  { value:'senior',   label:'61+ years',   sub:'Senior' },
]

const AGE_SYMPTOMS = {
  child:    { weather:['Runny nose','Sneezing','Watery eyes','Skin rash','Itchy throat'], common:['Fever','Cough','Earache','Stomach pain','Vomiting','Diarrhea','Sore throat','Fatigue'] },
  teen:     { weather:['Sneezing','Watery eyes','Runny nose','Itchy skin','Nasal congestion'], common:['Headache','Fever','Sore throat','Fatigue','Body aches','Cough','Dizziness'] },
  adult:    { weather:['Sneezing','Watery eyes','Runny nose','Itchy throat','Nasal congestion','Skin irritation'], common:['Headache','Fatigue','Fever','Cough','Chest pain','Back pain','Anxiety','Sleep issues'] },
  midadult: { weather:['Runny nose','Sneezing','Watery eyes','Nasal congestion','Itchy skin'], common:['Fatigue','Joint pain','Headache','Shortness of breath','Chest tightness','Indigestion','Back pain'] },
  senior:   { weather:['Runny nose','Sneezing','Watery eyes','Nasal congestion'], common:['Shortness of breath','Chest pain','Joint pain','Dizziness','Fatigue','Memory issues','Muscle weakness','Balance problems'] },
}

const SEV_STYLE = { LOW:'#085041:#e1f5ee', MEDIUM:'#633806:#faeeda', HIGH:'#712b13:#faece7', CRITICAL:'#791f1f:#fcebeb' }

function Tag({ label, type='default', selected, onClick }) {
  const bg = selected
    ? type==='weather' ? '#085041' : type==='cascade' ? '#633806' : type==='custom' ? '#3c3489' : '#0c447c'
    : type==='weather' ? '#e1f5ee' : type==='cascade' ? '#faeeda' : type==='custom' ? '#eeedfe' : 'var(--color-background-primary)'
  const color = selected
    ? type==='weather' ? '#e1f5ee' : type==='cascade' ? '#faeeda' : type==='custom' ? '#eeedfe' : '#e6f1fb'
    : type==='weather' ? '#085041' : type==='cascade' ? '#633806' : type==='custom' ? '#3c3489' : 'var(--color-text-secondary)'
  const border = selected ? 'transparent' : type==='weather' ? '#5dcaa5' : type==='cascade' ? '#ef9f27' : type==='custom' ? '#afa9ec' : 'var(--color-border-secondary)'
  return (
    <span onClick={onClick} style={{
      display:'inline-flex',alignItems:'center',gap:5,padding:'6px 12px',borderRadius:8,
      fontSize:12,fontWeight:500,border:`0.5px solid ${border}`,background:bg,color,
      cursor:'pointer',margin:3,transition:'all .15s',userSelect:'none'
    }}>{label}</span>
  )
}

function Bubble({ role, children }) {
  const isAi = role==='ai'
  return (
    <div style={{
      padding:'10px 14px',borderRadius:isAi?'4px 12px 12px 12px':'12px 4px 12px 12px',
      fontSize:13,lineHeight:1.6,marginBottom:8,maxWidth:'88%',
      background:isAi?'var(--color-background-primary)':'#e6f1fb',
      border:isAi?'0.5px solid var(--color-border-tertiary)':'none',
      color:isAi?'var(--color-text-primary)':'#0c447c',
      marginLeft:isAi?0:'auto',animation:'fadeIn .3s ease'
    }}>{children}</div>
  )
}

export default function SymptomPage() {
  const [step, setStep]           = useState('age')
  const [ageGroup, setAgeGroup]   = useState('')
  const [selected, setSelected]   = useState(new Set())
  const [cascades, setCascades]   = useState([])
  const [searchQ, setSearchQ]     = useState('')
  const [searchRes, setSearchRes] = useState([])
  const [duration, setDuration]   = useState('')
  const [severity, setSeverity]   = useState(5)
  const [allergies, setAllergies] = useState('')
  const [messages, setMessages]   = useState([
    { role:'ai', text:'Hello! I can see you are in Budapest — spring season with high pollen today. To show you the most relevant symptoms, I need one quick detail first.' }
  ])
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const chatRef = useRef(null)

  useEffect(() => { chatRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const addMsg = (role, text) => setMessages(p => [...p, { role, text }])

  const symptoms = ageGroup ? AGE_SYMPTOMS[ageGroup] : null

  function selectAge(group, label) {
    setAgeGroup(group)
    addMsg('user', label)
    setTimeout(() => {
      addMsg('ai', `Got it. Here are the most common symptoms for people aged ${label} in Budapest this spring. Green tags are weather/season-contextual — they are especially common right now. Select everything that applies.`)
      setStep('symptoms')
    }, 300)
  }

  function toggleSymptom(label, type) {
    const next = new Set(selected)
    if (next.has(label)) {
      next.delete(label)
    } else {
      next.add(label)
      const related = CASCADE[label] || []
      if (related.length) {
        setCascades(prev => {
          const existing = new Set(prev)
          related.forEach(r => { if (!next.has(r)) existing.add(r) })
          return [...existing]
        })
      }
    }
    setSelected(next)
  }

  function removeSelected(label) {
    const next = new Set(selected)
    next.delete(label)
    setSelected(next)
  }

  function handleSearch(q) {
    setSearchQ(q)
    if (!q.trim()) { setSearchRes([]); return }
    const matches = ALL_SYMPTOMS.filter(s => s.toLowerCase().includes(q.toLowerCase()) && !selected.has(s)).slice(0, 6)
    setSearchRes(matches)
  }

  function addFromSearch(label) {
    const next = new Set(selected)
    next.add(label)
    setSelected(next)
    const related = CASCADE[label] || []
    if (related.length) {
      setCascades(prev => {
        const existing = new Set(prev)
        related.forEach(r => { if (!next.has(r)) existing.add(r) })
        return [...existing]
      })
      addMsg('ai', `I added "${label}" — these symptoms often appear alongside it. Would you like to add any?`)
    }
    setSearchQ('')
    setSearchRes([])
  }

  function addCustom(label) {
    const clean = label.trim()
    if (!clean) return
    const next = new Set(selected)
    next.add(clean)
    setSelected(next)
    addMsg('ai', `I've added "${clean}" to your list. Keep selecting any other symptoms you have.`)
    setSearchQ('')
    setSearchRes([])
  }

  function proceedToFollowup() {
    if (selected.size === 0) { toast.error('Please select at least one symptom'); return }
    const list = [...selected]
    addMsg('user', list.join(', '))
    addMsg('ai', `You have ${selected.size} symptom${selected.size>1?'s':''}: ${list.slice(0,3).join(', ')}${list.length>3?` and ${list.length-3} more`:''}. Two quick questions before I run the analysis.`)
    setStep('followup')
  }

  async function runAnalysis() {
    if (!duration) { toast.error('Please select how long you have had these symptoms'); return }
    setLoading(true)
    addMsg('ai', 'Analysing your symptom profile...')
    try {
      const res = await symptomApi.analyze({
        selectedSymptoms: [...selected],
        primarySymptom: [...selected][0],
        ageGroup, duration, severity,
        knownAllergies: allergies,
        city: 'Budapest', temperature: 18,
        weatherDescription: 'spring clear', pollenLevel: 'high', season: 'spring'
      })
      setResult(res.data.data)
      addMsg('ai', 'Analysis complete. Here is my assessment based on your symptom profile, age group, and current conditions in Budapest.')
      setStep('result')
    } catch {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep('age'); setAgeGroup(''); setSelected(new Set()); setCascades([])
    setSearchQ(''); setSearchRes([]); setDuration(''); setSeverity(5)
    setAllergies(''); setResult(null); setLoading(false)
    setMessages([{ role:'ai', text:'Hello! I can see you are in Budapest — spring season with high pollen today. To show you the most relevant symptoms, I need one quick detail first.' }])
  }

  const [sColor, sBg] = result ? (SEV_STYLE[result.severityLevel]||'#633806:#faeeda').split(':') : []

  return (
    <div style={{ padding:'24px 28px', maxWidth:700, margin:'0 auto' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:18,fontWeight:500,color:'var(--color-text-primary)',marginBottom:4 }}>Smart symptom check</div>
        <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'var(--color-background-secondary)',borderRadius:8,fontSize:12,color:'var(--color-text-secondary)' }}>
          <span style={{ fontSize:16 }}>📍</span>
          <span><strong style={{ color:'var(--color-text-primary)' }}>Budapest · 18°C · High pollen · Spring</strong> — allergies and respiratory infections common in your area</span>
        </div>
      </div>

      <div style={{ background:'var(--color-background-secondary)',borderRadius:12,padding:14,marginBottom:12 }}>
        <div style={{ fontSize:11,fontWeight:500,color:'var(--color-text-tertiary)',marginBottom:8 }}>TeleMed AI</div>
        {messages.map((m,i) => <Bubble key={i} role={m.role}>{m.text}</Bubble>)}
        <div ref={chatRef}/>
      </div>

      {step==='age' && (
        <div style={{ background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:12,padding:16 }}>
          <div style={{ fontSize:13,fontWeight:500,color:'var(--color-text-primary)',marginBottom:10 }}>What is the patient's age group?</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
            {AGE_GROUPS.map(a => (
              <button key={a.value} onClick={() => selectAge(a.value, a.label)} style={{
                padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:500,
                border:'0.5px solid var(--color-border-secondary)',
                background:'var(--color-background-primary)',color:'var(--color-text-secondary)',
                cursor:'pointer',transition:'all .15s'
              }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--color-background-secondary)'}
              onMouseLeave={e=>e.currentTarget.style.background='var(--color-background-primary)'}>
                {a.label} <span style={{ fontSize:11,opacity:.6 }}>({a.sub})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step==='symptoms' && symptoms && (
        <div style={{ background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:12,padding:16,animation:'fadeIn .3s ease' }}>
          <div style={{ fontSize:13,fontWeight:500,color:'var(--color-text-primary)',marginBottom:4 }}>Common symptoms for your age group in Budapest this spring</div>
          <div style={{ fontSize:11,color:'var(--color-text-tertiary)',marginBottom:10,display:'flex',gap:8,flexWrap:'wrap' }}>
            <span style={{ background:'#e1f5ee',color:'#085041',padding:'2px 7px',borderRadius:20,fontWeight:500 }}>Green = seasonal / weather</span>
            <span style={{ background:'#faeeda',color:'#633806',padding:'2px 7px',borderRadius:20,fontWeight:500 }}>Amber = related to your selection</span>
          </div>

          <div style={{ marginBottom:10 }}>
            {symptoms.weather.map(s => <Tag key={s} label={s} type='weather' selected={selected.has(s)} onClick={()=>toggleSymptom(s,'weather')}/>)}
            {symptoms.common.map(s => <Tag key={s} label={s} selected={selected.has(s)} onClick={()=>toggleSymptom(s,'default')}/>)}
          </div>

          {cascades.filter(s => !symptoms.weather.includes(s) && !symptoms.common.includes(s)).length > 0 && (
            <div style={{ marginBottom:10,paddingTop:10,borderTop:'0.5px solid var(--color-border-tertiary)' }}>
              <div style={{ fontSize:11,fontWeight:500,color:'var(--color-text-tertiary)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6 }}>Related — commonly occur together</div>
              {cascades.filter(s => !symptoms.weather.includes(s) && !symptoms.common.includes(s)).map(s => (
                <Tag key={s} label={s} type='cascade' selected={selected.has(s)} onClick={()=>toggleSymptom(s,'cascade')}/>
              ))}
            </div>
          )}

          <div style={{ borderTop:'0.5px solid var(--color-border-tertiary)',paddingTop:12,marginTop:4 }}>
            <div style={{ fontSize:12,fontWeight:500,color:'var(--color-text-primary)',marginBottom:6 }}>Search for a specific symptom</div>
            <div style={{ position:'relative',marginBottom:searchRes.length?0:10 }}>
              <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-tertiary)',fontSize:14 }}>🔍</span>
              <input value={searchQ} onChange={e=>handleSearch(e.target.value)} placeholder="Type a symptom — e.g. back pain, bloating..."
                style={{ width:'100%',padding:'8px 12px 8px 30px',border:'0.5px solid var(--color-border-secondary)',borderRadius:8,fontSize:12,background:'var(--color-background-primary)',color:'var(--color-text-primary)',outline:'none' }}/>
            </div>
            {searchRes.length > 0 && (
              <div style={{ background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-secondary)',borderRadius:8,marginBottom:10,overflow:'hidden' }}>
                {searchRes.map(s => (
                  <div key={s} onClick={()=>addFromSearch(s)} style={{ padding:'9px 12px',fontSize:12,cursor:'pointer',color:'var(--color-text-primary)',borderBottom:'0.5px solid var(--color-border-tertiary)',display:'flex',justifyContent:'space-between',alignItems:'center' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--color-background-secondary)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span>{s}</span>
                    <span style={{ fontSize:10,fontWeight:500,padding:'2px 7px',borderRadius:20,background:'#e6f1fb',color:'#0c447c' }}>Add</span>
                  </div>
                ))}
                {searchQ.trim() && !ALL_SYMPTOMS.some(s=>s.toLowerCase()===searchQ.toLowerCase()) && (
                  <div onClick={()=>addCustom(searchQ)} style={{ padding:'9px 12px',fontSize:12,cursor:'pointer',color:'var(--color-text-primary)',display:'flex',justifyContent:'space-between',alignItems:'center' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--color-background-secondary)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span>Not listed — add "<strong>{searchQ}</strong>"</span>
                    <span style={{ fontSize:10,fontWeight:500,padding:'2px 7px',borderRadius:20,background:'#eeedfe',color:'#3c3489' }}>Add custom</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ marginTop:10,borderTop:'0.5px solid var(--color-border-tertiary)',paddingTop:10 }}>
            <div style={{ fontSize:11,color:'var(--color-text-tertiary)',marginBottom:6 }}>
              {selected.size > 0 ? `${selected.size} symptom${selected.size>1?'s':''} selected` : 'No symptoms selected yet'}
            </div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:4,minHeight:32,padding:8,background:'var(--color-background-secondary)',borderRadius:8,marginBottom:10 }}>
              {selected.size === 0
                ? <span style={{ fontSize:11,color:'var(--color-text-tertiary)',alignSelf:'center' }}>Tap symptoms above to add them here</span>
                : [...selected].map(s => (
                  <span key={s} style={{ display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:500,background:'var(--color-background-info)',color:'var(--color-text-info)' }}>
                    {s}
                    <span onClick={()=>removeSelected(s)} style={{ cursor:'pointer',marginLeft:2,opacity:.7,fontSize:13,lineHeight:1 }}>×</span>
                  </span>
                ))
              }
            </div>
            <button onClick={proceedToFollowup} style={{ width:'100%',padding:'10px',borderRadius:8,border:'none',background:'#378add',color:'white',fontSize:13,fontWeight:500,cursor:'pointer' }}>
              Continue with {selected.size} symptom{selected.size!==1?'s':''} →
            </button>
          </div>
        </div>
      )}

      {step==='followup' && (
        <div style={{ background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:12,padding:16,animation:'fadeIn .3s ease' }}>
          <div style={{ fontSize:13,fontWeight:500,color:'var(--color-text-primary)',marginBottom:12 }}>A few quick questions</div>

          <div style={{ fontSize:12,color:'var(--color-text-secondary)',marginBottom:8 }}>How long have you had these symptoms?</div>
          <div style={{ display:'flex',flexWrap:'wrap',marginBottom:14 }}>
            {['Today only','2–3 days','4–7 days','1–2 weeks','Over 2 weeks'].map(d => (
              <button key={d} onClick={()=>setDuration(d)} style={{
                padding:'6px 12px',borderRadius:8,fontSize:12,margin:3,
                border:`0.5px solid ${duration===d?'#85b7eb':'var(--color-border-secondary)'}`,
                background:duration===d?'#e6f1fb':'var(--color-background-primary)',
                color:duration===d?'#0c447c':'var(--color-text-secondary)',cursor:'pointer'
              }}>{d}</button>
            ))}
          </div>

          <div style={{ fontSize:12,color:'var(--color-text-secondary)',marginBottom:8 }}>How severe is it? (1 = mild, 10 = very severe)</div>
          <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
            <span style={{ fontSize:11,color:'var(--color-text-tertiary)' }}>Mild</span>
            <input type='range' min={1} max={10} step={1} value={severity} onChange={e=>setSeverity(Number(e.target.value))} style={{ flex:1 }}/>
            <span style={{ fontSize:11,color:'var(--color-text-tertiary)' }}>Severe</span>
            <span style={{ fontSize:14,fontWeight:500,color:'var(--color-text-primary)',minWidth:20,textAlign:'center' }}>{severity}</span>
          </div>

          <div style={{ fontSize:12,color:'var(--color-text-secondary)',marginBottom:6 }}>Any known allergies or ongoing medications?</div>
          <input type='text' value={allergies} onChange={e=>setAllergies(e.target.value)} placeholder="e.g. penicillin, hay fever, metformin — or leave blank"
            style={{ width:'100%',padding:'8px 12px',border:'0.5px solid var(--color-border-secondary)',borderRadius:8,fontSize:12,background:'var(--color-background-primary)',color:'var(--color-text-primary)',outline:'none',marginBottom:12 }}/>

          <button onClick={runAnalysis} disabled={loading} style={{ width:'100%',padding:10,borderRadius:8,border:'none',background:'#1d9e75',color:'white',fontSize:13,fontWeight:500,cursor:'pointer',opacity:loading?0.6:1 }}>
            {loading ? 'Analysing...' : '🧠 Analyse my symptoms'}
          </button>
        </div>
      )}

      {step==='result' && result && (
        <div style={{ animation:'fadeIn .3s ease' }}>
          <div style={{ borderLeft:'3px solid #1d9e75',background:'var(--color-background-primary)',borderRadius:'0 12px 12px 0',padding:16,marginBottom:10 }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10 }}>
              <div style={{ fontSize:14,fontWeight:500,color:'var(--color-text-primary)' }}>{result.predictedCondition}</div>
              <span style={{ fontSize:11,fontWeight:500,padding:'3px 10px',borderRadius:20,background:sBg,color:sColor }}>{result.severityLevel}</span>
            </div>
            <div style={{ fontSize:11,color:'var(--color-text-tertiary)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>Confidence</div>
            <div style={{ fontSize:13,color:'var(--color-text-primary)',marginBottom:10 }}>{result.confidenceScore != null ? `${(result.confidenceScore*100).toFixed(0)}%` : 'N/A'}</div>
            <div style={{ fontSize:11,color:'var(--color-text-tertiary)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>Recommendation</div>
            <div style={{ fontSize:12,color:'var(--color-text-primary)',lineHeight:1.6,marginBottom:10 }}>{result.recommendation}</div>
            <div style={{ fontSize:11,color:'var(--color-text-tertiary)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6 }}>Your symptoms</div>
            <div>{[...selected].map(s=><span key={s} style={{ display:'inline-block',fontSize:11,background:'var(--color-background-secondary)',color:'var(--color-text-secondary)',padding:'2px 8px',borderRadius:20,margin:2 }}>{s}</span>)}</div>
            <div style={{ marginTop:10,padding:'8px 10px',background:'var(--color-background-secondary)',borderRadius:8,fontSize:11,color:'var(--color-text-tertiary)' }}>
              ⚠ AI-generated advisory only. Always consult a qualified healthcare professional.
            </div>
          </div>
          <div style={{ display:'flex',gap:8 }}>
            <button onClick={reset} style={{ flex:1,padding:9,borderRadius:8,border:'0.5px solid var(--color-border-secondary)',background:'transparent',color:'var(--color-text-secondary)',fontSize:12,cursor:'pointer' }}>
              ↺ Start new check
            </button>
            <button onClick={()=>window.location.href='/patient/appointments'} style={{ flex:1,padding:9,borderRadius:8,border:'none',background:'#e6f1fb',color:'#0c447c',fontSize:12,fontWeight:500,cursor:'pointer' }}>
              Book appointment →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
