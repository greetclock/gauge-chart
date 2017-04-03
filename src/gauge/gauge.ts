import * as d3 from 'd3'
import { schemePaired } from 'd3-scale-chromatic'
import './gauge.css'

import { GaugeOptions } from './gauge-options'
import { paramChecker } from './param-checker'


/**
 * Function that checks whether the number of colors is enough for drawing specified ratios.
 * Adds standard colors if not enough or cuts the array if there are too many of them.
 * @param chartRatios - array of ratios.
 * @param chartColors - array of colors (strings).
 * @returns modified list of colors.
 */
export function chartColorsModifier(chartRatios: number[], chartColors: string[]) {
  if (chartRatios.length > chartColors.length - 1) {
    let colorDiff = chartRatios.length - chartColors.length + 1
    for (let i = 0; i < colorDiff; i++) {
      chartColors.push(schemePaired[i % schemePaired.length])
    }
  } else if (chartRatios.length < chartColors.length - 1) {
    chartColors = chartColors.slice(0, chartRatios.length + 1)
  }

  return chartColors
}

/**
 * Function that checks whether value that needle points at is between 0 and 100.
 * If it is less than 0 or larger than 100, value is equated to 0 and 100 respectively.
 * @param needleValue - value at which needle points.
 * @returns modified needleValue.
 */
export function needleValueModifier(needleValue: number) {
  return needleValue = needleValue < 0 ? 0 : needleValue > 100 ? 100 : needleValue
}

/**
 * Function that converts value in degrees into radians.
 * @param deg - value in degrees.
 * @returns value in radians.
 */
export function perc2RadWithShift(perc: number) {
  return (perc / 100 - 0.5) * Math.PI
}

/**
 * Function for drawing gauge.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param chartColors - array of colors.
 * @param outerRadius - outter radius of gauge.
 * @param chartRatios - array of ratios in percentage.
 * @returns modified svg.
 */
export function gaugeOutline(svg, gaugeHeight: number, offset: number, chartColors: string[],
                        outerRadius: number, chartRatios: number[]) {
  chartColors.forEach((color, i) => {
    let arc = d3.arc()
      .innerRadius(gaugeHeight)
      .outerRadius(outerRadius)
      .startAngle(i ? perc2RadWithShift(chartRatios[i - 1]) : perc2RadWithShift(0))
      .endAngle(perc2RadWithShift(chartRatios[i] || 100))  // 100 for last pie slice

    svg.append('path')
      .attr('d', arc)
      .attr('fill', color)
      .attr('transform', 'translate(' + (gaugeHeight + offset * 2) + ', ' + gaugeHeight + ')')
      .attr('class', 'bar')
  })

  return svg
}

/**
 * Function for drawing needle base.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param needleColor - color of a needle.
 * @param gaugeCentralLabel - value of the central label.
 * @returns modified svg.
 */
export function needleBaseOutline(svg, gaugeHeight: number, offset: number,
                           needleColor: string, gaugeCentralLabel: string) {
  // Different circle radiuses in the base of needle
  let innerGaugeRadius = gaugeCentralLabel ? gaugeHeight * 0.45 : gaugeHeight * 0.1
  let arc = d3.arc()
      .innerRadius(innerGaugeRadius)
      .outerRadius(0)
      .startAngle(perc2RadWithShift(0))
      .endAngle(perc2RadWithShift(200))

  // White needle base if something should be written on it, gray otherwise
  svg.append('path')
    .attr('d', arc)
    .attr('fill', gaugeCentralLabel ? 'white' : needleColor)
    .attr('transform', 'translate(' + (gaugeHeight + offset * 2) + ', ' + gaugeHeight + ')')
    .attr('class', 'bar')

  return svg
}

/**
 * Function for drawing needle.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param needleColor - color of needle.
 * @param outerRadius - outer radius of gauge.
 * @param needleValue - value at which needle points.
 * @param gaugeCentralLabel - value of the central label.
 * @returns modified svg.
 */
export function needleOutline(svg, gaugeHeight: number, offset: number, needleColor: string,
                        outerRadius: number, needleValue: number, gaugeCentralLabel: string) {
  // Thin needle if there is no central label and wide if there is.
  let needleWidth = gaugeCentralLabel ? gaugeHeight * 0.6 : gaugeHeight * 0.1

  let needleHeadLength = outerRadius * 0.97
  let needleTailLength = needleWidth * 0.5
  let needleWaypointOffset = needleWidth * 0.5
  let needleAngle = perc2RadWithShift(needleValue)

  // Data for our line
  let lineData = [ { x: needleHeadLength * Math.sin(needleAngle),
                     y: -needleHeadLength * Math.cos(needleAngle)},
                   { x: -needleWaypointOffset * Math.cos(needleAngle),
                     y: -needleWaypointOffset * Math.sin(needleAngle)},
                   { x: -needleTailLength * Math.sin(needleAngle),
                     y: needleTailLength * Math.cos(needleAngle)},
                   { x: needleWaypointOffset * Math.cos(needleAngle),
                     y: needleWaypointOffset * Math.sin(needleAngle)},
                   { x: needleHeadLength * Math.sin(needleAngle),
                     y: -needleHeadLength * Math.cos(needleAngle)} ]

  // Accessor function
  let lineFunction: any = d3.line()
                      .x( (d: any) => d.x )
                      .y( (d: any) => d.y )
                      .curve(d3.curveLinear)

  // SVG line path we draw
  svg.append('path')
   .attr('d', lineFunction(lineData))
   .attr('stroke', needleColor)
   .attr('stroke-width', 2)
   .attr('fill', needleColor)
   .attr('transform', 'translate(' + (gaugeHeight + offset * 2) + ', ' + gaugeHeight + ')')

   return svg
}

/**
 * Function for drawing needle.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param outerRadius - outer radius of gauge.
 * @param gaugeRangeLabel - range labels of gauge.
 * @param gaugeCentralLabel - value of the central label.
 * @returns modified svg.
 */
export function labelOutline(svg, gaugeHeight: number, offset: number, outerRadius: number,
                     gaugeRangeLabel: string[], gaugeCentralLabel: string) {
  let gaugeWidth = gaugeHeight - outerRadius

  // Specifications of fonts and offsets (responsive to chart size)
  let rangeLabelFontSize = gaugeHeight * 0.25
  let leftRangeLabelOffsetX = gaugeRangeLabel.length ? offset * 2 +
       (gaugeWidth - gaugeRangeLabel[0].length * rangeLabelFontSize * 0.5) * 0.5 : 0
  let leftRangeLabelOffsetY = gaugeHeight + rangeLabelFontSize * 0.85
  let rightRangeLabelOffsetX = gaugeRangeLabel.length ? gaugeHeight * 2 + offset * 2 -
      gaugeWidth / 2 - gaugeRangeLabel[1].length * rangeLabelFontSize * 0.5 * 0.5 : 0
  let rightRangeLabelOffsetY = gaugeHeight + rangeLabelFontSize * 0.85
  let centralLabelFontSize = rangeLabelFontSize * 1.5
  let centralLabelOffsetX = gaugeHeight + offset * 2 -
       gaugeCentralLabel.length * centralLabelFontSize * 0.5 * 0.5
  let centralLabelOffsetY = gaugeHeight

  svg.append('text')
    .attr('x', leftRangeLabelOffsetX)
    .attr('y', leftRangeLabelOffsetY)
    .text(gaugeRangeLabel ? gaugeRangeLabel[0] : '')
    .attr('font-size', rangeLabelFontSize)

  svg.append('text')
    .attr('x', rightRangeLabelOffsetX)
    .attr('y', rightRangeLabelOffsetY)
    .text(gaugeRangeLabel ? gaugeRangeLabel[1] : '')
    .attr('font-size', rangeLabelFontSize)

  svg.append('text')
    .attr('x', centralLabelOffsetX)
    .attr('y', centralLabelOffsetY)
    .text(gaugeCentralLabel)
    .attr('font-size', centralLabelFontSize)

  return svg
}

/**
 * Function for drawing gauge.
 * @param gaugeWidth: number - width of gauge.
 * @param needleValue: number - value at which an arrow points.
 * @param gaugeOptions?: string[] - object of optional parameters.
 */
export function gaugeChart(element: HTMLElement, gaugeWidth: number, needleValue: number,
                            gaugeOptions: GaugeOptions) {
  let chartColors = gaugeOptions.chartColors || []
  let chartRatios = gaugeOptions.chartRatios || []
  if (!paramChecker(chartRatios, chartColors, needleValue)) {
    return
  }
  let gaugeCentralLabel = gaugeOptions.gaugeCentralLabel || ''
  let gaugeRangeLabel = gaugeOptions.gaugeRangeLabel || []
  const needleColor = 'gray'
  chartColors = chartColorsModifier(chartRatios, chartColors)
  needleValue = needleValueModifier(needleValue)

  let offset = gaugeWidth * 0.05
  let gaugeHeight = gaugeWidth * 0.5 - offset * 2
  gaugeWidth = gaugeWidth - offset * 2
  let outerRadius = gaugeHeight * 0.7
  let svg = d3.select(element).append('svg')
                  .attr('width', gaugeWidth + offset * 2)
                  .attr('height', gaugeHeight + offset * 2)
  svg = needleOutline(svg, gaugeHeight, offset, needleColor,
                       outerRadius, needleValue, gaugeCentralLabel)
  svg = needleBaseOutline(svg, gaugeHeight, offset, needleColor, gaugeCentralLabel)
  svg = gaugeOutline(svg, gaugeHeight, offset, chartColors, outerRadius, chartRatios)
  svg = labelOutline(svg, gaugeHeight, offset, outerRadius, gaugeRangeLabel, gaugeCentralLabel)
  console.log((svg.html()).match(/path/g).length / 2)
}
