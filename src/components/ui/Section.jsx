import { APEX } from '@/lib/theme'

export function Section({ title, right, children }) {
  return (
    <div style={{ background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 16, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.02em' }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  )
}
