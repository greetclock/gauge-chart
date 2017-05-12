export as namespace GaugeChart;

export function gaugeChart(
  element: HTMLElement,
  areaWidth: number,
  gaugeOptions: GaugeOptions,
): GaugeInterface;

export interface GaugeInterface {
  updateNeedle(needleValue: number): void
}

export interface GaugeOptions {
  needleValue?: number
  needleColor?: string
  arcColors?: string[]
  arcRatios?: number[]
  rangeLabel?: string[]
  centralLabel?: string
}
