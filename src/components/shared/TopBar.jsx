import { APEX, FONT_MONO } from '@/lib/theme'

export function TopBar({ title, sub, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 22px 14px',
    }}>
      <div>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.18em',
          color: APEX.textMute, textTransform: 'uppercase',
        }}>{sub}</div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>
          {title}
        </div>
      </div>
      {right}
    </div>
  )
}
