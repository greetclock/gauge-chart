import { curveLinear, line } from 'd3'

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
  public outerNeedle

  constructor(
    svg,
    needleValue,
    centralLabel,
    chartHeight,
    outerRadius,
    offset,
    needleColor,
    outerNeedle,
  ) {
    this.needleValue = needleValue
    this.centralLabel = centralLabel
    this.chartHeight = chartHeight
    this.outerRadius = outerRadius
    this.offset = offset
    this.needleColor = needleColor
    this.outerNeedle = outerNeedle
    this.lineFunction = line()
      .x((d: any) => d.x)
      .y((d: any) => d.y)
      .curve(curveLinear)

    if (outerNeedle) {
      this.needleSvg = svg
        .append('path')
        .attr('d', this.getLine())
        .attr('stroke', this.needleColor)
        .attr('stroke-width', 2)
        .attr('fill', this.needleColor)
        .attr(
          'transform',
          'translate(' +
            (this.chartHeight + this.offset * 2) +
            ', ' +
            (this.chartHeight + this.offset) +
            ')',
        )
    } else {
      this.needleSvg = svg
        .append('path')
        .attr('d', this.getLine())
        .attr('stroke', this.needleColor)
        .attr('stroke-width', 2)
        .attr('fill', this.needleColor)
        .attr(
          'transform',
          'translate(' +
            (this.chartHeight + this.offset * 2) +
            ', ' +
            (this.chartHeight + this.offset) +
            ')',
        )
    }
  }

  public setValue(needleValue) {
    this.needleValue = needleValue
    this.needleSvg.attr('d', this.getLine())
  }

  public getValue() {
    return this.needleValue
  }

  public calcCoordinates() {
    // Thin needle if there is no central label and wide if there is.
    let needleWidth = this.centralLabel
      ? this.chartHeight * 0.7
      : this.chartHeight * 0.1
    needleWidth = this.outerNeedle ? this.chartHeight * 0.25 : needleWidth
    let needleHeadLength = this.outerNeedle
      ? this.outerRadius * 1.4
      : this.outerRadius * 0.97
    let needleTailLength = needleWidth * 0.5
    let needleWaypointOffset = needleWidth * 0.5
    let needleAngle = gauge.perc2RadWithShift(this.needleValue)
    let needleCoords: any

    if (this.outerNeedle) {
      needleCoords = [
        {
          x: needleHeadLength * Math.sin(needleAngle),
          y: -needleHeadLength * Math.cos(needleAngle),
        },
        {
          x:
            (needleHeadLength + needleTailLength) * Math.sin(needleAngle) +
            needleWaypointOffset * Math.cos(needleAngle),
          y:
            -(needleHeadLength + needleTailLength) * Math.cos(needleAngle) +
            needleWaypointOffset * Math.sin(needleAngle),
        },
        {
          x:
            (needleHeadLength + needleTailLength) * Math.sin(needleAngle) -
            needleWaypointOffset * Math.cos(needleAngle),
          y:
            -(needleHeadLength + needleTailLength) * Math.cos(needleAngle) -
            needleWaypointOffset * Math.sin(needleAngle),
        },
        {
          x: needleHeadLength * Math.sin(needleAngle),
          y: -needleHeadLength * Math.cos(needleAngle),
        },
      ]
    } else {
      if (this.centralLabel)
        needleCoords = [
          {
            x: needleHeadLength * Math.sin(needleAngle),
            y: -needleHeadLength * Math.cos(needleAngle),
          },
          {
            x:
              needleWaypointOffset * 1.5 * Math.sin(needleAngle) -
              (needleWaypointOffset / 3) * Math.cos(needleAngle),
            y:
              -(needleWaypointOffset * 1.5) * Math.cos(needleAngle) -
              (needleWaypointOffset / 3) * Math.sin(needleAngle),
          },
          {
            x:
              needleWaypointOffset * 1.5 * Math.sin(needleAngle) +
              (needleWaypointOffset / 3) * Math.cos(needleAngle),
            y:
              -(needleWaypointOffset * 1.5) * Math.cos(needleAngle) +
              (needleWaypointOffset / 3) * Math.sin(needleAngle),
          },
          {
            x: needleHeadLength * Math.sin(needleAngle),
            y: -needleHeadLength * Math.cos(needleAngle),
          },
        ]
      else
        needleCoords = [
          {
            x: needleHeadLength * Math.sin(needleAngle),
            y: -needleHeadLength * Math.cos(needleAngle),
          },
          {
            x: -needleWaypointOffset * Math.cos(needleAngle),
            y: -needleWaypointOffset * Math.sin(needleAngle),
          },
          {
            x: -needleTailLength * Math.sin(needleAngle),
            y: needleTailLength * Math.cos(needleAngle),
          },
          {
            x: needleWaypointOffset * Math.cos(needleAngle),
            y: needleWaypointOffset * Math.sin(needleAngle),
          },
          {
            x: needleHeadLength * Math.sin(needleAngle),
            y: -needleHeadLength * Math.cos(needleAngle),
          },
        ]
    }
    return needleCoords
  }

  public getSelection() {
    return this.needleSvg
  }

  private getLine() {
    return this.lineFunction(this.calcCoordinates())
  }
}
