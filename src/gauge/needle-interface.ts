import * as d3 from 'd3'

import * as gauge from './gauge'
/**
 * Needle interface.
 */

export class Needle {

  public needleValue
  public centralLabel
  public chartHeight
  public outerRadius
  public needleColor
  public offset
  public lineData
  public lineFunction
  public needleSvg

  constructor(svg, needleValue, centralLabel, chartHeight, outerRadius, offset, needleColor) {
    this.needleValue = needleValue
    this.centralLabel = centralLabel
    this.chartHeight = chartHeight
    this.outerRadius = outerRadius
    this.offset = offset
    this.needleColor = needleColor
    this.lineFunction = d3.line()
            .x( (d: any) => d.x )
            .y( (d: any) => d.y )
            .curve(d3.curveLinear)

    this.needleSvg = svg.append('path')
      .attr('d', this.getLine())
      .attr('stroke', this.needleColor)
      .attr('stroke-width', 2)
      .attr('fill', this.needleColor)
      .attr('transform', 'translate(' + (this.chartHeight + this.offset * 2) + ', '
                                            + (this.chartHeight + this.offset) + ')')
  }

  public setValue(needleValue) {
    this.needleValue = needleValue
    this.needleSvg
        .attr('d', this.getLine())
  }

  public getValue() {
    return this.needleValue
  }

  public calcCoordinates(){
    // Thin needle if there is no central label and wide if there is.
    let needleWidth = this.centralLabel ? this.chartHeight * 0.7 : this.chartHeight * 0.1
    let needleHeadLength = this.outerRadius * 0.97
    let needleTailLength = needleWidth * 0.5
    let needleWaypointOffset = needleWidth * 0.5
    let needleAngle = gauge.perc2RadWithShift(this.needleValue)

    return [ { x: needleHeadLength * Math.sin(needleAngle),
               y: -needleHeadLength * Math.cos(needleAngle)},
             { x: -needleWaypointOffset * Math.cos(needleAngle),
               y: -needleWaypointOffset * Math.sin(needleAngle)},
             { x: -needleTailLength * Math.sin(needleAngle),
               y: needleTailLength * Math.cos(needleAngle)},
             { x: needleWaypointOffset * Math.cos(needleAngle),
               y: needleWaypointOffset * Math.sin(needleAngle)},
             { x: needleHeadLength * Math.sin(needleAngle),
               y: -needleHeadLength * Math.cos(needleAngle)} ]
  }

  public getSelection() {
    return this.needleSvg
  }

  private getLine() {
    return this.lineFunction(this.calcCoordinates())
  }
}
