'use client'
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react'
import { APEX } from '@/lib/theme'
import { ConnectScreen } from '@/features/connect/components/ConnectScreen'
import { ScanningScreen } from '@/features/scanning/components/ScanningScreen'
import { decodeVin } from '@/features/scanning/services'
import { TuningScreen } from '@/features/tuning/components/TuningScreen'
import { ConfirmScreen } from '@/features/tuning/components/ConfirmScreen'
import { FlashingScreen } from '@/features/tuning/components/FlashingScreen'
import { SuccessScreen } from '@/features/tuning/components/SuccessScreen'
import { FailureScreen } from '@/features/tuning/components/FailureScreen'
import { DashboardScreen } from '@/features/dashboard/components/DashboardScreen'
import { DiagnosticsScreen } from '@/features/diagnostics/components/DiagnosticsScreen'
import { LogsScreen } from '@/features/logs/components/LogsScreen'

// Stage power deltas — applied on top of vehicle.engineHP if NHTSA has it.
const STAGE_HP_DELTA = { s1: 62, s2: 91, s2p: 118 }
const STAGE_TQ_DELTA = { s1: 78, s2: 118, s2p: 148 }

export default function Home() {
  const [screen, setScreen] = useState('connect')
  const [vin, setVin] = useState('')

  // Fully-decoded vehicle object from NHTSA. Populated after Scanning,
  // shared across every downstream screen. Typed as `any` since the
  // service layer (JS) defines the shape; consumers read fields defensively.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vehicle, setVehicle] = useState<any>(null)

  const [tune, setTune] = useState({ stage: 's2', burble: 1, hiddenOpen: false })
  const [scanProgress, setScanProgress] = useState(0)
  const [flashProgress, setFlashProgress] = useState(0)

  // Drive scanning animation; decode VIN via NHTSA in parallel and lift
  // the result into top-level `vehicle` state so all screens can read it.
  useEffect(() => {
    if (screen !== 'scanning') return
    setScanProgress(0)
    setVehicle(null)

    let cancelled = false
    decodeVin(vin)
      .then((info) => { if (!cancelled) setVehicle(info) })
      .catch(() => {})

    const id = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(id)
          setTimeout(() => { if (!cancelled) setScreen('dash') }, 600)
          return 100
        }
        return Math.min(100, p + 2)
      })
    }, 60)
    return () => { cancelled = true; clearInterval(id) }
  }, [screen, vin])

  useEffect(() => {
    if (screen !== 'flashing') return
    setFlashProgress(0)
    const id = setInterval(() => {
      setFlashProgress((p) => {
        if (p >= 100) { clearInterval(id); setTimeout(() => setScreen('success'), 400); return 100 }
        return Math.min(100, p + 1.5)
      })
    }, 90)
    return () => clearInterval(id)
  }, [screen])

  const handleTuneSet = useCallback((patch: { goTo?: string; stage?: string; burble?: number; hiddenOpen?: boolean }) => {
    if (patch.goTo === 'confirm') { setScreen('confirm'); return }
    setTune((t) => ({ ...t, ...patch }))
  }, [])

  const handleTab = useCallback((id: string) => setScreen(id), [])

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: APEX.bg0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(0px, 4vw, 40px)',
    }}>
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 420,
        height: 'min(92vh, 880px)',
        background: APEX.bg0,
        borderRadius: 'clamp(0px, 4vw, 40px)',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
      }}>
        {screen === 'connect' && (
          <ConnectScreen vin={vin} onVinChange={setVin} onConnect={() => setScreen('scanning')} status="idle" />
        )}
        {screen === 'scanning' && (
          <ScanningScreen progress={scanProgress} vehicle={vehicle} vin={vin} />
        )}
        {screen === 'dash' && <DashboardScreen onTab={handleTab} vehicle={vehicle} />}
        {screen === 'tune' && <TuningScreen state={tune} set={handleTuneSet} vehicle={vehicle} />}
        {screen === 'diag' && <DiagnosticsScreen onTab={handleTab} vehicle={vehicle} />}
        {screen === 'logs' && <LogsScreen onTab={handleTab} />}
        {screen === 'confirm' && (
          <ConfirmScreen
            state={tune}
            vehicle={vehicle}
            onConfirm={() => setScreen('flashing')}
            onBack={() => setScreen('tune')}
          />
        )}
        {screen === 'flashing' && <FlashingScreen progress={flashProgress} />}
        {screen === 'success' && (
          <SuccessScreen
            vehicle={vehicle}
            stage={tune.stage}
            stageHpDelta={STAGE_HP_DELTA[tune.stage as 's1' | 's2' | 's2p']}
            stageTqDelta={STAGE_TQ_DELTA[tune.stage as 's1' | 's2' | 's2p']}
            onDone={() => setScreen('dash')}
          />
        )}
        {screen === 'failure' && (
          <FailureScreen onRetry={() => setScreen('flashing')} onRestore={() => setScreen('dash')} />
        )}
      </div>
    </div>
  )
}
