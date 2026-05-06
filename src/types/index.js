// Shared types live here. JSDoc typedefs are used since the app is JS, not TS.

/**
 * @typedef {Object} TuneState
 * @property {string} stage — 's1' | 's2' | 's2p'
 * @property {number} burble — 0..3 (BURBLE_LEVELS index)
 * @property {boolean} hiddenOpen
 */

/**
 * @typedef {Object} DetectedVehicle
 * @property {string} vin
 * @property {string} model
 * @property {string} ecu
 * @property {string} cal
 * @property {string} stock
 */

/**
 * @typedef {Object} VinDecodeResult
 * @property {string} make
 * @property {string} model
 * @property {string} year
 * @property {string} summary
 */

export {}
