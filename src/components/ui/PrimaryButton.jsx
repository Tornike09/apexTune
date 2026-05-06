import { APEX, FONT_DISPLAY } from '@/lib/theme'

export function PrimaryButton({ children, onClick, disabled, danger, style }) {
  const c = danger ? APEX.magenta : APEX.cyan
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        width: '100%', height: 56, borderRadius: 14,
        background: disabled ? 'rgba(255,255,255,0.04)' : APEX.bg2,
        border: `1px solid ${disabled ? APEX.line : c + '55'}`,
        color: disabled ? APEX.textMute : APEX.text,
        fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600,
        letterSpacing: '0.02em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative', overflow: 'hidden',
        boxShadow: disabled ? 'none' : `0 0 0 1px ${c}22, 0 8px 32px -8px ${c}55`,
        ...style,
      }}>
      {!disabled && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(120% 80% at 50% 120%, ${c}33, transparent 60%)`,
        }} />
      )}
      <span style={{ position: 'relative' }}>{children}</span>
    </button>
  )
}
