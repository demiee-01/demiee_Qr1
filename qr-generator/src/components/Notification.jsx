import { useEffect, useState } from 'react'

export default function Notification({ message, type }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const borders = { success: '#10b981', error: '#ef4444', info: '#3b82f6' }
  const bgs = {
    success: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(255,255,255,0.96))',
    error:   'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(255,255,255,0.96))',
    info:    'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(255,255,255,0.96))',
  }

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, left: 'auto',
      padding: '12px 18px',
      background: bgs[type] || bgs.info,
      backdropFilter: 'blur(20px)',
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.3)',
      borderLeft: `4px solid ${borders[type] || borders.info}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      color: '#1e3c72', fontWeight: 600, fontSize: '0.85rem',
      zIndex: 9999,
      transform: visible ? 'translateX(0)' : 'translateX(420px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)',
      maxWidth: 'calc(100vw - 32px)',
      width: 'max-content',
    }}>
      {message}
    </div>
  )
}
