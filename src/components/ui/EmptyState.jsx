import { APEX, FONT_MONO } from '@/lib/theme'
import { PrimaryButton } from './PrimaryButton'

export function EmptyState({ tone, icon, title, body, cta, onCta, muted }) {
  const colorMap = { ok: APEX.green, warn: APEX.amber, error: APEX.magenta, neutral: APEX.cyan }
  const c = colorMap[tone] || APEX.cyan
  return (
    <div style={{
      background: APEX.bg1, border: `1px solid ${c}33`, borderRadius: 14,
      padding: '24px 18px', textAlign: 'center',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: `radial-gradient(circle, ${c}22, transparent 70%)`,
        border: `1px solid ${c}55`,
        margin: '0 auto 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ marginTop: 6, color: APEX.textDim, fontSize: 13, lineHeight: 1.5, maxWidth: 280, margin: '6px auto 0' }}>{body}</div>
      {muted && <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.textMute, marginTop: 10, letterSpacing: '0.1em' }}>{muted}</div>}
      {cta && (
        <div style={{ marginTop: 16 }}>
          <PrimaryButton onClick={onCta} danger={tone === 'error'}>{cta}</PrimaryButton>
        </div>
      )}
    </div>
  )
}
