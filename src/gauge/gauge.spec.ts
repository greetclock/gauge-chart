import * as d3 from 'd3'
import { schemePaired } from 'd3-scale-chromatic'

import * as gauge from './gauge'
import * as gaugeParam from './param-checker'

function pathValueChecker(svgHtml, startChar, stopChar, expectedValues) {
  svgHtml = svgHtml.slice(svgHtml.search(startChar) + 1, svgHtml.length)
  let svgA = svgHtml.slice(0, stopChar ? svgHtml.search(stopChar) : svgHtml.length)
                    .split(',')
                    .map(Number)
  svgA.forEach((coord, i) => {
    expect(coord).toBeCloseTo(expectedValues[i], 1)
  })
  return svgHtml
}

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

describe('arc outlining', () => {
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

    let svgHtml = svg.html().slice(svg.html().search('M'), svg.html().search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-80, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 1, 1, 80, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [56, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [56, 56, 0, 1, 0, -56, 0])
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

    let svgHtml = svgHtmlFirstPath.slice(svgHtmlFirstPath.search('M'),
               svgHtmlFirstPath.search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-80, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 0, 1, 0, -80])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [0, -56])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [56, 56, 0, 0, 0, -56, 0])

    svgHtml = svgHtmlSecondPath.slice(svgHtmlSecondPath.search('M'),
               svgHtmlSecondPath.search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [0, -80])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 0, 1, 80, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [56, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [56, 56, 0, 0, 0, 0, -56])
  })
})

describe('needle base outlining', () => {
  let offset = 10
  let gaugeWidth = 200 - offset * 2
  let gaugeHeight = 100 - offset * 2
  let element = document.createElement('test')
  let needleColor = 'gray'

  it ('checks needle svg outline', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = ''
    svg = gauge.needleBaseOutline(svg, gaugeHeight, offset, needleColor, gaugeCentralLabel)
    expect(svg).not.toBe(null)
    expect((svg.html()).match(/path/g).length / 2).toBe(1)
  })

  it ('checks correct path of needle base without label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = ''
    svg = gauge.needleBaseOutline(svg, gaugeHeight, offset, needleColor, gaugeCentralLabel)
    // define the whole path string (M...A...A...Z for svg arc)
    let svgHtml = svg.html().slice(svg.html().search('M') + 1, svg.html().search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-8, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'A', [8, 8, 0, 1, 1, 8, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [8, 8, 0, 1, 1, -8, 0])
  })

  it ('checks correct path of needle base with label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = '23'
    svg = gauge.needleBaseOutline(svg, gaugeHeight, offset, needleColor, gaugeCentralLabel)

    let svgHtml = svg.html().slice(svg.html().search('M'), svg.html().search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-36, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'A', [36, 36, 0, 1, 1, 36, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [36, 36, 0, 1, 1, -36, 0])
  })
})

describe('needle outlining', () => {
  let offset = 10
  let gaugeWidth = 200 - offset * 2
  let gaugeHeight = 100 - offset * 2
  let element = document.createElement('test')
  let outerRadius = gaugeHeight * 0.7
  let needleColor = 'gray'
  let needleValue = 50

  it ('checks needle svg outline', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = ''
    svg = gauge.needleOutline(svg, gaugeHeight, offset, needleColor,
                                outerRadius, needleValue, gaugeCentralLabel)
    expect(svg).not.toBe(null)
    expect((svg.html()).match(/path/g).length / 2).toBe(1)
  })

  it ('checks correct path of needle without label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = ''
    svg = gauge.needleOutline(svg, gaugeHeight, offset, needleColor,
                                outerRadius, needleValue, gaugeCentralLabel)
    // define the whole path string (M...L...L...L...L... for svg arc)
    let svgHtml = svg.html().slice(svg.html().search('M'), svg.html().search('" stroke'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'L', [0, -54.3])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [-4, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [0, 4])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [4, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', '', [0, -54.3])
  })

  it ('checks correct path of needle with label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = '23'
    svg = gauge.needleOutline(svg, gaugeHeight, offset, needleColor,
                                outerRadius, needleValue, gaugeCentralLabel)
    // define the whole path string (M...L...L...L... for svg arc)
    let svgHtml = svg.html().slice(svg.html().search('M') + 1, svg.html().search('" stroke'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'L', [0, -54.3])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [-24, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [0, 24])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [24, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', '', [0, -54.3])
  })
})

describe('label outlining', () => {
  let offset = 10
  let gaugeWidth = 200 - offset * 2
  let gaugeHeight = 100 - offset * 2
  let element = document.createElement('test')
  let outerRadius = gaugeHeight * 0.7

  it ('checks label svg outline', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = '2'
    let gaugeRangeLabel = ['0', '4']
    svg = gauge.labelOutline(svg, gaugeHeight, offset, outerRadius,
                              gaugeRangeLabel, gaugeCentralLabel)
    expect(svg).not.toBe(null)
    expect((svg.html()).match(/text/g).length / 2).toBe(3)
  })

  it ('checks correct text of needle with central label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = '2'
    let gaugeRangeLabel = []
    svg = gauge.labelOutline(svg, gaugeHeight, offset, outerRadius,
                              gaugeRangeLabel, gaugeCentralLabel)

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop()  // removed last element (empty string)
    expect(svgHtml[0]).toBe('<text x="0" y="97" font-size="20">')
    expect(svgHtml[1]).toBe('<text x="0" y="97" font-size="20">')
    expect(svgHtml[2]).toBe('<text x="92.5" y="80" font-size="30">' + gaugeCentralLabel)
  })

  it ('checks correct text of needle with range labels', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = ''
    let gaugeRangeLabel = ['0', '4']
    svg = gauge.labelOutline(svg, gaugeHeight, offset, outerRadius,
                              gaugeRangeLabel, gaugeCentralLabel)

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop()  // removed last element (empty string)
    expect(svgHtml[0]).toBe('<text x="27" y="97" font-size="20">' + gaugeRangeLabel[0])
    expect(svgHtml[1]).toBe('<text x="163" y="97" font-size="20">' + gaugeRangeLabel[1])
    expect(svgHtml[2]).toBe('<text x="100" y="80" font-size="30">')
  })

    it ('checks correct text of needle with central and range labels', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    let gaugeCentralLabel = '2'
    let gaugeRangeLabel = ['0', '4']
    svg = gauge.labelOutline(svg, gaugeHeight, offset, outerRadius,
                              gaugeRangeLabel, gaugeCentralLabel)

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop()  // removed last element (empty string)
    expect(svgHtml[0]).toBe('<text x="27" y="97" font-size="20">' + gaugeRangeLabel[0])
    expect(svgHtml[1]).toBe('<text x="163" y="97" font-size="20">' + gaugeRangeLabel[1])
    expect(svgHtml[2]).toBe('<text x="92.5" y="80" font-size="30">' + gaugeCentralLabel)
  })
})

describe('chart outlining', () => {
  it ('checks correct parameters of final svg', () => {
    let offset = 10
    let gaugeWidth = 200 - offset * 2
    let gaugeHeight = 100 - offset * 2
    let element = document.createElement('test')
    let needleValue = 50
    let gaugeOptions = {}
    let svg = d3.select(element).append('svg')
              .attr('width', gaugeWidth + offset * 2)
              .attr('height', gaugeHeight + offset * 2)
    svg = gauge.gaugeChart(element, gaugeWidth, needleValue, gaugeOptions)
    let svgHtml = svg.html().split(/<\/[a-z]+>/g)
    svgHtml.pop()  // removed last element (empty string)
    expect(svgHtml.length).toBe(6)
    let pathNum = 0
    let textNum = 0
    svgHtml.forEach(svgEl => {
      if (svgEl.substr(0, 5) === '<path')
        pathNum += 1
      else if (svgEl.substr(0, 5) === '<text')
        textNum += 1
    })
    expect(pathNum).toBe(3)
    expect(textNum).toBe(3)
  })
})

describe('console warnings and errors', () => {
  it ('spies an error about delimiters range', () => {
    spyOn(console, 'error')
    let chartRatios = [-10, 5]
    let message = 'Gauge-chart Error: gauge delimeters have to be LARGER than 0 and LESS than 100'
    gaugeParam.delimeterRangeErrorChecker(chartRatios)
    expect(console.error).toHaveBeenCalledWith(message)
  })
  it ('spies an error about ratios sorting', () => {
    spyOn(console, 'error')
    let chartRatios = [50, 5]
    let message = 'Gauge-chart Error: gauge delimeters are not sorted'
    gaugeParam.delimiterSortErrorChecker(chartRatios)
    expect(console.error).toHaveBeenCalledWith(message)
  })
  it ('spies a warning about lack of colors', () => {
    spyOn(console, 'warn')
    let chartRatios = [2]
    let chartColors = []
    let message =
      'Gauge-chart Warning: list of colors is not complete, standard colors added to the chart'
    gaugeParam.colorsLackWarnChecker(chartRatios, chartColors)
    expect(console.warn).toHaveBeenCalledWith(message)
  })
  it ('spies a warning about too many colors', () => {
    spyOn(console, 'warn')
    let chartRatios = []
    let chartColors = ['red', 'blue']
    let message =
      'Gauge-chart Warning: list of colors exceeds number of slices, therefore it was shortened'
    gaugeParam.colorsExcessWarnChecker(chartRatios, chartColors)
    expect(console.warn).toHaveBeenCalledWith(message)
  })
  it ('spies a warning about neddle value range', () => {
    spyOn(console, 'warn')
    let needleValue = -10
    let message = 'Gauge-chart Warning: value of needdle is less that 0 or larger than 100'
    gaugeParam.needleValueWarnChecker(needleValue)
    expect(console.warn).toHaveBeenCalledWith(message)
  })
})
