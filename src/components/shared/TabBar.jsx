import { APEX, FONT_MONO } from '@/lib/theme'

export function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'dash',  label: 'Dashboard',   icon: <><path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" /><path d="M12 13L15.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="12" cy="13" r="1.4" fill="currentColor" /></> },
    { id: 'tune',  label: 'Tune',        icon: <path d="M3 12h4l2-7 4 14 2-7h4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: 'diag',  label: 'Diagnostics', icon: <><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" fill="none" /><path d="M12 7.5V12.5M12 15V15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></> },
    { id: 'logs',  label: 'Logs',        icon: <><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" /><path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></> },
  ]
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 28,
      background: 'rgba(14,17,22,0.85)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${APEX.line}`,
      borderRadius: 18,
      padding: '8px 6px',
      display: 'flex', justifyContent: 'space-around',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active
        return (
          <button key={t.id} onClick={() => onChange?.(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 0', cursor: 'pointer',
            color: isActive ? APEX.cyan : APEX.textMute,
            background: 'transparent', border: 'none',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24">{t.icon}</svg>
            <span style={{
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              fontWeight: isActive ? 600 : 400,
            }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
