import { useState, useEffect } from 'react'
import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { TabBar } from '@/components/shared/TabBar'
import { Section } from '@/components/ui/Section'
import { ConnectionPill } from '@/components/ui/ConnectionPill'
import { EmptyState } from '@/components/ui/EmptyState'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { GhostButton } from '@/components/ui/GhostButton'
import { TROUBLE_CODES, SEVERITY } from '../constants'

function CodeItem({ code, expanded, onToggle }) {
  const sev = SEVERITY[code.severity]
  return (
    <div style={{
      background: APEX.bg2,
      border: `1px solid ${expanded ? sev.color + '55' : APEX.line}`,
      borderRadius: 12, overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <button onClick={onToggle} style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: 'transparent', border: 'none', padding: '14px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: sev.color, flexShrink: 0,
          boxShadow: `0 0 8px ${sev.color}`,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600, color: APEX.text, letterSpacing: '0.04em' }}>{code.code}</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: sev.color }}>{sev.label}</span>
          </div>
          <div style={{ fontSize: 12.5, color: APEX.textDim, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {code.title}
          </div>
        </div>
        <span style={{
          color: APEX.textMute, fontFamily: FONT_MONO, fontSize: 14,
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>↓</span>
      </button>

      <div style={{
        maxHeight: expanded ? 600 : 0,
        overflow: 'hidden', transition: 'max-height 0.4s ease',
      }}>
        <div style={{ padding: '0 14px 16px' }}>
          <div style={{ height: 1, background: APEX.line, marginBottom: 14 }} />
          <div style={{ fontSize: 12.5, color: APEX.text, lineHeight: 1.55 }}>{code.desc}</div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.16em', color: APEX.textMute, textTransform: 'uppercase', marginBottom: 6 }}>Possible causes</div>
            {code.causes.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: APEX.textDim, padding: '3px 0' }}>
                <span style={{ color: sev.color, fontFamily: FONT_MONO }}>·</span>
                <span>{c}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.16em', color: APEX.cyan, textTransform: 'uppercase', marginBottom: 6 }}>Suggested fixes</div>
            {code.fixes.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: APEX.textDim, padding: '3px 0' }}>
                <span style={{ color: APEX.cyan, fontFamily: FONT_MONO }}>→</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfirmSheet({ count, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(8,9,12,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'apex-rise 0.2s ease',
    }}>
      <div style={{
        width: '100%',
        background: APEX.bg1, borderTop: `1px solid ${APEX.lineStrong}`,
        borderRadius: '20px 20px 0 0',
        padding: '24px 22px 28px',
      }}>
        <div style={{ width: 36, height: 4, background: APEX.lineStrong, borderRadius: 2, margin: '0 auto 18px' }} />
        <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Clear all codes?</div>
        <div style={{ marginTop: 6, color: APEX.textDim, fontSize: 13, lineHeight: 1.5 }}>
          This will erase {count} stored codes from the ECU. Active faults will return on the next drive cycle if the underlying issue isn&apos;t fixed.
        </div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton onClick={onConfirm} danger>Clear codes</PrimaryButton>
          <GhostButton onClick={onCancel}>Cancel</GhostButton>
        </div>
      </div>
    </div>
  )
}

export function DiagnosticsScreen({ onTab, vehicle }) {
  const vehicleLabel = vehicle?.summary || 'Vehicle'
  const vinMasked = vehicle?.vin
    ? `VIN ${'●'.repeat(11)}${vehicle.vin.slice(-6)}`
    : 'VIN — — —'
  const driveLine = vehicle?.driveType || vehicle?.bodyClass || ''
  const [state, setState] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [codes, setCodes] = useState(TROUBLE_CODES)

  useEffect(() => {
    if (state !== 'scanning') return
    setProgress(0)
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(id); setState('results'); return 100 }
        return Math.min(100, p + 2)
      })
    }, 60)
    return () => clearInterval(id)
  }, [state])

  const startScan = () => { setExpanded(null); setCodes(TROUBLE_CODES); setState('scanning') }
  const clearCodes = () => { setCodes([]); setShowConfirm(false); setState('cleared') }

  return (
    <ScreenShell scroll>
      <div style={{ padding: '8px 22px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.18em', color: APEX.textMute, textTransform: 'uppercase' }}>OBD-II</div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>Diagnostics</div>
        </div>
        <ConnectionPill state="connected" />
      </div>

      <div style={{ padding: '0 22px 110px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 14,
          padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: APEX.cyanSoft, border: `1px solid ${APEX.cyan}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path d="M2 9 L3 5 Q4 3 6 3 L12 3 Q14 3 15 5 L16 9 L16 11 L13 11 Q12.5 9 11 9 Q9.5 9 9 11 L2 11 Z" stroke={APEX.cyan} strokeWidth="1.2" />
              <circle cx="5" cy="11" r="1.5" fill={APEX.cyan} />
              <circle cx="13" cy="11" r="1.5" fill={APEX.cyan} />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{vehicleLabel}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.textMute, marginTop: 2, letterSpacing: '0.06em' }}>
              {vinMasked}{driveLine ? ` · ${driveLine}` : ''}
            </div>
          </div>
        </div>

        {state === 'scanning' ? (
          <div style={{ background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: APEX.cyan }}>Scanning…</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: APEX.textDim }}>{Math.floor(progress)}%</span>
            </div>
            <div style={{ height: 3, background: APEX.bg2, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: `linear-gradient(90deg, ${APEX.cyan}, ${APEX.magenta})`,
                boxShadow: `0 0 12px ${APEX.cyan}88`,
                transition: 'width 0.2s linear',
              }} />
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.textMute, marginTop: 10, letterSpacing: '0.06em' }}>
              {progress < 30 ? 'Polling all OBD-II modules' :
               progress < 70 ? 'Reading stored DTCs' :
                                'Reading freeze-frame data'}
            </div>
          </div>
        ) : (
          <PrimaryButton onClick={startScan}>
            {state === 'cleared' || state === 'results' ? 'Re-scan vehicle' : 'Scan vehicle'}
          </PrimaryButton>
        )}

        {state === 'results' && (
          <Section
            title={`${codes.length} codes found`}
            right={
              <button onClick={() => setShowConfirm(true)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: APEX.magenta, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.1em',
                }}>CLEAR ALL</button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {codes.map(c => (
                <CodeItem key={c.code} code={c}
                  expanded={expanded === c.code}
                  onToggle={() => setExpanded(expanded === c.code ? null : c.code)} />
              ))}
            </div>
          </Section>
        )}

        {state === 'cleared' && (
          <EmptyState
            tone="ok"
            icon={<svg width="22" height="16" viewBox="0 0 22 16"><path d="M2 8L8 14L20 2" stroke={APEX.green} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            title="Codes cleared"
            body="ECU memory wiped. Re-scan after a drive cycle to confirm faults are resolved."
          />
        )}
      </div>

      <TabBar active="diag" onChange={onTab} />

      {showConfirm && <ConfirmSheet count={codes.length} onConfirm={clearCodes} onCancel={() => setShowConfirm(false)} />}
    </ScreenShell>
  )
}
