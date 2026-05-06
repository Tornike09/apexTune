export const BURBLE_LEVELS = [
  { key: 'soft',       label: 'Soft',       desc: 'Subtle pops on lift',   intensity: 0.20 },
  { key: 'medium',     label: 'Medium',     desc: 'Crackle on overrun',    intensity: 0.45 },
  { key: 'aggressive', label: 'Aggressive', desc: 'Heavy crackle + bangs', intensity: 0.72 },
  { key: 'extreme',    label: 'Extreme',    desc: 'Race-only · loud reports', intensity: 1.00 },
]

export const STAGES = [
  { key: 's1',  name: 'Stage 1',  power: '+62 hp',  torque: '+78 Nm',  note: '93 octane · stock hardware' },
  { key: 's2',  name: 'Stage 2',  power: '+91 hp',  torque: '+118 Nm', note: 'Downpipe + intake required' },
  { key: 's2p', name: 'Stage 2+', power: '+118 hp', torque: '+148 Nm', note: 'E50+ · meth · race only' },
]
