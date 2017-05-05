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
    let arcRatios = [2, 5]
    let arcColors = ['red']
    expect(gauge.arcColorsModifier(arcRatios, arcColors))
                .toEqual(['red', schemePaired[0], schemePaired[1]])

    arcRatios = [2]
    arcColors = ['red', 'blue', 'green']
    expect(gauge.arcColorsModifier(arcRatios, arcColors)).toEqual(['red', 'blue'])

    arcRatios = [2, 5]
    arcColors = ['red', 'blue', 'green']
    expect(gauge.arcColorsModifier(arcRatios, arcColors)).toEqual(arcColors)
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
  let chartWidth = 200 - offset * 2
  let chartHeight = 100 - offset * 2
  let outerRadius = chartHeight * 0.75
  let element = document.createElement('test')

  it ('checks arc svg outline', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let arcRatios = []
    let arcColors = ['red']
    svg = gauge.arcOutline(svg, chartHeight, offset, arcColors, outerRadius, arcRatios)
    expect(svg).not.toBe(null)
    expect((svg.html()).match(/path/g).length / 2).toBe(2)
  })

  it ('checks correct path of arc', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let arcRatios = []
    let arcColors = ['red']
    svg = gauge.arcOutline(svg, chartHeight, offset, arcColors, outerRadius, arcRatios)
    // define the whole path string (M...A...L...A...Z for svg arc)

    let svgHtml = svg.html().slice(svg.html().search('M'), svg.html().search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-80, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 1, 1, 80, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [60, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [60, 60, 0, 1, 0, -60, 0])
  })

  it ('checks splitting of arc', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let arcRatios = [50]
    let arcColors = ['red', 'blue']
    svg = gauge.arcOutline(svg, chartHeight, offset, arcColors, outerRadius, arcRatios)
    // number of paths in svg html has to be 4 (2 arcs and 2 arc shadows onmouseover)
    expect((svg.html()).match(/path/g).length / 2).toBe(4)

    let svgHtmlPath = svg.html().slice(svg.html().search('path'),
               svg.html().search('/path'))
    let svgLeftHtml = svg.html().slice(svg.html().search('/path') + 5)

    let svgHtml = svgHtmlPath.slice(svgHtmlPath.search('M'),
               svgHtmlPath.search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-80, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 0, 1, 0, -80])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [0, -60])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [60, 60, 0, 0, 0, -60, 0])

    svgHtmlPath = svgLeftHtml.slice(svgLeftHtml.search('path'),
               svgLeftHtml.search('/path'))
    svgLeftHtml = svgLeftHtml.slice(svgLeftHtml.search('/path') + 5)

    svgHtml = svgHtmlPath.slice(svgHtmlPath.search('M'),
               svgHtmlPath.search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-88, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [88, 88, 0, 0, 1, 0, -88])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [0, -80])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [80, 80, 0, 0, 0, -80, 0])

    svgHtmlPath = svgLeftHtml.slice(svgLeftHtml.search('path'),
               svgLeftHtml.search('/path'))
    svgLeftHtml = svgLeftHtml.slice(svgLeftHtml.search('/path') + 5)

    svgHtml = svgHtmlPath.slice(svgHtmlPath.search('M'),
               svgHtmlPath.search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [0, -80])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 0, 1, 80, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [60, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [60, 60, 0, 0, 0, 0, -60])

    svgHtmlPath = svgLeftHtml.slice(svgLeftHtml.search('path'),
               svgLeftHtml.search('/path'))
    svgLeftHtml = svgLeftHtml.slice(svgLeftHtml.search('/path') + 5)

    svgHtml = svgHtmlPath.slice(svgHtmlPath.search('M'),
               svgHtmlPath.search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [0, -88])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [88, 88, 0, 0, 1, 88, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [80, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [80, 80, 0, 0, 0, 0, -80])
  })
})

describe('needle base outlining', () => {
  let offset = 10
  let chartWidth = 200 - offset * 2
  let chartHeight = 100 - offset * 2
  let element = document.createElement('test')
  let needleColor = 'gray'

  it ('checks needle svg outline', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    svg = gauge.needleBaseOutline(svg, chartHeight, offset, needleColor, centralLabel)
    expect(svg).not.toBe(null)
    expect((svg.html()).match(/path/g).length / 2).toBe(1)
  })

  it ('checks correct path of needle base without label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    svg = gauge.needleBaseOutline(svg, chartHeight, offset, needleColor, centralLabel)
    // define the whole path string (M...A...A...Z for svg arc)
    let svgHtml = svg.html().slice(svg.html().search('M') + 1, svg.html().search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-8, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'A', [8, 8, 0, 1, 1, 8, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [8, 8, 0, 1, 1, -8, 0])
  })

  it ('checks correct path of needle base with label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = '23'
    svg = gauge.needleBaseOutline(svg, chartHeight, offset, needleColor, centralLabel)

    let svgHtml = svg.html().slice(svg.html().search('M'), svg.html().search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-40, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'A', [40, 40, 0, 1, 1, 40, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [40, 40, 0, 1, 1, -40, 0])
  })
})

describe('needle outlining', () => {
  let offset = 10
  let chartWidth = 200 - offset * 2
  let chartHeight = 100 - offset * 2
  let element = document.createElement('test')
  let outerRadius = chartHeight * 0.75
  let needleColor = 'gray'
  let needleValue = 50

  it ('checks needle svg outline', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    svg = gauge.needleOutline(svg, chartHeight, offset, needleColor,
                                outerRadius, needleValue, centralLabel)
    expect(svg).not.toBe(null)
    expect((svg.html()).match(/path/g).length / 2).toBe(1)
  })

  it ('checks correct path of needle without label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    svg = gauge.needleOutline(svg, chartHeight, offset, needleColor,
                                outerRadius, needleValue, centralLabel)
    // define the whole path string (M...L...L...L...L... for svg arc)
    let svgHtml = svg.html().slice(svg.html().search('M'), svg.html().search('" stroke'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'L', [0, -58.2])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [-4, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [0, 4])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [4, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', '', [0, -58.2])
  })

  it ('checks correct path of needle with label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = '23'
    svg = gauge.needleOutline(svg, chartHeight, offset, needleColor,
                                outerRadius, needleValue, centralLabel)
    // define the whole path string (M...L...L...L... for svg arc)
    let svgHtml = svg.html().slice(svg.html().search('M') + 1, svg.html().search('" stroke'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'L', [0, -58.2])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [-28, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [0, 28])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [28, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', '', [0, -58.2])
  })
})

describe('label outlining', () => {
  let offset = 10
  let areaWidth = 200
  let chartWidth = 200 - offset * 2
  let chartHeight = 100 - offset * 2
  let element = document.createElement('test')
  let outerRadius = chartHeight * 0.75

  it ('checks label svg outline', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = '2'
    let rangeLabel = ['0', '4']
    svg = gauge.labelOutline(svg, areaWidth, chartHeight, offset, outerRadius,
                              rangeLabel, centralLabel)
    expect(svg).not.toBe(null)
    expect((svg.html()).match(/text/g).length / 2).toBe(3)
  })

  it ('checks correct text of gauge with central label', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = '2'
    let rangeLabel = []
    svg = gauge.labelOutline(svg, areaWidth, chartHeight, offset, outerRadius,
                              rangeLabel, centralLabel)

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop()  // removed last element (empty string)
    expect(svgHtml[0]).toBe('<text x="0" y="109.2" font-size="16px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">')
    expect(svgHtml[1]).toBe('<text x="0" y="109.2" font-size="16px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">')
    expect(svgHtml[2]).toBe('<text x="93.28" y="90" font-size="24px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">' + centralLabel)
  })

  it ('checks correct text of gauge with range labels', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    let rangeLabel = ['0', '4']
    svg = gauge.labelOutline(svg, areaWidth, chartHeight, offset, outerRadius,
                              rangeLabel, centralLabel)

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop()  // removed last element (empty string)
    expect(svgHtml[0]).toBe('<text x="25.2" y="109.2" font-size="16px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">' + rangeLabel[0])
    expect(svgHtml[1]).toBe('<text x="165.2" y="109.2" font-size="16px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">' + rangeLabel[1])
    expect(svgHtml[2]).toBe('<text x="100" y="90" font-size="24px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">')
  })

    it ('checks correct text of gauge with central and range labels', () => {
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    let centralLabel = '2'
    let rangeLabel = ['0', '4']
    svg = gauge.labelOutline(svg, areaWidth, chartHeight, offset, outerRadius,
                              rangeLabel, centralLabel)

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop()  // removed last element (empty string)
    expect(svgHtml[0]).toBe('<text x="25.2" y="109.2" font-size="16px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">' + rangeLabel[0])
    expect(svgHtml[1]).toBe('<text x="165.2" y="109.2" font-size="16px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">' + rangeLabel[1])
    expect(svgHtml[2]).toBe('<text x="93.28" y="90" font-size="24px"' +
                       ' font-family="Roboto,Helvetica Neue,sans-serif">' + centralLabel)
  })
})

describe('chart outlining', () => {
  it ('checks correct parameters of final svg', () => {
    let offset = 10
    let areaWidth = 200
    let chartWidth = 200 - offset * 2
    let chartHeight = 100 - offset * 2
    let element = document.createElement('test')
    let gaugeOptions = {}
    let svg = d3.select(element).append('svg')
              .attr('width', chartWidth + offset * 2)
              .attr('height', chartHeight + offset * 2)
    svg = gauge.gaugeChart(element, areaWidth, gaugeOptions)
    let svgHtml = svg.html().split(/<\/[a-z]+>/g)
    svgHtml.pop()  // removed last element (empty string)
    expect(svgHtml.length).toBe(5)
    let pathNum = 0
    let textNum = 0
    svgHtml.forEach(svgEl => {
      if (svgEl.substr(0, 5) === '<path')
        pathNum += 1
      else if (svgEl.substr(0, 5) === '<text')
        textNum += 1
    })
    expect(pathNum).toBe(2)
    expect(textNum).toBe(3)
  })
})

describe('console warnings and errors', () => {
  it ('spies an error about delimiters range', () => {
    spyOn(console, 'error')
    let arcRatios = [-10, 5]
    let message = 'Gauge-chart Error: gauge delimeters have to be LARGER than 0 and LESS than 100'
    gaugeParam.delimeterRangeErrorChecker(arcRatios)
    expect(console.error).toHaveBeenCalledWith(message)
  })
  it ('spies an error about ratios sorting', () => {
    spyOn(console, 'error')
    let arcRatios = [50, 5]
    let message = 'Gauge-chart Error: gauge delimeters are not sorted'
    gaugeParam.delimiterSortErrorChecker(arcRatios)
    expect(console.error).toHaveBeenCalledWith(message)
  })
  it ('spies a warning about lack of colors', () => {
    spyOn(console, 'warn')
    let arcRatios = [2]
    let arcColors = []
    let message =
      'Gauge-chart Warning: list of colors is not complete, standard colors added to the chart'
    gaugeParam.colorsLackWarnChecker(arcRatios, arcColors)
    expect(console.warn).toHaveBeenCalledWith(message)
  })
  it ('spies a warning about too many colors', () => {
    spyOn(console, 'warn')
    let arcRatios = []
    let arcColors = ['red', 'blue']
    let message =
      'Gauge-chart Warning: list of colors exceeds number of slices, therefore it was shortened'
    gaugeParam.colorsExcessWarnChecker(arcRatios, arcColors)
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
