import { NHTSA_VPIC_URL } from '@/lib/constants'
import { titleCase } from '@/lib/utils'

const intOrNull = (v) => {
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : null
}
const floatOrNull = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : null
}

// Decode a VIN via NHTSA vPIC and return a normalized vehicle object that
// the rest of the app can render from. Where vPIC has nothing for a field
// we leave it null/empty rather than substituting a fake — callers should
// gracefully omit those rows.
export async function decodeVin(vin) {
  const res = await fetch(`${NHTSA_VPIC_URL}/${vin}?format=json`)
  if (!res.ok) throw new Error(`NHTSA returned ${res.status}`)
  const data = await res.json()
  const r = data.Results?.[0] || {}

  const make = titleCase(r.Make)
  const model = titleCase(r.Model)
  const year = r.ModelYear || ''
  const trim = r.Trim || r.Trim2 || r.Series || ''
  const cylinders = intOrNull(r.EngineCylinders)
  const displacementL = floatOrNull(r.DisplacementL)
  const engineHP = intOrNull(r.EngineHP)

  const summary = [year, make, model, trim].filter(Boolean).join(' ') || 'Unknown vehicle'
  const shortLabel = [make, model].filter(Boolean).join(' ') || 'Vehicle'
  const tuneSub = [model, year].filter(Boolean).join(' · ') || summary

  // Mercedes-style ECU id derived from the VIN's last 11 chars; deterministic
  // per VIN so the Scanning screen feels stable on re-decode.
  const tail = vin.slice(-11)
  const ecuLabel = tail ? `A ${tail.slice(0, 3)} ${tail.slice(3, 6)} ${tail.slice(6, 8)} ${tail.slice(8, 11)}` : ''
  const calLabel = `CAL_${vin.slice(-8)}`

  return {
    vin,
    year,
    make,
    model,
    trim,
    summary,
    shortLabel,
    tuneSub,

    bodyClass: r.BodyClass || '',
    vehicleType: r.VehicleType || '',
    driveType: r.DriveType || '',
    doors: intOrNull(r.Doors),

    cylinders,
    displacementL,
    engineHP,
    fuelType: r.FuelTypePrimary || '',
    transmission: r.TransmissionStyle || '',
    transmissionSpeeds: intOrNull(r.TransmissionSpeeds),

    manufacturer: r.Manufacturer || '',
    plantCity: r.PlantCity || '',
    plantCountry: r.PlantCountry || '',

    ecuLabel,
    calLabel,
  }
}
