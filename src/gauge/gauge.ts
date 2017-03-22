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
 * @param chartHeight - height of gauge.
 * @param chartColors - array of colors (strings).
 * @param chartRatios - array of ratios in percentage.
 */
export function gaugeChart(chartHeight, chartColors, chartRatios) {
  if (paramErrorChecker(chartColors, chartRatios)) {
    let svg = d3.select('#gaugeArea').append('svg')
      .attr('width', chartHeight * 2)
      .attr('height', chartHeight)
    let chartRatioSum = 0

    chartColors.forEach((color, i) => {
      let arc: any
      i ? (
        arc = d3.arc()
          .innerRadius(chartHeight)
          .outerRadius(chartHeight * 0.7)
          .startAngle(perc2Rad(chartRatioSum))
          .endAngle(perc2Rad(chartRatioSum + chartRatios[i]))
      ) : (
        arc = d3.arc()
          .innerRadius(chartHeight)
          .outerRadius(chartHeight * 0.7)
          .startAngle(perc2Rad(0))
          .endAngle(perc2Rad(chartRatios[i]))
      )

      svg.append('path')
        .attr('d', arc)
        .attr('fill', color)
        .attr('transform', 'translate(' + chartHeight + ', ' + chartHeight + ')')

      chartRatioSum += chartRatios[i]
    }
  }
}
