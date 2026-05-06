import { APEX, FONT_MONO } from '@/lib/theme'

export function ConnectionPill({ state }) {
  const map = {
    connected:    { color: APEX.green,    label: 'Linked' },
    connecting:   { color: APEX.amber,    label: 'Linking…' },
    disconnected: { color: APEX.textMute, label: 'Offline' },
  }
  const c = map[state]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 10px', borderRadius: 999,
      background: APEX.bg1, border: `1px solid ${APEX.line}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: c.color,
        boxShadow: state === 'connected' ? `0 0 8px ${c.color}` : 'none',
        animation: state === 'connecting' ? 'apex-blink 1s infinite' : 'none',
      }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.12em', color: APEX.textDim, textTransform: 'uppercase' }}>{c.label}</span>
    </div>
  )
}
