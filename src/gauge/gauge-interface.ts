import { easeCubic, interpolateNumber } from 'd3'
import * as gauge from './gauge'
import * as logger from './logger'

/**
 * Gauge interface.
 */

export interface GaugeInterface {
  updateNeedle(needleValue: number): void
  removeGauge(): void
}

export class Gauge {
  private svg: any
  private needleUpdateSpeed: number
  private needle

  constructor(svg, needleUpdateSpeed, needle = null) {
    this.svg = svg
    this.needleUpdateSpeed = needleUpdateSpeed
    this.needle = needle
  }

  updateNeedle(needleValue) {
    if (!this.needle) {
      logger.warn('Gauge-chart Warning: no needle to update')
      return
    }
    needleValue = gauge.needleValueModifier(needleValue)
    this.needle
      .getSelection()
      .transition()
      // for dynamic speed change .duration(Math.abs(needleValue - this.needle.getValue()) * 20)
      .duration(this.needleUpdateSpeed)
      .ease(easeCubic)
      .tween('needle animation', () => {
        const prevValue = this.needle.getValue()
        const i = interpolateNumber(prevValue, needleValue)
        return (t) => this.needle.setValue(i(t))
      })
  }

  removeGauge() {
    this.svg.remove()
  }
}
