import { APEX, FONT_MONO } from '@/lib/theme'

export function LinkIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: APEX.bg1, border: `1px solid ${APEX.line}` }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: APEX.cyan, boxShadow: `0 0 6px ${APEX.cyan}` }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.cyan, letterSpacing: '0.1em' }}>OBD</span>
    </div>
  )
}
