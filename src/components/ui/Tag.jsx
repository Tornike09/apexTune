import { APEX, FONT_MONO } from '@/lib/theme'

export function Tag({ children, color = APEX.cyan, style }) {
  return (
    <span style={{
      fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.14em',
      textTransform: 'uppercase', color,
      padding: '4px 8px', borderRadius: 4,
      background: color === APEX.cyan ? APEX.cyanSoft
                 : color === APEX.magenta ? APEX.magentaSoft
                 : 'rgba(255,255,255,0.06)',
      border: `1px solid ${color}33`,
      ...style,
    }}>{children}</span>
  )
}
