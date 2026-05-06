import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { Tag } from '@/components/ui/Tag'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { GhostButton } from '@/components/ui/GhostButton'

export function FailureScreen({ onRetry, onRestore }) {
  return (
    <ScreenShell>
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 380, height: 380, borderRadius: '50%',
        background: `radial-gradient(circle, ${APEX.magenta}22, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '8px 22px' }}>
        <Tag color={APEX.magenta}>Flash failed</Tag>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', gap: 24 }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: `radial-gradient(circle, ${APEX.magenta}22, transparent 70%)`,
          border: `1px solid ${APEX.magenta}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 60px ${APEX.magenta}33`,
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M14 14L34 34M34 14L14 34" stroke={APEX.magenta} strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Connection lost</div>
          <div style={{ marginTop: 8, color: APEX.textDim, fontSize: 14, lineHeight: 1.5, maxWidth: 300 }}>
            We couldn&apos;t verify the new calibration. Your stock map has been automatically restored — your car is safe to drive.
          </div>
        </div>

        <div style={{
          width: '100%', background: APEX.bg1, border: `1px solid ${APEX.magenta}33`, borderRadius: 12,
          padding: 14, fontFamily: FONT_MONO, fontSize: 11, lineHeight: 1.7,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: APEX.textMute, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
            <span>Error trace</span>
            <span>13:42:08</span>
          </div>
          <div style={{ color: APEX.magenta }}>ECU_TIMEOUT · 0xE204</div>
          <div style={{ color: APEX.textDim, marginTop: 2 }}>No response after block 47 / 64</div>
          <div style={{ color: APEX.textDim }}>Auto-rollback completed at 13:42:11</div>
        </div>
      </div>

      <div style={{ padding: '14px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton onClick={onRetry}>Retry flash</PrimaryButton>
        <GhostButton onClick={onRestore}>Verify stock restore</GhostButton>
      </div>
    </ScreenShell>
  )
}
