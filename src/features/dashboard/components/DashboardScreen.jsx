import { useState, useEffect } from 'react'
import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { TabBar } from '@/components/shared/TabBar'

function RadialGauge({ value, max, label, unit, color = APEX.cyan, size = 180, redline }) {
  const stroke = 10
  const r = (size - stroke) / 2
  const cx = size / 2, cy = size / 2
  const startA = -210, endA = 30
  const sweep = endA - startA
  const pct = Math.max(0, Math.min(1, value / max))
  const valueA = startA + pct * sweep

  const polar = (ang) => {
    const rad = (ang * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }
  const arcPath = (a1, a2) => {
    const [x1, y1] = polar(a1)
    const [x2, y2] = polar(a2)
    const large = a2 - a1 > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  const ticks = []
  const tickCount = 9
  for (let i = 0; i <= tickCount; i++) {
    const a = startA + (i / tickCount) * sweep
    const [x1, y1] = polar(a)
    const inner = r - 16
    const x2 = cx + inner * Math.cos((a * Math.PI) / 180)
    const y2 = cy + inner * Math.sin((a * Math.PI) / 180)
    const isRed = redline && (i / tickCount) > redline
    ticks.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isRed ? APEX.magenta : APEX.textMute} strokeOpacity={isRed ? 0.9 : 0.4} strokeWidth="1.2" />)
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`g-${label}`} x1="0" x2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={APEX.magenta} />
        </linearGradient>
      </defs>
      <path d={arcPath(startA, endA)} stroke={APEX.line} strokeWidth={stroke} fill="none" strokeLinecap="round" />
      <path d={arcPath(startA, valueA)} stroke={`url(#g-${label})`} strokeWidth={stroke} fill="none" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}aa)`, transition: 'd 0.4s' }} />
      {ticks}
      <text x={cx} y={cy - 4} fill={APEX.text} fontSize="34" fontWeight="600" textAnchor="middle" fontFamily={FONT_MONO} letterSpacing="-0.04em">
        {value}
      </text>
      <text x={cx} y={cy + 16} fill={APEX.textDim} fontSize="10" textAnchor="middle" fontFamily={FONT_MONO} letterSpacing="0.2em">
        {unit.toUpperCase()}
      </text>
      <text x={cx} y={cy + 38} fill={APEX.textMute} fontSize="9" textAnchor="middle" fontFamily={FONT_MONO} letterSpacing="0.18em">
        {label.toUpperCase()}
      </text>
    </svg>
  )
}

function MeterBar({ label, value, unit, max, accent = APEX.cyan, redZone }) {
  const pct = Math.max(0, Math.min(1, value / max))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.16em', color: APEX.textMute, textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: accent }}>
          {value}<span style={{ color: APEX.textDim, marginLeft: 3 }}>{unit}</span>
        </span>
      </div>
      <div style={{ position: 'relative', height: 4, background: APEX.bg2, borderRadius: 2, overflow: 'hidden' }}>
        {redZone && (
          <div style={{
            position: 'absolute', top: 0, bottom: 0, right: 0,
            width: `${(1 - redZone) * 100}%`,
            background: APEX.magentaSoft,
          }} />
        )}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: `${pct * 100}%`,
          background: pct > (redZone || 1.1) ? APEX.magenta : accent,
          boxShadow: `0 0 6px ${pct > (redZone || 1.1) ? APEX.magenta : accent}88`,
          transition: 'width 0.3s',
        }} />
      </div>
    </div>
  )
}

function StatusRow({ items }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px', borderRadius: 999,
          background: APEX.bg2, border: `1px solid ${APEX.line}`,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: it.color || APEX.cyan,
            boxShadow: `0 0 6px ${it.color || APEX.cyan}`,
          }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.textDim, letterSpacing: '0.08em' }}>
            {it.label} <span style={{ color: APEX.text }}>{it.value}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function DashboardScreen({ onTab, vehicle }) {
  const [state, setState] = useState('driving')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (state === 'parked') return
    const id = setInterval(() => setTick(t => t + 1), 120)
    return () => clearInterval(id)
  }, [state])

  const phase = Math.sin(tick * 0.18) * 0.5 + 0.5
  const burst = Math.max(0, Math.sin(tick * 0.4))

  let rpm, boost, throttle, gear, speed
  if (state === 'parked') {
    rpm = 850; boost = 0; throttle = 0; gear = 'N'; speed = 0
  } else if (state === 'redline') {
    rpm = 6800; boost = 22.4; throttle = 100; gear = '3'; speed = 124
  } else {
    rpm = Math.round(1800 + phase * 4200 + burst * 800)
    boost = (3 + phase * 14 + burst * 5)
    throttle = Math.round(phase * 100)
    gear = phase > 0.7 ? '4' : phase > 0.4 ? '3' : '2'
    speed = Math.round(40 + phase * 60)
  }

  const iat = (29 + phase * 5).toFixed(0)
  const coolant = (88 + Math.sin(tick * 0.05) * 3).toFixed(0)
  const oil = (94 + Math.sin(tick * 0.04 + 1) * 2).toFixed(0)
  const battery = (13.8 + Math.sin(tick * 0.02) * 0.3).toFixed(1)
  const fuel = 68

  const isRedline = rpm > 6500

  return (
    <ScreenShell scroll>
      <div style={{ padding: '8px 22px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.18em', color: APEX.textMute, textTransform: 'uppercase' }}>
            {vehicle?.shortLabel || 'Vehicle'}{vehicle?.year ? ` · ${vehicle.year}` : ''}
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>Dashboard</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', borderRadius: 999,
          background: state === 'parked' ? APEX.bg1 : APEX.cyanSoft,
          border: `1px solid ${state === 'parked' ? APEX.line : APEX.cyan + '55'}`,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: state === 'parked' ? APEX.textMute : APEX.cyan,
            boxShadow: state === 'parked' ? 'none' : `0 0 8px ${APEX.cyan}`,
            animation: state !== 'parked' ? 'apex-blink 1.4s infinite' : 'none',
          }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: state === 'parked' ? APEX.textDim : APEX.cyan, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {state === 'parked' ? 'Parked' : 'Live · 50 hz'}
          </span>
        </div>
      </div>

      <div style={{ padding: '0 22px 110px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          background: `linear-gradient(180deg, ${isRedline ? APEX.magentaSoft : APEX.cyanSoft}, transparent 80%)`,
          border: `1px solid ${isRedline ? APEX.magenta + '44' : APEX.cyan + '33'}`,
          borderRadius: 18, padding: '18px 14px 6px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 16, left: 16 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.18em', color: APEX.textMute, textTransform: 'uppercase' }}>Gear</div>
            <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.04em', fontFamily: FONT_MONO, color: isRedline ? APEX.magenta : APEX.text, lineHeight: 1, marginTop: 2 }}>{gear}</div>
          </div>
          <div style={{ position: 'absolute', top: 16, right: 16, textAlign: 'right' }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.18em', color: APEX.textMute, textTransform: 'uppercase' }}>Speed</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, justifyContent: 'flex-end', marginTop: 2 }}>
              <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', fontFamily: FONT_MONO, color: APEX.text, lineHeight: 1 }}>{speed}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: APEX.textDim }}>mph</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <RadialGauge value={rpm} max={7200} label="RPM" unit="rpm" size={200} color={isRedline ? APEX.magenta : APEX.cyan} redline={0.85} />
          </div>

          <div style={{ marginTop: 4, padding: '0 4px 8px' }}>
            <MeterBar label="Boost" value={boost.toFixed(1)} unit="psi" max={26} accent={APEX.cyan} redZone={0.85} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.16em', color: APEX.textMute, textTransform: 'uppercase' }}>Throttle</div>
            <div style={{ fontSize: 26, fontWeight: 600, fontFamily: FONT_MONO, color: APEX.cyan, marginTop: 6, letterSpacing: '-0.03em' }}>
              {throttle}<span style={{ fontSize: 14, color: APEX.textDim }}>%</span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 2 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 14, borderRadius: 1,
                  background: (i / 12) < (throttle / 100) ? APEX.cyan : APEX.bg2,
                  opacity: (i / 12) < (throttle / 100) ? 1 : 0.5,
                  boxShadow: (i / 12) < (throttle / 100) ? `0 0 4px ${APEX.cyan}` : 'none',
                  transition: 'background 0.15s',
                }} />
              ))}
            </div>
          </div>
          <div style={{ flex: 1, background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.16em', color: APEX.textMute, textTransform: 'uppercase' }}>AFR</div>
            <div style={{ fontSize: 26, fontWeight: 600, fontFamily: FONT_MONO, color: APEX.magenta, marginTop: 6, letterSpacing: '-0.03em' }}>
              {(14.7 - phase * 2.6 - burst * 1).toFixed(2)}<span style={{ fontSize: 12, color: APEX.textDim, marginLeft: 4 }}>λ</span>
            </div>
            <div style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 9, color: APEX.textMute, letterSpacing: '0.1em' }}>
              {phase + burst > 0.6 ? 'POWER · RICH' : 'CRUISE'}
            </div>
          </div>
        </div>

        <div style={{ background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.18em', color: APEX.textMute, textTransform: 'uppercase', marginBottom: 12 }}>Temperatures</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MeterBar label="Coolant" value={coolant} unit="°C" max={120} accent={APEX.cyan} redZone={0.83} />
            <MeterBar label="Oil"     value={oil}     unit="°C" max={130} accent={APEX.cyan} redZone={0.85} />
            <MeterBar label="Intake"  value={iat}     unit="°C" max={70}  accent={APEX.cyan} redZone={0.85} />
          </div>
        </div>

        <StatusRow items={[
          { label: 'BATT', value: `${battery}V`,  color: APEX.green },
          { label: 'FUEL', value: `${fuel}%`,     color: APEX.cyan },
          { label: 'TUNE', value: 'STAGE 2',      color: APEX.magenta },
          { label: 'DTC',  value: '0',            color: APEX.green },
        ]} />

        <div style={{
          background: APEX.bg2, border: `1px solid ${APEX.line}`,
          borderRadius: 10, padding: 3, display: 'flex', gap: 2,
        }}>
          {[
            { id: 'parked',   label: 'Parked' },
            { id: 'driving',  label: 'Driving' },
            { id: 'redline',  label: 'Redline' },
          ].map(s => (
            <button key={s.id} onClick={() => { setTick(0); setState(s.id) }}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 7,
                border: 'none', cursor: 'pointer',
                background: state === s.id ? APEX.cyanSoft : 'transparent',
                color: state === s.id ? APEX.cyan : APEX.textDim,
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', fontWeight: state === s.id ? 600 : 400,
              }}>{s.label}</button>
          ))}
        </div>
      </div>

      <TabBar active="dash" onChange={onTab} />
    </ScreenShell>
  )
}
