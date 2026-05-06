import { APEX, FONT_DISPLAY } from '@/lib/theme'

export function ScreenShell({ children, scroll = false }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: APEX.bg0,
      color: APEX.text,
      fontFamily: FONT_DISPLAY,
      display: 'flex', flexDirection: 'column',
      overflow: scroll ? 'auto' : 'hidden',
      position: 'relative',
    }}>{children}</div>
  )
}
