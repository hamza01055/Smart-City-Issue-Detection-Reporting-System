import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadForm from '../components/UploadForm'
import ResultCard from '../components/ResultCard'

const stats = [
  { label: 'Issues Detected', value: '1,284', icon: '🔍', color: '#3b82f6' },
  { label: 'Garbage Reports', value: '547',   icon: '🗑',  color: '#f59e0b' },
  { label: 'Pothole Reports', value: '391',   icon: '🕳',  color: '#ef4444' },
  { label: 'Resolved Today',  value: '68',    icon: '✅',  color: '#22c55e' },
]

export default function Dashboard() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [history, setHistory] = useState([])
  const navigate              = useNavigate()

  const handleResult = (r) => {
    setResult(r)
    if (r) {
      setHistory(prev => [{
        ...r,
        time: new Date().toLocaleTimeString(),
        id: Date.now()
      }, ...prev].slice(0, 5))
    }
  }

  return (
    <div className="min-h-screen grid-bg" style={{color:'var(--text-primary)'}}>

      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-lg">
            🏙
          </div>
          <span style={{fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem'}}>
            Smart City Detector
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>
            Admin Panel
          </span>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <h1 style={{fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, marginBottom:'6px'}}>
            Issue Detection
          </h1>
          <p style={{color:'var(--text-secondary)', fontSize:'0.9rem'}}>
            Upload an image to automatically detect and classify urban issues
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-10 animate-fade-up-delay" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '18px 20px'
            }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{fontSize:'1.4rem'}}>{s.icon}</span>
                <span style={{
                  fontSize:'0.7rem',
                  color: s.color,
                  background: s.color + '18',
                  borderRadius:'20px',
                  padding:'2px 8px',
                  border: `1px solid ${s.color}30`
                }}>LIVE</span>
              </div>
              <div style={{
                fontFamily:'var(--font-display)',
                fontSize:'1.6rem',
                fontWeight:800,
                color: s.color,
                lineHeight:1
              }}>
                {s.value}
              </div>
              <div style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginTop:'4px'}}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6" style={{gridTemplateColumns:'1fr 1fr'}}>

          {/* Left — Upload */}
          <div className="animate-fade-up-delay">
            <h2 style={{fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, marginBottom:'16px', color:'var(--text-secondary)', letterSpacing:'0.05em'}}>
              UPLOAD IMAGE
            </h2>
            <UploadForm
              setResult={handleResult}
              setLoading={setLoading}
              setError={setError}
            />

            {loading && (
              <div style={{
                marginTop:'16px',
                background:'var(--bg-card)',
                border:'1px solid var(--border)',
                borderRadius:'14px',
                padding:'20px',
                textAlign:'center',
                position:'relative',
                overflow:'hidden'
              }}>
                <div className="scan-line" />
                <div style={{fontSize:'0.9rem', color:'#60a5fa', fontWeight:500}}>
                  🔍 Analyzing image with AI...
                </div>
                <div style={{fontSize:'0.78rem', color:'var(--text-secondary)', marginTop:'6px'}}>
                  Running classification model
                </div>
              </div>
            )}

            {error && (
              <div style={{
                marginTop:'16px',
                background:'rgba(239,68,68,0.08)',
                border:'1px solid rgba(239,68,68,0.25)',
                borderRadius:'12px',
                padding:'14px 18px',
                fontSize:'0.85rem',
                color:'#f87171'
              }}>
                ❌ {error}
              </div>
            )}
          </div>

          {/* Right — Result */}
          <div className="animate-fade-up-delay-2">
            <h2 style={{fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, marginBottom:'16px', color:'var(--text-secondary)', letterSpacing:'0.05em'}}>
              DETECTION RESULT
            </h2>
            {result && !loading
              ? <ResultCard result={result} />
              : (
                <div style={{
                  background:'var(--bg-card)',
                  border:'1px dashed var(--border)',
                  borderRadius:'16px',
                  height:'300px',
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  justifyContent:'center',
                  gap:'12px'
                }}>
                  <span style={{fontSize:'2.5rem', opacity:0.3}}>🔬</span>
                  <p style={{color:'var(--text-secondary)', fontSize:'0.85rem'}}>
                    Results will appear here
                  </p>
                </div>
              )
            }
          </div>
        </div>

        {/* Detection History */}
        {history.length > 0 && (
          <div style={{marginTop:'40px'}}>
            <h2 style={{fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, marginBottom:'16px', color:'var(--text-secondary)', letterSpacing:'0.05em'}}>
              RECENT DETECTIONS
            </h2>
            <div style={{
              background:'var(--bg-card)',
              border:'1px solid var(--border)',
              borderRadius:'16px',
              overflow:'hidden'
            }}>
              {history.map((h, i) => (
                <div key={h.id} style={{
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'space-between',
                  padding:'14px 20px',
                  borderBottom: i < history.length-1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div className="flex items-center gap-3">
                    <span style={{
                      width:'8px', height:'8px', borderRadius:'50%',
                      background: h.has_issue ? '#ef4444' : '#22c55e',
                      display:'inline-block', flexShrink:0
                    }} />
                    <span style={{fontWeight:500, fontSize:'0.9rem'}}>{h.label}</span>
                    <span style={{
                      fontSize:'0.72rem',
                      color:'var(--text-secondary)',
                      background:'var(--bg-elevated)',
                      borderRadius:'6px',
                      padding:'2px 8px'
                    }}>
                      {h.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span style={{
                      fontFamily:'var(--font-display)',
                      fontWeight:700,
                      fontSize:'0.9rem',
                      color: h.has_issue ? '#f87171' : '#4ade80'
                    }}>
                      {h.confidence}%
                    </span>
                    <span style={{fontSize:'0.75rem', color:'var(--text-secondary)'}}>
                      {h.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
