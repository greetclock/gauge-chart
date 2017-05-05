import * as d3 from 'd3'

import * as gauge from './gauge'
/**
 * Gauge interface.
 */

export class Gauge {
  _svg: any
  needle = null

  updateNeedle(needleValue) {
    let diff = Math.abs(needleValue - this.needle.getValue())

    this.needle
      .getSelection()
      .transition()
      .duration(500) // dynamic change - diff * 20
      .ease(d3.easeExp)
      .tween('some', () => {
        let prevValue = this.needle.getValue()
        let i = d3.interpolateNumber(prevValue, needleValue)
        return (t) => {
          this.needle.setValue(i(t))
        }
      })
  }
}
