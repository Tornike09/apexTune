import { useState, useMemo } from 'react'
import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { TabBar } from '@/components/shared/TabBar'
import { DataCard } from '@/components/ui/DataCard'
import { SAVED_LOGS } from '../data'

function PreviewSpark({ data, height = 24, color = APEX.cyan }) {
  const N = Math.min(80, data.length)
  const step = Math.floor(data.length / N) || 1
  const pts = []
  for (let i = 0; i < N; i++) pts.push(data[i * step]?.boost || 0)
  const max = Math.max(...pts), min = Math.min(...pts)
  const W = 280
  const path = pts.map((v, i) => {
    const x = (i / (N - 1)) * W
    const y = height - ((v - min) / (max - min || 1)) * height
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d={path} stroke={color} strokeOpacity="0.7" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

function LogItem({ log, onOpen }) {
  return (
    <button onClick={onOpen}
      style={{
        position: 'relative', width: '100%', textAlign: 'left', cursor: 'pointer',
        background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 14,
        padding: 16,
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}>{log.name}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.textMute, marginTop: 4, letterSpacing: '0.06em' }}>
            {log.date} · {log.duration}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600, color: APEX.cyan }}>{log.maxBoost} psi</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: APEX.textMute, marginTop: 2, letterSpacing: '0.1em' }}>PEAK BOOST</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <PreviewSpark data={log.data} />
      </div>
    </button>
  )
}

function StatChip({ label, value, unit, accent }) {
  return (
    <div style={{ flex: 1, background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 12, padding: 12 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.16em', color: APEX.textMute, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', fontFamily: FONT_MONO, color: accent }}>{value}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.textDim }}>{unit}</span>
      </div>
    </div>
  )
}

function Chart({ data, field, color, range }) {
  const W = 320, H = 160, P = 8
  const N = data.length
  const [lo, hi] = range
  const pts = data.map((d, i) => {
    const x = P + (i / (N - 1)) * (W - 2 * P)
    const y = P + (1 - (d[field] - lo) / (hi - lo)) * (H - 2 * P)
    return [x, y]
  })
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${path} L ${pts[pts.length - 1][0]} ${H - P} L ${P} ${H - P} Z`

  const grid = []
  for (let i = 0; i <= 4; i++) {
    const y = P + (i / 4) * (H - 2 * P)
    grid.push(<line key={i} x1={P} y1={y} x2={W - P} y2={y} stroke={APEX.line} strokeWidth="1" strokeDasharray="2 4" />)
    const v = lo + (1 - i / 4) * (hi - lo)
    grid.push(<text key={`t${i}`} x={W - P - 2} y={y - 2} fill={APEX.textMute} fontSize="8" fontFamily={FONT_MONO} textAnchor="end" letterSpacing="0.06em">{v.toFixed(0)}</text>)
  }

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`area-${field}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid}
      <path d={area} fill={`url(#area-${field})`} />
      <path d={path} stroke={color} strokeWidth="1.6" fill="none"
        style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'd 0.4s' }} />
    </svg>
  )
}

function LogDetail({ log, onBack }) {
  const [param, setParam] = useState('boost')
  const stats = useMemo(() => {
    const arr = log.data
    return {
      maxBoost: Math.max(...arr.map(d => d.boost)).toFixed(1),
      maxIat:   Math.max(...arr.map(d => d.iat)).toFixed(0),
      avgAfr:   (arr.reduce((s, d) => s + d.afr, 0) / arr.length).toFixed(2),
      maxTps:   Math.max(...arr.map(d => d.tps)).toFixed(0),
    }
  }, [log])
  const PARAMS = {
    boost:  { label: 'Boost',     unit: 'psi', color: APEX.cyan,    range: [0, 26] },
    afr:    { label: 'AFR',       unit: 'λ',   color: APEX.magenta, range: [10, 16] },
    timing: { label: 'Ignition',  unit: '°',   color: APEX.amber,   range: [-2, 22] },
  }
  return (
    <>
      <div style={{ padding: '8px 22px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{
          width: 32, height: 32, borderRadius: 8,
          background: APEX.bg2, border: `1px solid ${APEX.line}`,
          color: APEX.text, cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.18em', color: APEX.textMute, textTransform: 'uppercase' }}>{log.date} · {log.duration}</div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>{log.name}</div>
        </div>
      </div>

      <div style={{ padding: '0 22px 110px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <StatChip label="Max boost" value={stats.maxBoost} unit="psi" accent={APEX.cyan} />
          <StatChip label="Max IAT"   value={stats.maxIat}   unit="°C"  accent={APEX.amber} />
          <StatChip label="Avg AFR"   value={stats.avgAfr}   unit="λ"   accent={APEX.magenta} />
        </div>

        <div style={{ background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 14, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Trace</div>
            <div style={{
              display: 'flex', gap: 2,
              background: APEX.bg2, border: `1px solid ${APEX.line}`,
              borderRadius: 8, padding: 2,
            }}>
              {Object.keys(PARAMS).map(k => (
                <button key={k} onClick={() => setParam(k)}
                  style={{
                    padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                    border: 'none',
                    background: param === k ? PARAMS[k].color + '22' : 'transparent',
                    color: param === k ? PARAMS[k].color : APEX.textDim,
                    fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.08em',
                    textTransform: 'uppercase', fontWeight: param === k ? 600 : 400,
                  }}>{PARAMS[k].label}</button>
              ))}
            </div>
          </div>

          <Chart data={log.data} field={param} color={PARAMS[param].color} range={PARAMS[param].range} />

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 9, color: APEX.textMute, letterSpacing: '0.1em' }}>
            <span>0:00</span>
            <span>{log.duration}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <DataCard label="Throttle peak" value={stats.maxTps}     unit="%"   accent={APEX.cyan} />
          <DataCard label="Samples"       value={log.data.length}  unit="pts" accent={APEX.cyan} />
        </div>
      </div>
    </>
  )
}

export function LogsScreen({ onTab }) {
  const [openLog, setOpenLog] = useState(null)
  if (openLog) {
    return (
      <ScreenShell scroll>
        <LogDetail log={openLog} onBack={() => setOpenLog(null)} />
        <TabBar active="logs" onChange={onTab} />
      </ScreenShell>
    )
  }
  return (
    <ScreenShell scroll>
      <div style={{ padding: '8px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.18em', color: APEX.textMute, textTransform: 'uppercase' }}>Sessions · {SAVED_LOGS.length}</div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>Logs</div>
        </div>
        <button style={{
          background: APEX.bg2, border: `1px solid ${APEX.line}`, borderRadius: 10,
          padding: '8px 12px', color: APEX.cyan, cursor: 'pointer',
          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.08em',
        }}>+ NEW</button>
      </div>

      <div style={{ padding: '0 22px 110px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SAVED_LOGS.map(log => (
          <LogItem key={log.id} log={log} onOpen={() => setOpenLog(log)} />
        ))}
        <div style={{ marginTop: 12, fontFamily: FONT_MONO, fontSize: 10, color: APEX.textMute, textAlign: 'center', letterSpacing: '0.1em' }}>
          ⓘ TAP A LOG FOR DETAILS
        </div>
      </div>

      <TabBar active="logs" onChange={onTab} />
    </ScreenShell>
  )
}
