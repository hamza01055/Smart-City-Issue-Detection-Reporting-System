import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    // Simulate auth delay (replace with real API call later)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4">
            <span className="text-3xl">🏙</span>
          </div>
          <h1 className="text-3xl font-bold shimmer-text mb-1" style={{fontFamily:'var(--font-display)'}}>
            Smart City
          </h1>
          <p style={{color:'var(--text-secondary)', fontSize:'0.85rem'}}>
            Issue Detection & Reporting System
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-lg font-semibold mb-6" style={{fontFamily:'var(--font-display)'}}>
            Sign in to continue
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs mb-1.5" style={{color:'var(--text-secondary)'}}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="admin@smartcity.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  width: '100%',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{color:'var(--text-secondary)'}}>
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  width: '100%',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: '#f87171'
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#1d4ed8' : 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '13px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s, transform 0.1s',
                fontFamily: 'var(--font-display)',
                marginTop: '4px',
                letterSpacing: '0.02em'
              }}
              onMouseEnter={e => !loading && (e.target.style.opacity = '0.9')}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              {loading ? '🔄 Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center mt-6" style={{color:'var(--text-secondary)', fontSize:'0.78rem'}}>
            Demo: any email + password works
          </p>
        </div>

        {/* Footer tags */}
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          {['AI-Powered', 'Real-time Detection', 'Smart City'].map(tag => (
            <span key={tag} style={{
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '0.72rem',
              color: '#60a5fa'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
