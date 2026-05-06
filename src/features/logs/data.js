function genLogData(seed = 1, n = 240) {
  const data = []
  for (let i = 0; i < n; i++) {
    const t = i / n
    const phase = Math.sin(t * Math.PI * 6 + seed) * 0.5 + 0.5
    const burst = Math.max(0, Math.sin(t * 14 + seed * 2))
    data.push({
      time: i * 100,
      boost: 4 + phase * 18 + burst * 6,
      afr: 14.7 - phase * 3 - burst * 1.4,
      timing: 6 + phase * 12 - burst * 2,
      iat: 28 + Math.sin(t * 2 + seed) * 6 + t * 4,
      coolant: 88 + Math.sin(t * 1.4 + seed) * 4,
      tps: phase * 100,
    })
  }
  return data
}

export const SAVED_LOGS = [
  { id: 'l1', name: 'Pull · 3rd gear',     date: 'May 4 · 16:42',  duration: '0:24', maxBoost: 21.8, data: genLogData(1, 240) },
  { id: 'l2', name: 'Highway pull',        date: 'May 2 · 09:15',  duration: '0:38', maxBoost: 19.4, data: genLogData(3, 380) },
  { id: 'l3', name: 'Stage 2 first run',   date: 'Apr 28 · 19:02', duration: '1:12', maxBoost: 23.1, data: genLogData(5, 720) },
  { id: 'l4', name: 'Cold start AFR',      date: 'Apr 27 · 07:30', duration: '0:48', maxBoost: 12.6, data: genLogData(7, 480) },
]
