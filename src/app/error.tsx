'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#08090C',
      color: '#F2F4F7',
      fontFamily: '"Inter", system-ui, sans-serif',
      gap: 16,
      padding: 24,
    }}>
      <div style={{ fontSize: 22, fontWeight: 600 }}>Something went wrong</div>
      <button
        onClick={() => reset()}
        style={{
          background: '#161A22',
          border: '1px solid rgba(61,216,255,0.4)',
          color: '#3DD8FF',
          padding: '12px 22px',
          borderRadius: 12,
          cursor: 'pointer',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        Try again
      </button>
    </div>
  )
}
