import { APEX } from '@/lib/theme'

export const TROUBLE_CODES = [
  {
    code: 'P0300', severity: 'high',
    title: 'Random/multiple cylinder misfire',
    desc: 'ECU detected misfires across two or more cylinders within a short window. Likely impacts emissions and may damage the catalytic converter if untreated.',
    causes: ['Worn spark plugs or coils', 'Vacuum leak in intake manifold', 'Low fuel pressure / failing pump', 'Carbon buildup on intake valves'],
    fixes: ['Replace plugs at OEM gap', 'Smoke-test intake for leaks', 'Test fuel rail pressure at idle', 'Walnut blast intake ports if mileage > 60k'],
  },
  {
    code: 'P0171', severity: 'med',
    title: 'System too lean (Bank 1)',
    desc: 'Long-term fuel trim on bank 1 is consistently above +10%, suggesting unmetered air or under-fueling.',
    causes: ['Cracked PCV hose', 'Dirty MAF sensor', 'Failing high-pressure fuel pump'],
    fixes: ['Inspect intake boots & PCV', 'Clean MAF with CRC spray', 'Log fuel pressure under load'],
  },
  {
    code: 'P2096', severity: 'low',
    title: 'Post catalyst fuel trim too lean (Bank 1)',
    desc: 'Downstream O2 sensor reports leaner exhaust than expected. Often pairs with P0171.',
    causes: ['Exhaust leak before rear O2', 'Aging O2 sensor'],
    fixes: ['Pressure-check exhaust', 'Replace rear O2 sensor if > 100k mi'],
  },
  {
    code: 'U0101', severity: 'med',
    title: 'Lost communication with TCM',
    desc: 'Engine ECU briefly lost CAN-bus contact with the transmission control module.',
    causes: ['Loose connector at TCM', 'CAN-H/L wire chafe near tunnel', 'Low battery voltage'],
    fixes: ['Reseat TCM connector', 'Check battery health', 'Inspect harness near gear selector'],
  },
]

export const SEVERITY = {
  high: { label: 'High',   color: APEX.magenta, bg: APEX.magentaSoft },
  med:  { label: 'Medium', color: APEX.amber,   bg: 'rgba(255,181,71,0.14)' },
  low:  { label: 'Low',    color: APEX.cyan,    bg: APEX.cyanSoft },
}
