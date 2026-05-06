import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { Tag } from '@/components/ui/Tag'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

function DeltaCard({ label, value, sub }) {
  return (
    <div style={{ flex: 1, background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: APEX.textMute }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: APEX.cyan, marginTop: 6, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: APEX.textDim, marginTop: 2 }}>{sub}</div>
    </div>
  )
}

export function SuccessScreen({ onDone, vehicle, stage = 's2', stageHpDelta = 91, stageTqDelta = 118 }) {
  const baseHp = vehicle?.engineHP || 300
  const stageLabel = stage === 's1' ? 'Stage 1' : stage === 's2p' ? 'Stage 2+' : 'Stage 2'
  const backupLabel = vehicle?.calLabel
    ? `BACKUP_${vehicle.calLabel.replace(/^CAL_/, '')}`
    : 'BACKUP_PENDING'
  return (
    <ScreenShell>
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 380, height: 380, borderRadius: '50%',
        background: `radial-gradient(circle, ${APEX.green}22, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '8px 22px' }}>
        <Tag color={APEX.green}>Tune complete</Tag>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', gap: 28 }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: `radial-gradient(circle, ${APEX.green}22, transparent 70%)`,
          border: `1px solid ${APEX.green}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 60px ${APEX.green}33`,
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M10 24L20 34L38 14" stroke={APEX.green} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>Tune applied</div>
          <div style={{ marginTop: 8, color: APEX.textDim, fontSize: 14, lineHeight: 1.5 }}>
            {stageLabel} calibration is now live on your{vehicle?.summary ? ` ${vehicle.summary}` : ' ECU'}. Cycle the ignition once, then enjoy.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <DeltaCard label="Power"  value={`+${stageHpDelta} hp`} sub={`now ${baseHp + stageHpDelta} hp`} />
          <DeltaCard label="Torque" value={`+${stageTqDelta} Nm`} sub={vehicle?.engineHP ? `from ${baseHp} hp stock` : 'estimated'} />
        </div>

        <div style={{
          width: '100%', background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 12,
          padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: APEX.cyanSoft, border: `1px solid ${APEX.cyan}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8H13M9 4L13 8L9 12" stroke={APEX.cyan} strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Stock map saved</div>
            <div style={{ fontSize: 11, color: APEX.textMute, marginTop: 2 }}>Restore any time from settings</div>
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.cyan }}>{backupLabel}</span>
        </div>
      </div>

      <div style={{ padding: '0 22px 32px' }}>
        <PrimaryButton onClick={onDone}>Done</PrimaryButton>
      </div>
    </ScreenShell>
  )
}
