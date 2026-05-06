import { APEX, FONT_MONO } from '@/lib/theme'
import { ScreenShell } from '@/components/shared/ScreenShell'
import { Tag } from '@/components/ui/Tag'
import { BatteryIndicator } from '@/components/ui/BatteryIndicator'
import { LinkIndicator } from '@/components/ui/LinkIndicator'

function RadialProgress({ progress }) {
  const r = 92, c = 2 * Math.PI * r
  const dash = (progress / 100) * c
  return (
    <div style={{ position: 'relative', width: 220, height: 220 }}>
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="110" cy="110" r={r} stroke={APEX.bg2} strokeWidth="6" fill="none" />
        <circle cx="110" cy="110" r={r}
          stroke="url(#radialGrad)" strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 0.4s linear', filter: `drop-shadow(0 0 12px ${APEX.cyan})` }} />
        <defs>
          <linearGradient id="radialGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={APEX.cyan} />
            <stop offset="1" stopColor={APEX.magenta} />
          </linearGradient>
        </defs>
      </svg>
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2
          const x1 = 110 + Math.cos(a) * 76, y1 = 110 + Math.sin(a) * 76
          const x2 = 110 + Math.cos(a) * 80, y2 = 110 + Math.sin(a) * 80
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={APEX.lineStrong} strokeWidth="1" />
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
          {Math.floor(progress)}<span style={{ fontSize: 22, color: APEX.textDim }}>%</span>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.16em', color: APEX.textMute, marginTop: 6 }}>
          ETA {Math.max(0, Math.ceil((100 - progress) * 0.8))}s
        </div>
      </div>
    </div>
  )
}

function LogLine({ c, children }) {
  return <span style={{ color: c, fontWeight: 600 }}>{children}</span>
}

export function FlashingScreen({ progress }) {
  const phase = progress < 25 ? 'Erasing' :
                progress < 60 ? 'Writing calibration' :
                progress < 90 ? 'Verifying checksum' :
                                'Finalizing'

  return (
    <ScreenShell>
      <div style={{ padding: '8px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag color={APEX.magenta}>FLASHING · DO NOT DISCONNECT</Tag>
        <div style={{ display: 'flex', gap: 6 }}>
          <BatteryIndicator pct={87} />
          <LinkIndicator />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', gap: 28 }}>
        <RadialProgress progress={progress} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: APEX.cyan }}>{phase}</div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
            {phase === 'Writing calibration' ? `Block ${Math.min(64, Math.floor(progress / 1.5))} / 64` :
             phase === 'Verifying checksum' ? 'Cross-checking 0xA4F2' :
             phase === 'Erasing' ? 'Clearing flash sectors' :
             'Almost there'}
          </div>
        </div>

        <div style={{
          width: '100%', maxHeight: 130, overflow: 'hidden',
          background: APEX.bg1, border: `1px solid ${APEX.line}`, borderRadius: 12,
          padding: 14, fontFamily: FONT_MONO, fontSize: 10, lineHeight: 1.7, color: APEX.textDim,
        }}>
          <LogLine c={APEX.green}>[OK]</LogLine> Bootloader unlocked · 0x4A2C
          <br /><LogLine c={APEX.green}>[OK]</LogLine> Original map backed up
          <br /><LogLine c={APEX.green}>[OK]</LogLine> Erase region 0x080000–0x0FFFFF
          <br /><LogLine c={APEX.cyan}>[..]</LogLine> Writing block {Math.min(64, Math.floor(progress / 1.5))} / 64
          <br /><LogLine c={APEX.textMute}>[ ]</LogLine> Verify · Reboot ECU
        </div>
      </div>

      <div style={{ padding: '0 22px 32px' }}>
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: APEX.magentaSoft, border: `1px solid ${APEX.magenta}55`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 2L19 17H1L10 2Z" fill="none" stroke={APEX.magenta} strokeWidth="1.5" />
            <path d="M10 8V11M10 13.5V14" stroke={APEX.magenta} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: APEX.text }}>Keep ignition ON</div>
            <div style={{ fontSize: 11, color: APEX.textDim, marginTop: 2 }}>Disconnecting may brick your ECU.</div>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}
