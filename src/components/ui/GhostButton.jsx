import { APEX, FONT_DISPLAY } from '@/lib/theme'

export function GhostButton({ children, onClick, style }) {
  return (
    <button onClick={onClick}
      style={{
        width: '100%', height: 56, borderRadius: 14,
        background: 'transparent',
        border: `1px solid ${APEX.lineStrong}`,
        color: APEX.text,
        fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 500,
        cursor: 'pointer',
        ...style,
      }}>{children}</button>
  )
}
