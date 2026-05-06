import { APEX, FONT_MONO } from '@/lib/theme'
import { VIN_LENGTH } from '@/lib/constants'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { Tag } from '@/components/ui/Tag'
import { Wordmark } from '@/components/ui/Wordmark'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

export function ConnectScreen({ onConnect, status = 'idle', vin, onVinChange }) {
  const validVin = (vin || '').trim().length === VIN_LENGTH
  return (
    <ScreenShell>
      <div style={{
        position: 'absolute', top: -160, left: '50%', transform: 'translateX(-50%)',
        width: 380, height: 380, borderRadius: '50%',
        background: `radial-gradient(circle, ${APEX.cyan}22, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ flex: '0 0 auto', padding: '8px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag>v 4.2.1</Tag>
        <Tag color={APEX.textDim}>OBD · BLE 5.2</Tag>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', gap: 28 }}>
        <div style={{ position: 'relative', width: 132, height: 132, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', inset: -i * 18,
              borderRadius: '50%',
              border: `1px solid ${APEX.cyan}${['44','22','11'][i]}`,
              animation: status === 'searching' ? `apex-pulse 2s ${i * 0.4}s infinite ease-out` : 'none',
            }} />
          ))}
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: `radial-gradient(circle at 50% 30%, ${APEX.cyan}33, ${APEX.bg2})`,
            border: `1px solid ${APEX.cyan}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 60px ${APEX.cyan}33, inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L22 20H2L12 2Z" stroke={APEX.cyan} strokeWidth="1.5" />
              <path d="M12 9L17 18H7L12 9Z" fill={APEX.cyan} fillOpacity="0.4" stroke={APEX.cyan} strokeWidth="1" />
            </svg>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Wordmark size={20} />
          <div style={{ marginTop: 16, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Ready to connect
          </div>
          <div style={{ marginTop: 8, color: APEX.textDim, fontSize: 14, lineHeight: 1.5, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
            Plug in your OBD adapter and turn ignition to position II without starting the engine.
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 14px', borderRadius: 999,
          background: APEX.bg1, border: `1px solid ${APEX.line}`,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: status === 'connected' ? APEX.green : status === 'searching' ? APEX.amber : APEX.textMute,
            boxShadow: status !== 'idle' ? `0 0 8px currentColor` : 'none',
            animation: status === 'searching' ? 'apex-blink 1s infinite' : 'none',
          }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: APEX.textDim }}>
            {status === 'connected' ? 'Adapter linked' : status === 'searching' ? 'Searching…' : 'Adapter offline'}
          </span>
        </div>
      </div>

      <div style={{ padding: '0 22px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{
            display: 'block', fontFamily: FONT_MONO, fontSize: 9,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: APEX.textMute, marginBottom: 8,
          }}>
            Vehicle VIN
          </label>
          <input
            value={vin ?? ''}
            onChange={(e) => onVinChange?.(e.target.value.toUpperCase())}
            placeholder="17-character VIN"
            maxLength={VIN_LENGTH}
            spellCheck={false}
            autoComplete="off"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: APEX.bg2, border: `1px solid ${validVin ? APEX.cyan + '55' : APEX.lineStrong}`,
              borderRadius: 12, padding: '14px 16px',
              color: APEX.text, fontFamily: FONT_MONO,
              fontSize: 14, letterSpacing: '0.08em',
              outline: 'none', textTransform: 'uppercase',
              transition: 'border-color 0.15s',
            }}
          />
          <div style={{
            marginTop: 6, fontFamily: FONT_MONO, fontSize: 10,
            letterSpacing: '0.08em',
            color: validVin ? APEX.cyan : APEX.textMute,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>{validVin ? '✓ READY · NHTSA WILL DECODE' : 'ENTER 17 CHARACTERS'}</span>
            <span>{(vin || '').length} / {VIN_LENGTH}</span>
          </div>
        </div>

        <PrimaryButton onClick={onConnect} disabled={!validVin}>
          {status === 'searching' ? 'Searching for vehicle…' : 'Connect to vehicle'}
        </PrimaryButton>
      </div>
    </ScreenShell>
  )
}
