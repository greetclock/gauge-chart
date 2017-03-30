import * as d3 from 'd3'
import { schemePaired } from 'd3-scale-chromatic'
import './gauge.css'

/**
 * Function that converts value in degrees into radians.
 * @param chartRatios - array of ratios [optional].
 * @param chartColors - array of colors (strings) [optional].
 * @returns boolean value - whether there are no errors in params.
 */
function paramErrorChecker (chartRatios?, chartColors?) {
  if (chartRatios && chartRatios.slice(-1) === 100) {
   console.error('gauge-chart error: gauge delimeter can not be equal 0 or 100')
   return false
  }
  return true
}

/**
 * Function that converts value in degrees into radians.
 * @param deg - value in degrees.
 * @returns value in radians.
 */
function perc2RadWithShift(perc) {
  return (perc / 100 - 0.5) * Math.PI
}

/**
 * Function for drawing gauge.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param chartColors - array of colors (strings).
 * @param outerRadius - outter radius of gauge.
 * @param chartRatios - array of ratios in percentage [optional].
 */
function gaugeOutline(svg, gaugeHeight, chartColors, outerRadius, chartRatios?) {
  chartRatios = chartRatios || []
  chartColors.forEach((color, i) => {
    let arc: any
    i ? (
      arc = d3.arc()
        .innerRadius(gaugeHeight)
        .outerRadius(outerRadius)
        .startAngle(perc2RadWithShift(chartRatios[i - 1]))
        .endAngle(perc2RadWithShift(chartRatios[i] || 100))  // 100 for last pie slice
    ) : (
      arc = d3.arc()
        .innerRadius(gaugeHeight)
        .outerRadius(outerRadius)
        .startAngle(perc2RadWithShift(0))
        .endAngle(perc2RadWithShift(chartRatios[i] || 100))  // 100 for last pie slice
    )
    svg.append('path')
      .attr('d', arc)
      .attr('fill', color)
      .attr('transform', 'translate(' + gaugeHeight + ', ' + gaugeHeight + ')')
      .attr('class', 'bar')
  })

  return svg
}

/**
 * Function for drawing needle base.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param needleColor - color of a needle.
 * @param isMainLabelVisible - boolean value, shows whether central label is shown.
 */
function needleBaseOutline(svg, gaugeHeight, needleColor, isMainLabelVisible) {
  if (isMainLabelVisible) {
    let innerGaugeRadius = gaugeHeight * 0.45
    let arc = d3.arc()
          .innerRadius(innerGaugeRadius)
          .outerRadius(0)
          .startAngle(perc2RadWithShift(0))
          .endAngle(perc2RadWithShift(200))

    svg.append('path')
      .attr('d', arc)
      .attr('fill', 'white')
      .attr('transform', 'translate(' + gaugeHeight + ', ' + gaugeHeight + ')')
      .attr('class', 'bar')
  } else {
    let innerGaugeRadius = gaugeHeight * 0.1
    let arc = d3.arc()
          .innerRadius(innerGaugeRadius)
          .outerRadius(0)
          .startAngle(perc2RadWithShift(0))
          .endAngle(perc2RadWithShift(200))

    svg.append('path')
      .attr('d', arc)
      .attr('fill', needleColor)
      .attr('transform', 'translate(' + gaugeHeight + ', ' + gaugeHeight + ')')
      .attr('class', 'bar')
  }

  return svg
}

/**
 * Function for drawing needle.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param needleWidth - width of needle.
 * @param needleColor - color of needle.
 * @param outerRadius - outer radius of gauge.
 * @param needleColor - color of a needle.
 * @param isMainLabelVisible - boolean value, shows whether central label is shown.
 */
function needleOutline(svg, gaugeHeight, needleColor,
                        outerRadius, needleValue, isMainLabelVisible) {

  let needleWidth = 20
  isMainLabelVisible ? needleWidth = gaugeHeight * 0.6 : needleWidth = gaugeHeight * 0.1

  let needleHeadLength = outerRadius * 0.97
  let needleTailLength = needleWidth * 0.5
  let needleWaypointOffset = needleWidth * 0.5
  let needleAngle = perc2RadWithShift(needleValue)
  // The data for our line
  let lineData = [ { x: needleHeadLength * Math.sin(needleAngle),
                     y: -needleHeadLength * Math.cos(needleAngle)},
                   { x: -needleWaypointOffset * Math.cos(needleAngle),
                     y: -needleWaypointOffset * Math.sin(needleAngle)},
                   { x: -needleTailLength * Math.sin(needleAngle),
                     y: needleTailLength * Math.cos(needleAngle)},
                   { x: needleWaypointOffset * Math.cos(needleAngle),
                     y: needleWaypointOffset * Math.sin(needleAngle)},
                   { x: needleHeadLength * Math.sin(needleAngle),
                     y: -needleHeadLength * Math.cos(needleAngle)}]

  // This is the accessor function we talked about above
  let lineFunction = d3.line()
                      .x( (d) => d.x )
                      .y( (d) => d.y )
                      .curve(d3.curveLinear)

  // The line SVG Path we draw
  svg.append('path')
   .attr('d', lineFunction(lineData))
   .attr('stroke', needleColor)
   .attr('stroke-width', 2)
   .attr('fill', needleColor)
   .attr('transform', 'translate(' + gaugeHeight + ', ' + gaugeHeight + ')')

   return svg
}

/**
 * Function for drawing needle.
 * @param svg - original svg rectangle.
 * @param gaugeHeight - height of gauge.
 * @param gaugeLabel - labels on the chart.
 * @param outerRadius - outer radius of gauge.
 * @param isMainLabelVisible - boolean value, shows whether central label is shown.
 */
function labelOutline(svg, gaugeHeight, gaugeLabel, outerRadius, isMainLabelVisible) {
  let fontSize = gaugeHeight * 0.2
  let gaugeWidth = gaugeHeight - outerRadius
  let labelOffset = gaugeWidth * 0.15


  if (gaugeLabel && isMainLabelVisible && gaugeLabel.length === 1) {
    svg.append('text')
      .attr('x', gaugeHeight - fontSize * 0.75)
      .attr('y', gaugeHeight - fontSize * 0.25)
      .text(gaugeLabel[0])
      .attr('font-size', fontSize + 20)
  } else if (gaugeLabel && isMainLabelVisible && gaugeLabel.length === 3) {
    svg.append('text')
      .attr('x', labelOffset)
      .attr('y', gaugeHeight + fontSize)
      .text(gaugeLabel[0])
      .attr('font-size', fontSize)

    svg.append('text')
      .attr('x', gaugeHeight - fontSize * 0.75)
      .attr('y', gaugeHeight - fontSize * 0.25)
      .text(gaugeLabel[1])
      .attr('font-size', fontSize + 20)

    svg.append('text')
     .attr('x', gaugeHeight * 2 - fontSize - labelOffset)
     .attr('y', gaugeHeight + fontSize)
     .text(gaugeLabel[2])
     .attr('font-size', fontSize)
  } else if (gaugeLabel && !isMainLabelVisible && gaugeLabel.length === 2) {
    svg.append('text')
      .attr('x', labelOffset)
      .attr('y', gaugeHeight + fontSize)
      .text(gaugeLabel[0])
      .attr('font-size', fontSize)

    svg.append('text')
      .attr('x', gaugeHeight * 2 - fontSize - labelOffset)
      .attr('y', gaugeHeight + fontSize)
      .text(gaugeLabel[1])
      .attr('font-size', fontSize)
  }

  return svg
}

/**
 * Function for drawing gauge.
 * @param gaugeWidth: number - width of gauge.
 * @param needleValue: number - value at which an arrow points.
 * @param chartColors: string[] - array of colors [optional].
 * @param chartRatios: numebr[] - array of ratios in percentage [optional].
 * @param gaugeLabel: gaugeLabel[] - labels on the chart [optional].
 */
export function gaugeChart(gaugeWidth: number, needleValue: number,
                            chartColors?: string[], chartRatios?: number[], gaugeLabel?: string[]) {
  if (paramErrorChecker(chartRatios, chartColors)) {
    const needleColor = 'gray'

    if (chartRatios && chartColors && chartRatios.length !== chartColors.length - 1) {
      let colorDiff = chartRatios.length - chartColors.length + 1
      for (let i = 0; i < colorDiff; i++) {
        chartColors.push(schemePaired[i % schemePaired.length])
      }
    } else if (!chartColors) {
      chartColors = chartColors || []
      chartColors.push(schemePaired[0])
    }

    let gaugeHeight = gaugeWidth * 0.5
    let outerRadius = gaugeHeight * 0.7
    let isMainLabelVisible = true

    if (gaugeLabel && gaugeLabel.length % 2)
      isMainLabelVisible = true
    else
      isMainLabelVisible = false


    let svg = d3.select('#gaugeArea').append('svg')
      .attr('width', gaugeWidth)
      .attr('height', gaugeHeight + gaugeHeight * 0.25)

    svg = needleOutline(svg, gaugeHeight, needleColor, outerRadius, needleValue, isMainLabelVisible)
    svg = needleBaseOutline(svg, gaugeHeight, needleColor, isMainLabelVisible)
    svg = gaugeOutline(svg, gaugeHeight, chartColors, outerRadius, chartRatios)
    svg = labelOutline(svg, gaugeHeight, gaugeLabel, outerRadius, isMainLabelVisible)
  }
}
