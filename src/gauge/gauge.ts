import * as d3 from 'd3'
import { schemePaired } from 'd3-scale-chromatic'
import './gauge.css'

import { GaugeOptions } from './gauge-options'
import { paramChecker } from './param-checker'


/**
 * Function that checks whether the number of colors is enough for drawing specified ratios.
 * Adds standard colors if not enough or cuts the array if there are too many of them.
 * @param arcRatios - array of ratios.
 * @param arcColors - array of colors (strings).
 * @returns modified list of colors.
 */
export function arcColorsModifier(arcRatios: number[], arcColors: string[]) {
  if (arcRatios.length > arcColors.length - 1) {
    let colorDiff = arcRatios.length - arcColors.length + 1
    for (let i = 0; i < colorDiff; i++) {
      arcColors.push(schemePaired[i % schemePaired.length])
    }
  } else if (arcRatios.length < arcColors.length - 1) {
    arcColors = arcColors.slice(0, arcRatios.length + 1)
  }

  return arcColors
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
 * @param arcColors - array of colors.
 * @param outerRadius - outter radius of gauge.
 * @param arcRatios - array of ratios in percentage.
 * @returns modified svg.
 */
export function arcOutline(svg, gaugeHeight: number, offset: number, arcColors: string[],
                        outerRadius: number, arcRatios: number[]) {
  arcColors.forEach((color, i) => {
    let arc = d3.arc()
      .innerRadius(gaugeHeight)
      .outerRadius(outerRadius)
      .startAngle(i ? perc2RadWithShift(arcRatios[i - 1]) : perc2RadWithShift(0))
      .endAngle(perc2RadWithShift(arcRatios[i] || 100))  // 100 for last pie slice

    let innerArc = svg.append('path')
      .attr('d', arc)
      .attr('fill', color)
      .attr('transform', 'translate(' + (gaugeHeight + offset * 2) + ', '
                                            + (gaugeHeight + offset) + ')')

    arc = d3.arc()
      .innerRadius(gaugeHeight)
      .outerRadius(gaugeHeight + gaugeHeight * 0.1)
      .startAngle(i ? perc2RadWithShift(arcRatios[i - 1]) : perc2RadWithShift(0))
      .endAngle(perc2RadWithShift(arcRatios[i] || 100))  // 100 for last pie slice  

    let outerArc = svg.append('path')
      .attr('d', arc)
      .attr('fill', 'transparent')
      .attr('opacity', '0.2')
      .attr('transform', 'translate(' + (gaugeHeight + offset * 2) + ', '
                                            + (gaugeHeight + offset) + ')')

    innerArc
      .on('mouseover', () => {
        innerArc.style('opacity', 0.8)
        outerArc
          .transition()
          .duration(50)
          .ease(d3.easeLinear)
          .attr('fill', color)
      })
      .on('mouseout', () => {
        innerArc.style('opacity', 1)
        outerArc
          .transition()
          .duration(300)
          .ease(d3.easeLinear)
          .attr('fill', 'transparent')

      })
  })

  return svg
}

/**
 * Function for drawing needle base.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param needleColor - color of a needle.
 * @param centralLabel - value of the central label.
 * @returns modified svg.
 */
export function needleBaseOutline(svg, gaugeHeight: number, offset: number,
                           needleColor: string, centralLabel: string) {
  // Different circle radiuses in the base of needle
  let innerGaugeRadius = centralLabel ? gaugeHeight * 0.5 : gaugeHeight * 0.1
  let arc = d3.arc()
      .innerRadius(innerGaugeRadius)
      .outerRadius(0)
      .startAngle(perc2RadWithShift(0))
      .endAngle(perc2RadWithShift(200))

  // White needle base if something should be written on it, gray otherwise
  svg.append('path')
    .attr('d', arc)
    .attr('fill', centralLabel ? 'white' : needleColor)
    .attr('transform', 'translate(' + (gaugeHeight + offset * 2) + ', '
                                          + (gaugeHeight + offset) + ')')
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
 * @param centralLabel - value of the central label.
 * @returns modified svg.
 */
export function needleOutline(svg, gaugeHeight: number, offset: number, needleColor: string,
                        outerRadius: number, needleValue: number, centralLabel: string) {
  // Thin needle if there is no central label and wide if there is.
  let needleWidth = centralLabel ? gaugeHeight * 0.7 : gaugeHeight * 0.1

  let needleHeadLength = outerRadius * 0.97
  let needleTailLength = needleWidth * 0.5
  let needleWaypointOffset = needleWidth * 0.5
  let needleAngle = perc2RadWithShift(needleValue)

  // Data for our line
  /*let lineData = [ { x: needleHeadLength * Math.sin(needleAngle) + gaugeHeight + offset * 2,
                     y: -needleHeadLength * Math.cos(needleAngle) + (gaugeHeight + offset)},
                   { x: -needleWaypointOffset * Math.cos(needleAngle) + gaugeHeight + offset * 2,
                     y: -needleWaypointOffset * Math.sin(needleAngle) + (gaugeHeight + offset)},
                   { x: -needleTailLength * Math.sin(needleAngle) + gaugeHeight + offset * 2,
                     y: needleTailLength * Math.cos(needleAngle) + (gaugeHeight + offset)},
                   { x: needleWaypointOffset * Math.cos(needleAngle) + gaugeHeight + offset * 2,
                     y: needleWaypointOffset * Math.sin(needleAngle) + (gaugeHeight + offset)},
                   { x: needleHeadLength * Math.sin(needleAngle) + gaugeHeight + offset * 2,
                     y: -needleHeadLength * Math.cos(needleAngle) + (gaugeHeight + offset)} ]*/

  let lineData = [ { x: 0 + gaugeHeight + offset * 2,
                     y: needleHeadLength + (gaugeHeight + offset)},
                   { x: needleWaypointOffset + gaugeHeight + offset * 2,
                     y: 0 + (gaugeHeight + offset)},
                   { x: 0 + gaugeHeight + offset * 2,
                     y: -needleTailLength + (gaugeHeight + offset)},
                   { x: -needleWaypointOffset + gaugeHeight + offset * 2,
                     y: 0 + (gaugeHeight + offset)},
                   { x: 0 + gaugeHeight + offset * 2,
                     y: needleHeadLength + (gaugeHeight + offset)} ]

  // Accessor function
  let lineFunction: any = d3.line()
                      .x( (d: any) => d.x )
                      .y( (d: any) => d.y )
                      .curve(d3.curveLinear)
  //let pg = svg.append('path')
  //            .attr('d', lineFunction(lineData))
              
  //pg.attr('transform', 'rotate(' + '-90' + ')')

  let so = 40

  // SVG line path we draw
  svg.append('path')
   .attr('d', lineFunction(lineData))
   //.attr('transform', 'rotate(100)')
   .attr('transform', 'translate(' + so * 2.3  + ', ' + so * (-2.3) + ') rotate(' + so + ')')
   .attr('stroke', needleColor)
   .attr('stroke-width', 2)
   .attr('fill', needleColor)
   //.attr('transform', 'translate(' + (gaugeHeight + offset * 2) + ', '
   //                                      + (gaugeHeight + offset) + ')')

   return svg
}

/**
 * Function for drawing needle.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param outerRadius - outer radius of gauge.
 * @param rangeLabel - range labels of gauge.
 * @param centralLabel - value of the central label.
 * @returns modified svg.
 */
export function labelOutline(svg, gaugeHeight: number, offset: number, outerRadius: number,
                     rangeLabel: string[], centralLabel: string) {
  let gaugeWidth = gaugeHeight - outerRadius

  // Specifications of fonts and offsets (responsive to chart size)
  let rangeLabelFontSize = gaugeHeight * 0.2
  let leftRangeLabelOffsetX = rangeLabel.length ? offset * 2 +
       (gaugeWidth - rangeLabel[0].length * rangeLabelFontSize * 0.5) * 0.5 : 0
  let leftRangeLabelOffsetY = gaugeHeight + rangeLabelFontSize * 0.85 + offset * 1.5
  let rightRangeLabelOffsetX = rangeLabel.length ? gaugeHeight * 2 + offset * 2 -
      gaugeWidth / 2 - rangeLabel[1].length * rangeLabelFontSize * 0.5 * 0.5 : 0
  let rightRangeLabelOffsetY = gaugeHeight + rangeLabelFontSize * 0.85 + offset * 1.5
  let centralLabelFontSize = rangeLabelFontSize * 1.5
  let centralLabelOffsetX = gaugeHeight + offset * 2 -
       centralLabel.length * centralLabelFontSize * 0.5 * 0.5
  let centralLabelOffsetY = gaugeHeight + offset * 0.5

  svg.append('text')
    .attr('x', leftRangeLabelOffsetX)
    .attr('y', leftRangeLabelOffsetY)
    .text(rangeLabel ? rangeLabel[0] : '')
    .attr('font-size', rangeLabelFontSize)
    .attr('font-family', 'Roboto,Helvetica Neue,sans-serif')

  svg.append('text')
    .attr('x', rightRangeLabelOffsetX)
    .attr('y', rightRangeLabelOffsetY)
    .text(rangeLabel ? rangeLabel[1] : '')
    .attr('font-size', rangeLabelFontSize)
    .attr('font-family', 'Roboto,Helvetica Neue,sans-serif')

  svg.append('text')
    .attr('x', centralLabelOffsetX)
    .attr('y', centralLabelOffsetY)
    .text(centralLabel)
    .attr('font-size', centralLabelFontSize)
    .attr('font-family', 'Roboto,Helvetica Neue,sans-serif')

  return svg
}

/**
 * Function for drawing gauge.
 * @param gaugeWidth: number - width of gauge.
 * @param needleValue: number - value at which an arrow points.
 * @param gaugeOptions?: string[] - object of optional parameters.
 */
export function gaugeChart(element: HTMLElement, gaugeWidth: number, gaugeOptions: GaugeOptions) {
  let defaultGaugeOption = {
    needleValue: -1,
    needleColor: 'gray',
    arcColors: [],
    arcRatios: [],
    rangeLabel: [],
    centralLabel: '',
  }
  let {needleValue, needleColor, arcColors, arcRatios, rangeLabel, centralLabel} =
                   Object.assign(defaultGaugeOption, gaugeOptions)

  if (!paramChecker(arcRatios, arcColors, needleValue, rangeLabel)) {
    return
  }

  arcColors = arcColorsModifier(arcRatios, arcColors)

  let offset = gaugeWidth * 0.05
  let gaugeHeight = gaugeWidth * 0.5 - offset * 2
  gaugeWidth = gaugeWidth - offset * 2
  let outerRadius = gaugeHeight * 0.75
  let svg = d3.select(element).append('svg')
                  .attr('width', gaugeWidth + offset * 2)
                  .attr('height', gaugeHeight + offset * 4)

  if (needleValue !== -1) {
    needleValue = needleValueModifier(needleValue)
    svg = needleOutline(svg, gaugeHeight, offset, needleColor,
                       outerRadius, needleValue, centralLabel)
    svg = needleBaseOutline(svg, gaugeHeight, offset, needleColor, centralLabel)
  }
  svg = arcOutline(svg, gaugeHeight, offset, arcColors, outerRadius, arcRatios)
  svg = labelOutline(svg, gaugeHeight, offset, outerRadius, rangeLabel, centralLabel)

  return svg
}
