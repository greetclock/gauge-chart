/**
 * Optional gauge features (colors, ratios, labels).
 */
export interface GaugeOptions {
  needleValue?: number
  needleColor?: string
  arcColors?: string[]
  arcRatios?: number[]
  rangeLabel?: string[]
  centralLabel?: string
}
