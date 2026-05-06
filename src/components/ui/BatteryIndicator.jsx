import { APEX, FONT_MONO } from '@/lib/theme'

export function BatteryIndicator({ pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: APEX.bg1, border: `1px solid ${APEX.line}` }}>
      <svg width="16" height="10" viewBox="0 0 16 10">
        <rect x="0.5" y="0.5" width="13" height="9" rx="1.5" stroke={APEX.green} strokeWidth="1" fill="none" />
        <rect x="2" y="2" width={9 * (pct / 100)} height="6" rx="0.5" fill={APEX.green} />
        <rect x="14" y="3" width="1.5" height="4" rx="0.5" fill={APEX.green} />
      </svg>
      <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.green, letterSpacing: '0.06em' }}>{pct}%</span>
    </div>
  )
}
