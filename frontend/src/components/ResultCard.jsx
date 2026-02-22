export default function ResultCard({ result }) {
  const { label, category, has_issue, confidence, all_probs } = result

  const mainColor  = has_issue ? '#ef4444' : '#22c55e'
  const mainBg     = has_issue ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)'
  const mainBorder = has_issue ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'
  const icon       = has_issue ? '⚠️' : '✅'

  const sortedProbs = Object.entries(all_probs).sort((a, b) => b[1] - a[1])

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${mainBorder}`,
      borderRadius: '16px',
      overflow: 'hidden',
      animation: 'fadeUp 0.4s ease forwards'
    }}>

      {/* Top Banner */}
      <div style={{
        background: mainBg,
        borderBottom: `1px solid ${mainBorder}`,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{fontSize:'0.72rem', color:'var(--text-secondary)', marginBottom:'4px', letterSpacing:'0.08em'}}>
            DETECTION RESULT
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: mainColor,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{icon}</span>
            <span>{label}</span>
          </div>
          <div style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginTop:'4px'}}>
            Category: <span style={{color:'var(--text-primary)'}}>{category}</span>
          </div>
        </div>

        {/* Confidence Circle */}
        <div style={{textAlign:'center'}}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            border: `3px solid ${mainColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: mainBg
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: mainColor,
              lineHeight: 1
            }}>
              {confidence}%
            </span>
          </div>
          <div style={{fontSize:'0.68rem', color:'var(--text-secondary)', marginTop:'6px'}}>
            Confidence
          </div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div style={{padding:'16px 24px 0'}}>
        <div style={{fontSize:'0.72rem', color:'var(--text-secondary)', marginBottom:'8px', letterSpacing:'0.06em'}}>
          CONFIDENCE LEVEL
        </div>
        <div style={{
          background: 'var(--bg-elevated)',
          borderRadius: '6px',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${confidence}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${mainColor}aa, ${mainColor})`,
            borderRadius: '6px',
            transition: 'width 0.8s ease'
          }} />
        </div>
      </div>

      {/* All Probabilities */}
      <div style={{padding:'16px 24px 20px'}}>
        <div style={{fontSize:'0.72rem', color:'var(--text-secondary)', marginBottom:'12px', letterSpacing:'0.06em'}}>
          ALL CLASS PROBABILITIES
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {sortedProbs.map(([cls, prob], i) => {
            const isTop = i === 0
            const barColor = isTop ? mainColor : '#3b82f6'
            return (
              <div key={cls}>
                <div style={{
                  display:'flex', justifyContent:'space-between',
                  marginBottom:'5px', alignItems:'center'
                }}>
                  <span style={{
                    fontSize:'0.82rem',
                    color: isTop ? mainColor : 'var(--text-primary)',
                    fontWeight: isTop ? 600 : 400,
                    display:'flex', alignItems:'center', gap:'6px'
                  }}>
                    {isTop && <span style={{
                      width:'6px', height:'6px', borderRadius:'50%',
                      background: mainColor, display:'inline-block'
                    }} />}
                    {cls}
                  </span>
                  <span style={{
                    fontFamily:'var(--font-display)',
                    fontSize:'0.85rem',
                    fontWeight:700,
                    color: isTop ? mainColor : 'var(--text-secondary)'
                  }}>
                    {prob.toFixed(1)}%
                  </span>
                </div>
                <div style={{
                  background:'var(--bg-elevated)',
                  borderRadius:'4px',
                  height:'5px',
                  overflow:'hidden'
                }}>
                  <div style={{
                    width:`${prob}%`,
                    height:'100%',
                    background: isTop
                      ? `linear-gradient(90deg, ${barColor}80, ${barColor})`
                      : `${barColor}50`,
                    borderRadius:'4px',
                    transition:'width 0.6s ease'
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Tag */}
      <div style={{
        borderTop:'1px solid var(--border)',
        padding:'12px 24px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <span style={{fontSize:'0.75rem', color:'var(--text-secondary)'}}>
          Model: RandomForest · 78% avg accuracy
        </span>
        <span style={{
          background: mainBg,
          border: `1px solid ${mainBorder}`,
          color: mainColor,
          borderRadius:'20px',
          padding:'3px 10px',
          fontSize:'0.72rem',
          fontWeight:600
        }}>
          {has_issue ? '🚨 Issue Found' : '✅ All Clear'}
        </span>
      </div>
    </div>
  )
}
