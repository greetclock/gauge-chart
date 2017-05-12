// export as namespace GaugeChart;

declare function gaugeChart(
  element: HTMLElement,
  areaWidth: number,
  gaugeOptions: GaugeOptions,
): GaugeInterface;

interface GaugeInterface {
  updateNeedle(needleValue: number): void
}

interface GaugeOptions {
  needleValue?: number
  needleColor?: string
  arcColors?: string[]
  arcRatios?: number[]
  rangeLabel?: string[]
  centralLabel?: string
}
