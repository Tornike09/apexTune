import { APEX, FONT_MONO } from '@/lib/theme'

export function DataCard({ label, value, unit, accent = APEX.cyan, big, recording }) {
  return (
    <div style={{
      background: APEX.bg2, border: `1px solid ${APEX.line}`, borderRadius: 12,
      padding: big ? 16 : 12, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: APEX.textMute }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
        <span style={{
          fontSize: big ? 32 : 24, fontWeight: 600, letterSpacing: '-0.03em',
          color: accent, fontFamily: FONT_MONO,
          transition: 'opacity 0.15s',
          opacity: recording ? 1 : 0.92,
        }}>{value}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: APEX.textDim }}>{unit}</span>
      </div>
    </div>
  )
}
