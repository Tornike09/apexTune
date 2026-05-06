import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { TopBar } from '@/components/shared/TopBar'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { GhostButton } from '@/components/ui/GhostButton'
import { BURBLE_LEVELS, STAGES } from '../constants'

function SummaryRow({ label, value, accent, last }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${APEX.line}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: APEX.textMute }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{value}</div>
      </div>
      {accent && <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: APEX.cyan, textAlign: 'right', maxWidth: 140 }}>{accent}</div>}
    </div>
  )
}

function CheckRow({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 16, height: 16, borderRadius: 4,
        border: `1px solid ${APEX.magenta}55`, background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8">
          <path d="M1 4L4 7L9 1" stroke={APEX.magenta} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ fontSize: 12.5, color: APEX.text }}>{text}</span>
    </div>
  )
}

export function ConfirmScreen({ state, vehicle, onConfirm, onBack }) {
  const stage = STAGES.find(s => s.key === state.stage)
  const burble = BURBLE_LEVELS[state.burble]
  const vehicleLabel = vehicle?.summary || 'Vehicle'
  return (
    <ScreenShell>
      <TopBar sub="Step 04 / 06" title="Confirm tune" />

      <div style={{ flex: 1, padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto', paddingBottom: 12 }}>
        <div style={{ background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 16, overflow: 'hidden' }}>
          <SummaryRow label="Vehicle" value={vehicleLabel} accent={vehicle?.engineHP ? `${vehicle.engineHP} hp stock` : undefined} />
          <SummaryRow label="Stage" value={stage.name} accent={`${stage.power} / ${stage.torque}`} />
          <SummaryRow label="Burble" value={burble.label} accent={burble.desc} />
          <SummaryRow label="Hidden features" value="3 enabled" last />
        </div>

        <div style={{
          background: `linear-gradient(180deg, ${APEX.magentaSoft}, transparent)`,
          border: `1px solid ${APEX.magenta}55`, borderRadius: 16,
          padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 1L15 14H1L8 1Z" fill="none" stroke={APEX.magenta} strokeWidth="1.5" />
              <path d="M8 6V9M8 11V11.5" stroke={APEX.magenta} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: APEX.magenta, fontWeight: 600 }}>
              Pre-flash checklist
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <CheckRow text="Battery above 12.4 V (charger recommended)" />
            <CheckRow text="Ignition ON · engine OFF" />
            <CheckRow text="Climate, lights and radio disabled" />
            <CheckRow text="Do not unplug or use phone during flash" />
          </div>
        </div>

        <div style={{ fontSize: 11, color: APEX.textMute, lineHeight: 1.5, fontFamily: FONT_MONO, letterSpacing: '0.04em' }}>
          By continuing you accept that calibration changes void factory powertrain warranty and may not be street-legal in your region.
        </div>
      </div>

      <div style={{ padding: '14px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton onClick={onConfirm} danger>Flash now</PrimaryButton>
        <GhostButton onClick={onBack}>Back to tune</GhostButton>
      </div>
    </ScreenShell>
  )
}
