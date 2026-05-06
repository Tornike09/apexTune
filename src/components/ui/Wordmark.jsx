import { APEX, FONT_MONO } from '@/lib/theme'

export function Wordmark({ size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L22 20H2L12 2Z" stroke={APEX.cyan} strokeWidth="1.5" />
        <path d="M12 9L17 18H7L12 9Z" fill={APEX.cyan} fillOpacity="0.25" stroke={APEX.cyan} strokeWidth="1" />
      </svg>
      <div style={{
        fontFamily: FONT_MONO, fontSize: size * 0.7, fontWeight: 600,
        letterSpacing: '0.22em', color: APEX.text,
      }}>APEX<span style={{ color: APEX.cyan }}>·</span>TUNE</div>
    </div>
  )
}
