import * as d3 from 'd3'
import './gauge.css'

/*export function d3test() {
  let dataset = [2, 12, 15, 20, 10]
  let chartHeight = 400
  let chartWidth = 300
  let barWidth = 20

  let svg = d3.select('#gaugeArea').append('svg')
    .attr('width', chartHeight)
    .attr('height', chartWidth)

  let yScale = d3.scaleLinear()
    .domain([0, 20])
    .range([0, chartHeight])

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => i * (barWidth + 2))
    .attr('y', (d) => chartWidth - yScale(d))
    .attr('width', barWidth)
    .attr('height', (d) => yScale(d))
}*/

/**
 * Function that converts value in degrees into radians.
 * @param chartColors - array of colors (strings).
 * @param chartRatios - array of ratios.
 * @returns boolean value - whether there are no errors in params.
 */
function paramErrorChecker (chartColors, chartRatios) {
  if (chartColors.size !== chartRatios.size) {
    console.error('gauge-chart error: number of colors and colors differ')
   return false
  }
  let ratioSum = chartRatios.reduce((a, b) => a + b, 0)
  if (ratioSum !== 100) {
   console.error('gauge-chart error: ratio sum is not 100%')
   return false
  }
  return true
}

/**
 * Function that converts value in degrees into radians.
 * @param deg - value in degrees.
 * @returns value in radians.
 */
function perc2Rad(perc) {
  return (perc / 100 - 0.5) * Math.PI
}

/**
 * Function for drawing gauge.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param chartColors - array of colors (strings).
 * @param chartRatios - array of ratios in percentage.
 * @param outerRadius - outter radius of gauge.
 */
function gaugeOutline(svg, chartHeight, chartColors, chartRatios, outerRadius) {
  let chartRatioSum = 0

  chartColors.forEach((color, i) => {
    let arc: any
    i ? (
      arc = d3.arc()
        .innerRadius(chartHeight)
        .outerRadius(outerRadius)
        .startAngle(perc2Rad(chartRatioSum))
        .endAngle(perc2Rad(chartRatioSum + chartRatios[i]))
    ) : (
      arc = d3.arc()
        .innerRadius(chartHeight)
        .outerRadius(outerRadius)
        .startAngle(perc2Rad(0))
        .endAngle(perc2Rad(chartRatios[i]))
    )

    svg.append('path')
      .attr('d', arc)
      .attr('fill', color)
      .attr('transform', 'translate(' + chartHeight + ', ' + chartHeight + ')')
      .attr('class', 'bar')

    chartRatioSum += chartRatios[i]
  })

  return svg
}

/**
 * Function for drawing needle base.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 */
function needleBaseOutline(svg, chartHeight) {
  let isTextOnChart = false

  if (isTextOnChart) {
    let innerGaugeRadius = chartHeight * 0.45
    let arc = d3.arc()
          .innerRadius(innerGaugeRadius)
          .outerRadius(0)
          .startAngle(perc2Rad(0))
          .endAngle(perc2Rad(100))

    svg.append('path')
      .attr('d', arc)
      .attr('fill', 'white')
      .attr('transform', 'translate(' + chartHeight + ', ' + chartHeight + ')')
      .attr('class', 'bar')
  } else {
    let innerGaugeRadius = chartHeight / 10
    let arc = d3.arc()
          .innerRadius(innerGaugeRadius)
          .outerRadius(0)
          .startAngle(perc2Rad(0))
          .endAngle(perc2Rad(200))

    svg.append('path')
      .attr('d', arc)
      .attr('fill', 'gray')
      .attr('transform', 'translate(' + chartHeight + ', ' + (chartHeight * 0.9) + ')')
      .attr('class', 'bar')
  }

  return svg
}

/**
 * Function for drawing needle.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param needleWidth - width of needle.
 * @param needleColor - color of needle.
 * @param outerRadius - outer radius of gauge.
 */
function needleOutline(svg, chartHeight, needleWidth, needleColor, outerRadius) {
  let needleHeadLength = outerRadius * 0.84
  let needleTailLength = outerRadius * 0.13
  let needleWaypointOffset = needleWidth / 2

  let needleAngle = 1.57

  let topPointX = chartHeight * Math.cos(needleAngle)
  let topPointY = chartHeight * Math.sin(needleAngle)

  let hX = chartHeight
  let hY = chartHeight * 0.9

  // The data for our line
  let lineData = [ { x: 0,                        y: needleHeadLength},
                   { x: needleWaypointOffset, y: 0},
                   { x: 0,                        y: -needleTailLength},
                   { x: -needleWaypointOffset, y: 0},
                   { x: 0,                        y: needleHeadLength}]

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
   .attr('transform', 'translate(' + chartHeight + ', ' + (chartHeight * 0.9) + ')')
   // .attr('transform', 'rotate(' + needleAngle + ')')

   return svg
}

/**
 * Function for drawing gauge.
 * @param chartHeight - height of gauge.
 * @param chartColors - array of colors (strings).
 * @param chartRatios - array of ratios in percentage.
 * @param needleWidth - width of needle.
 * @param needleColor - color of needle.
 */
export function gaugeChart(chartHeight, chartColors, chartRatios, needleWidth, needleColor) {
  if (paramErrorChecker(chartColors, chartRatios)) {
    let outerRadius = chartHeight * 0.7

    let svg = d3.select('#gaugeArea').append('svg')
      .attr('width', chartHeight * 2)
      .attr('height', 300) // chartHeight

    svg = needleOutline(svg, chartHeight, needleWidth, needleColor, outerRadius)
    svg = needleBaseOutline(svg, chartHeight)
    svg = gaugeOutline(svg, chartHeight, chartColors, chartRatios, outerRadius)
  }
}
