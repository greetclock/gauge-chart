import * as d3 from 'd3'
import * as gauge from './gauge'
import * as logger from './logger'

/**
 * Gauge interface.
 */

export class Gauge {
  _svg: any
  needle = null
  needleUpdateSpeed = 1000

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
      .ease(d3.easeCubic)
      .tween('needle animation', () => {
        let prevValue = this.needle.getValue()
        let i = d3.interpolateNumber(prevValue, needleValue)
        return (t) => {
          this.needle.setValue(i(t))
        }
      })
  }
}
