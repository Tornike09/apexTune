import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { TopBar } from '@/components/shared/TopBar'

function CarSilhouette({ progress }) {
  return (
    <div style={{ position: 'relative', width: 280, height: 110 }}>
      <svg width="280" height="110" viewBox="0 0 280 110" fill="none">
        <defs>
          <linearGradient id="carBody" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={APEX.cyan} stopOpacity="0.35" />
            <stop offset="1" stopColor={APEX.cyan} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d="M18 78 Q24 58 50 56 L82 36 Q98 26 130 24 L170 24 Q198 26 218 42 L246 56 Q264 60 268 76 L268 86 Q268 92 260 92 L232 92 Q228 78 214 78 Q200 78 196 92 L86 92 Q82 78 68 78 Q54 78 50 92 L22 92 Q14 92 14 86 Z"
          fill="url(#carBody)" stroke={APEX.cyan} strokeWidth="1.2" strokeOpacity="0.7" />
        <path d="M92 40 L130 28 L170 28 L208 44 Z" fill={APEX.bg0} stroke={APEX.cyan} strokeWidth="1" strokeOpacity="0.5" />
        <line x1="148" y1="28" x2="148" y2="44" stroke={APEX.cyan} strokeOpacity="0.4" />
        <circle cx="68" cy="92" r="11" fill={APEX.bg0} stroke={APEX.cyan} strokeWidth="1.5" />
        <circle cx="68" cy="92" r="5" fill={APEX.cyan} fillOpacity="0.3" />
        <circle cx="214" cy="92" r="11" fill={APEX.bg0} stroke={APEX.cyan} strokeWidth="1.5" />
        <circle cx="214" cy="92" r="5" fill={APEX.cyan} fillOpacity="0.3" />
      </svg>
      <div style={{
        position: 'absolute', top: 8, bottom: 8,
        left: `${10 + progress * 0.7}%`,
        width: 2, background: APEX.cyan,
        boxShadow: `0 0 20px ${APEX.cyan}, 0 0 40px ${APEX.cyan}`,
        transition: 'left 0.4s linear',
      }} />
      <div style={{
        position: 'absolute', top: 8, bottom: 8, left: 0,
        width: `${10 + progress * 0.7}%`,
        background: `linear-gradient(90deg, transparent, ${APEX.cyan}22)`,
        pointerEvents: 'none',
      }} />
    </div>
  )
}

function DetectedRow({ label, value, delay, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0',
      borderBottom: last ? 'none' : `1px solid ${APEX.line}`,
      opacity: value ? 1 : 0.3,
      transition: `opacity 0.5s ${delay * 0.15}s`,
    }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: APEX.textDim, letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: APEX.text }}>{value || '— — —'}</span>
    </div>
  )
}

export function ScanningScreen({ progress, vin, vehicle }) {
  // While vehicle is still loading, show the entered VIN immediately and
  // dim the rest. Once NHTSA returns, every row populates from real data.
  const detected = {
    vin: vin || '',
    model: vehicle?.summary || '',
    engine: vehicle?.displacementL && vehicle?.cylinders
      ? `${vehicle.displacementL}L · ${vehicle.cylinders} cyl`
      : '',
    fuel: vehicle?.fuelType || '',
    plant: vehicle?.plantCity && vehicle?.plantCountry
      ? `${vehicle.plantCity}, ${vehicle.plantCountry}`
      : (vehicle?.plantCountry || ''),
    ecu: vehicle?.ecuLabel || '',
    cal: vehicle?.calLabel || '',
  }
  return (
    <ScreenShell>
      <TopBar sub="Diagnostics" title="Scanning ECU" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '0 24px' }}>
        <CarSilhouette progress={progress} />

        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: APEX.cyan }}>
            {progress < 30 ? 'Probing CAN bus' :
             progress < 65 ? 'Reading ECU identifier' :
             progress < 95 ? 'Verifying calibration' :
                              'Scan complete'}
          </div>
          <div style={{
            marginTop: 14, height: 3, background: APEX.bg2, borderRadius: 2, overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${APEX.cyan}, ${APEX.magenta})`,
              transition: 'width 0.4s linear',
              boxShadow: `0 0 12px ${APEX.cyan}88`,
            }} />
          </div>
          <div style={{ marginTop: 10, fontFamily: FONT_MONO, fontSize: 11, color: APEX.textMute, display: 'flex', justifyContent: 'space-between' }}>
            <span>{String(progress).padStart(2, '0')}%</span>
            <span>OBD-II · ISO 15765-4</span>
          </div>
        </div>

        <div style={{
          width: '100%', background: APEX.bg1,
          border: `1px solid ${APEX.line}`, borderRadius: 14,
          padding: 16,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.18em', color: APEX.textMute, textTransform: 'uppercase' }}>Detected</div>
          <DetectedRow label="VIN"         value={detected.vin}    delay={0} />
          <DetectedRow label="Vehicle"     value={detected.model}  delay={1} />
          <DetectedRow label="Engine"      value={detected.engine} delay={2} />
          <DetectedRow label="Fuel"        value={detected.fuel}   delay={3} />
          <DetectedRow label="Built in"    value={detected.plant}  delay={4} />
          <DetectedRow label="ECU"         value={detected.ecu}    delay={5} />
          <DetectedRow label="Calibration" value={detected.cal}    delay={6} last />
        </div>
      </div>

      <div style={{ padding: 22, color: APEX.textMute, fontFamily: FONT_MONO, fontSize: 11, textAlign: 'center', letterSpacing: '0.1em' }}>
        ⚠ KEEP IGNITION ON · DO NOT START ENGINE
      </div>
    </ScreenShell>
  )
}
