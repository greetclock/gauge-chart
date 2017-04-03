import * as d3 from 'd3'
import { schemePaired } from 'd3-scale-chromatic'

import * as gauge from './gauge'
import { paramChecker } from './param-checker'


describe('variable modifiers', () => {
  it ('converts value in degrees into radians', () => {
    let perc = 0
    expect(gauge.perc2RadWithShift(perc)).toEqual(- 0.5 * Math.PI)

    perc = 10
    expect(gauge.perc2RadWithShift(perc)).toEqual(- 0.4 * Math.PI)

    perc = 100
    expect(gauge.perc2RadWithShift(perc)).toEqual(0.5 * Math.PI)
  })

  it('checks whether the number of colors is ok and corrects it if not', () => {
    let chartRatios = [2, 5]
    let chartColors = ['red']
    expect(gauge.chartColorsModifier(chartRatios, chartColors))
                .toEqual(['red', schemePaired[0], schemePaired[1]])

    chartRatios = [2]
    chartColors = ['red', 'blue', 'green']
    expect(gauge.chartColorsModifier(chartRatios, chartColors)).toEqual(['red', 'blue'])

    chartRatios = [2, 5]
    chartColors = ['red', 'blue', 'green']
    expect(gauge.chartColorsModifier(chartRatios, chartColors)).toEqual(chartColors)
  })

  it('checks whether value of needle is in [0,100] and corrects if not', () => {
    let needleValue = 50
    expect(gauge.needleValueModifier(needleValue)).toBe(50)

    needleValue = -50
    expect(gauge.needleValueModifier(needleValue)).toBe(0)

    needleValue = 150
    expect(gauge.needleValueModifier(needleValue)).toBe(100)
  })
})

describe('chart outlining', () => {
  let offset = 10
  let gaugeWidth = 200 - offset * 2
  let gaugeHeight = 100 - offset * 2
  let outerRadius = gaugeHeight * 0.7
  let element = document.createElement('test')

  it ('checks arc svg outline', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let chartRatios = []
    let chartColors = ['red']
    svg = gauge.gaugeOutline(svg, gaugeHeight, offset, chartColors, outerRadius, chartRatios)
    expect(svg).not.toBe(null)
    expect((svg.html()).match(/path/g).length / 2).toBe(1)
  })

  it ('checks correct path of arc', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let chartRatios = []
    let chartColors = ['red']
    svg = gauge.gaugeOutline(svg, gaugeHeight, offset, chartColors, outerRadius, chartRatios)
    // define the whole path string (M...A...L...A...Z for svg arc)
    let svgHtml = svg.html().slice(svg.html().search('M') + 1, svg.html().search('Z'))
    let svgM = svgHtml.slice(0, svgHtml.search('A')).split(',').map(Number)
    let expectedValues = [-80, 0]
    svgM.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('A') + 1, svgHtml.length)
    let svgA = svgHtml.slice(0, svgHtml.search('L')).split(',').map(Number)
    expectedValues = [80, 80, 0, 1, 1, 80, 0]
    svgA.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('L') + 1, svgHtml.length)
    let svgL = svgHtml.slice(0, svgHtml.search('A')).split(',').map(Number)
    expectedValues = [56, 0]
    svgL.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('A') + 1, svgHtml.length)
    svgA = svgHtml.split(',').map(Number)
    expectedValues = [56, 56, 0, 1, 0, -56, 0]
    svgA.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })
  })

  it ('checks splitting of arc', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let chartRatios = [50]
    let chartColors = ['red', 'blue']
    svg = gauge.gaugeOutline(svg, gaugeHeight, offset, chartColors, outerRadius, chartRatios)
    // number of paths in svg html has to be 2
    expect((svg.html()).match(/path/g).length / 2).toBe(2)

    let svgHtmlFirstPath = svg.html().slice(svg.html().search('path') + 1,
               svg.html().search('/path'))
    let svgHtmlSecondPath = svg.html().slice(svg.html().search('/path') + 1,
               svg.html().lastIndexOf('/path'))

    let svgHtml = svgHtmlFirstPath.slice(svgHtmlFirstPath.search('M') + 1,
               svgHtmlFirstPath.search('Z'))
    let svgM = svgHtml.slice(0, svgHtml.search('A')).split(',').map(Number)
    let expectedValues = [-80, 0]
    svgM.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('A') + 1, svgHtml.length)
    let svgA = svgHtml.slice(0, svgHtml.search('L')).split(',').map(Number)
    expectedValues = [80, 80, 0, 0, 1, 0, -80]
    svgA.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('L') + 1, svgHtml.length)
    let svgL = svgHtml.slice(0, svgHtml.search('A')).split(',').map(Number)
    expectedValues = [0, -56]
    svgL.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('A') + 1, svgHtml.length)
    svgA = svgHtml.split(',').map(Number)
    expectedValues = [56, 56, 0, 0, 0, -56, 0]
    svgA.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtmlSecondPath.slice(svgHtmlSecondPath.search('M') + 1,
               svgHtmlSecondPath.search('Z'))
    svgM = svgHtml.slice(0, svgHtml.search('A')).split(',').map(Number)
    expectedValues = [0, -80]
    svgM.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('A') + 1, svgHtml.length)
    svgA = svgHtml.slice(0, svgHtml.search('L')).split(',').map(Number)
    expectedValues = [80, 80, 0, 0, 1, 80, 0]
    svgA.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('L') + 1, svgHtml.length)
    svgL = svgHtml.slice(0, svgHtml.search('A')).split(',').map(Number)
    expectedValues = [56, 0]
    svgL.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })

    svgHtml = svgHtml.slice(svgHtml.search('A') + 1, svgHtml.length)
    svgA = svgHtml.split(',').map(Number)
    expectedValues = [56, 56, 0, 0, 0, 0, -56]
    svgA.forEach((coord, i) => {
      expect(coord).toBeCloseTo(expectedValues[i])
    })


  })
})


/*
it('draws gauge', () => {
    let element = document.createElement('gaugeChart')
    let gaugeOptions = {
      chartColors: [],
      chartRatios: [25, 50, 75],
      gaugeRangeLabel: ['0', '100'],
      gaugeCentralLabel: '60',
    }
    gaugeChart(element, 600, 60, gaugeOptions)
  })

  */
