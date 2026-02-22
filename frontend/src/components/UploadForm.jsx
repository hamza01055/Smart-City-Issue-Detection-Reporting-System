import { useState, useRef } from 'react'
import axios from 'axios'

export default function UploadForm({ setResult, setLoading, setError }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile]       = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef              = useRef()

  const handleFile = (f) => {
    if (!f) return
    const allowed = ['image/jpeg', 'image/png', 'image/bmp', 'image/jpg']
    if (!allowed.includes(f.type)) {
      setError('Only JPG, PNG, BMP files are allowed.')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError(null)
  }

  const onInputChange = (e) => handleFile(e.target.files[0])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await axios.post('http://localhost:8000/predict', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not connect to API. Make sure main.py is running.')
    } finally {
      setLoading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? '#3b82f6' : preview ? '#21262d' : '#30363d'}`,
          borderRadius: '16px',
          height: '220px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          background: dragging ? 'rgba(59,130,246,0.05)' : 'var(--bg-card)',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              style={{width:'100%', height:'100%', objectFit:'cover'}}
            />
            {/* Overlay */}
            <div style={{
              position:'absolute', inset:0,
              background:'rgba(6,8,16,0.5)',
              display:'flex', alignItems:'center', justifyContent:'center',
              opacity:0,
              transition:'opacity 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.opacity=1}
              onMouseLeave={e => e.currentTarget.style.opacity=0}
            >
              <span style={{color:'white', fontSize:'0.85rem', fontWeight:500}}>
                Click to change image
              </span>
            </div>
          </>
        ) : (
          <div style={{textAlign:'center', padding:'20px'}}>
            <div style={{fontSize:'2.5rem', marginBottom:'12px', opacity:0.5}}>📷</div>
            <p style={{color:'var(--text-secondary)', fontSize:'0.88rem', marginBottom:'6px'}}>
              {dragging ? 'Drop it here!' : 'Click or drag & drop an image'}
            </p>
            <p style={{color:'#30363d', fontSize:'0.75rem'}}>
              JPG · PNG · BMP supported
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.bmp"
        onChange={onInputChange}
        style={{display:'none'}}
      />

      {/* File info */}
      {file && (
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'var(--bg-elevated)',
          border:'1px solid var(--border)',
          borderRadius:'10px',
          padding:'10px 14px'
        }}>
          <div>
            <p style={{fontSize:'0.82rem', fontWeight:500, color:'var(--text-primary)'}}>
              {file.name}
            </p>
            <p style={{fontSize:'0.72rem', color:'var(--text-secondary)'}}>
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={clearFile}
            style={{
              background:'rgba(239,68,68,0.1)',
              border:'1px solid rgba(239,68,68,0.2)',
              color:'#f87171',
              borderRadius:'6px',
              padding:'4px 10px',
              fontSize:'0.75rem',
              cursor:'pointer'
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!file}
        style={{
          background: file
            ? 'linear-gradient(135deg, #2563eb, #0ea5e9)'
            : 'var(--bg-elevated)',
          color: file ? 'white' : 'var(--text-secondary)',
          border: `1px solid ${file ? 'transparent' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '14px',
          fontWeight: '700',
          fontSize: '0.95rem',
          cursor: file ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.02em'
        }}
        onMouseEnter={e => file && (e.target.style.opacity = '0.9')}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        {file ? '🔍 Detect Issue' : 'Upload an image first'}
      </button>
    </div>
  )
}
