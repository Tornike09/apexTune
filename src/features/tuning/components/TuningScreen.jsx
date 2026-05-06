import { useState } from 'react'
import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { TopBar } from '@/components/shared/TopBar'
import { Tag } from '@/components/ui/Tag'
import { Section } from '@/components/ui/Section'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { BURBLE_LEVELS, STAGES } from '../constants'

function Gauge({ value }) {
  const r = 28
  const c = Math.PI * r
  const dash = c * value
  return (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <path d={`M 12 44 A ${r} ${r} 0 0 1 68 44`} stroke={APEX.bg2} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M 12 44 A ${r} ${r} 0 0 1 68 44`}
        stroke="url(#gaugeGrad)" strokeWidth="6" fill="none" strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`} />
      <defs>
        <linearGradient id="gaugeGrad" x1="0" x2="1">
          <stop offset="0" stopColor={APEX.cyan} />
          <stop offset="1" stopColor={APEX.magenta} />
        </linearGradient>
      </defs>
    </svg>
  )
}

function BurbleSlider({ value, onChange }) {
  const PAD = 16
  const DOT = 24
  return (
    <div style={{ position: 'relative', paddingLeft: PAD, paddingRight: PAD }}>
      <div style={{ position: 'relative', height: DOT + 8 }}>
        <div style={{
          position: 'absolute', left: 0, right: 0,
          top: '50%', transform: 'translateY(-50%)',
          height: 2, background: APEX.bg2, borderRadius: 1,
        }} />
        <div style={{
          position: 'absolute', left: 0,
          top: '50%', transform: 'translateY(-50%)',
          width: `${(value / 3) * 100}%`,
          height: 2,
          background: `linear-gradient(90deg, ${APEX.cyan}, ${APEX.magenta})`,
          borderRadius: 1,
          boxShadow: `0 0 10px ${APEX.cyan}88`,
          transition: 'width 0.2s',
        }} />
        {BURBLE_LEVELS.map((b, i) => {
          const active = i <= value
          const isCurrent = i === value
          const accent = i >= 2 ? APEX.magenta : APEX.cyan
          const pct = (i / 3) * 100
          return (
            <button key={b.key} onClick={() => onChange(i)}
              style={{
                position: 'absolute',
                left: `${pct}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: DOT, height: DOT, borderRadius: '50%',
                border: `2px solid ${active ? (isCurrent ? accent : accent + '88') : APEX.lineStrong}`,
                background: isCurrent ? accent : active ? accent + '33' : APEX.bg2,
                cursor: 'pointer', padding: 0,
                boxShadow: isCurrent ? `0 0 16px ${accent}` : 'none',
                transition: 'all 0.2s',
              }} />
          )
        })}
      </div>
      <div style={{ position: 'relative', height: 16, marginTop: 6 }}>
        {BURBLE_LEVELS.map((b, i) => {
          const accent = i >= 2 ? APEX.magenta : APEX.cyan
          const pct = (i / 3) * 100
          return (
            <div key={b.key} style={{
              position: 'absolute',
              left: `${pct}%`,
              transform: 'translateX(-50%)',
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: i === value ? accent : APEX.textMute,
              fontWeight: i === value ? 600 : 400,
              whiteSpace: 'nowrap',
            }}>{b.label}</div>
          )
        })}
      </div>
    </div>
  )
}

function StageCard({ stage, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: active ? APEX.cyanSoft : APEX.bg2,
        border: `1px solid ${active ? APEX.cyan : APEX.line}`,
        borderRadius: 12, padding: 14,
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.2s',
        boxShadow: active ? `0 0 0 1px ${APEX.cyan}55, 0 8px 24px -8px ${APEX.cyan}55` : 'none',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: APEX.text }}>{stage.name}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: APEX.textMute, marginTop: 2, letterSpacing: '0.06em' }}>{stage.note}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: active ? APEX.cyan : APEX.text }}>{stage.power}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: APEX.textDim, marginTop: 2 }}>{stage.torque}</div>
        </div>
      </div>
    </button>
  )
}

function ToggleRow({ name, desc, initial }) {
  const [on, setOn] = useState(initial)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: `1px solid ${APEX.line}`,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 11, color: APEX.textMute, marginTop: 2 }}>{desc}</div>
      </div>
      <button onClick={() => setOn(!on)}
        style={{
          width: 44, height: 26, borderRadius: 999, padding: 2,
          border: `1px solid ${on ? APEX.cyan : APEX.lineStrong}`,
          background: on ? APEX.cyanSoft : 'transparent',
          cursor: 'pointer', transition: 'all 0.2s',
        }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          background: on ? APEX.cyan : APEX.textMute,
          marginLeft: on ? 18 : 0, transition: 'margin 0.2s',
          boxShadow: on ? `0 0 8px ${APEX.cyan}` : 'none',
        }} />
      </button>
    </div>
  )
}

const STAGE_HP_DELTA = { s1: 62, s2: 91, s2p: 118 }

export function TuningScreen({ state, set, vehicle }) {
  const burbleIntensity = BURBLE_LEVELS[state.burble].intensity
  const baseHp = vehicle?.engineHP || 300
  const delta = STAGE_HP_DELTA[state.stage] ?? STAGE_HP_DELTA.s2
  return (
    <ScreenShell scroll>
      <TopBar
        sub={vehicle?.tuneSub || vehicle?.summary || 'Connecting…'}
        title="Tune"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: APEX.bg1, border: `1px solid ${APEX.line}` }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: APEX.green, boxShadow: `0 0 8px ${APEX.green}` }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.12em', color: APEX.textDim, textTransform: 'uppercase' }}>Linked</span>
          </div>
        }
      />

      <div style={{ padding: '0 22px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{
          background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 16,
          padding: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 80% at 100% 0%, ${APEX.cyan}11, transparent 50%)`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.16em', color: APEX.textMute, textTransform: 'uppercase' }}>Projected output</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                <span style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em' }}>
                  {baseHp + delta}
                </span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: APEX.textDim }}>hp</span>
              </div>
              <div style={{ marginTop: 2, fontFamily: FONT_MONO, fontSize: 11, color: APEX.cyan }}>
                +{delta} over stock {vehicle?.engineHP ? `(${baseHp} hp)` : ''}
              </div>
            </div>
            <Gauge value={state.stage === 's1' ? 0.55 : state.stage === 's2' ? 0.78 : 0.95} />
          </div>
        </div>

        <Section
          title="Burble"
          right={<Tag color={burbleIntensity > 0.7 ? APEX.magenta : APEX.cyan}>{BURBLE_LEVELS[state.burble].label}</Tag>}
        >
          <div style={{ fontSize: 11, color: APEX.textMute, marginTop: -8, marginBottom: 12, fontFamily: FONT_MONO, letterSpacing: '0.04em' }}>
            Popcorn-style pops &amp; crackle on lift-off
          </div>
          <BurbleSlider value={state.burble} onChange={(v) => set({ burble: v })} />
          <div style={{ marginTop: 10, fontSize: 12, color: APEX.textDim }}>
            {BURBLE_LEVELS[state.burble].desc}
          </div>
        </Section>

        <Section title="Performance stage">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STAGES.map(s => (
              <StageCard key={s.key} stage={s} active={state.stage === s.key} onClick={() => set({ stage: s.key })} />
            ))}
          </div>
        </Section>

        <Section
          title="Hidden features"
          right={
            <button onClick={() => set({ hiddenOpen: !state.hiddenOpen })}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: APEX.cyan, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.1em',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              {state.hiddenOpen ? 'COLLAPSE' : 'EXPAND'}
              <span style={{ display: 'inline-block', transform: state.hiddenOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>↓</span>
            </button>
          }
        >
          <div style={{
            maxHeight: state.hiddenOpen ? 600 : 0,
            overflow: 'hidden', transition: 'max-height 0.4s ease',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
              {[
                ['Launch control display',    'Shows in cluster',      true],
                ['Auto start/stop disabled',  'Saves you tapping it',  true],
                ['Sport+ default',            'On every cold start',   false],
                ['Drive select shortcut',     'Hold steering button',  false],
                ['Cluster boost gauge',       'Replaces eco meter',    true],
                ['Seat-belt chime delete',    'Track use only',        false],
              ].map(([name, desc, on], i) => (
                <ToggleRow key={i} name={name} desc={desc} initial={on} />
              ))}
            </div>
          </div>
          {!state.hiddenOpen && (
            <div style={{ fontSize: 12, color: APEX.textMute, marginTop: 4 }}>
              6 advanced options · coding-level changes
            </div>
          )}
        </Section>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 22px 22px',
        background: `linear-gradient(180deg, transparent, ${APEX.bg0} 30%)`,
        backdropFilter: 'blur(8px)',
      }}>
        <PrimaryButton onClick={() => set({ goTo: 'confirm' })}>
          Apply tune →
        </PrimaryButton>
      </div>
    </ScreenShell>
  )
}
