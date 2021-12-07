import * as d3 from 'd3'
import { schemePaired } from 'd3-scale-chromatic'

import * as gauge from './gauge'
import { Gauge } from './gauge-interface'
import * as gaugeParam from './param-checker'

function pathValueChecker(svgHtml, startChar, stopChar, expectedValues) {
  svgHtml = svgHtml.slice(svgHtml.search(startChar) + 1, svgHtml.length)
  let svgA = svgHtml
    .slice(0, stopChar ? svgHtml.search(stopChar) : svgHtml.length)
    .split(',')
    .map(Number)
  svgA.forEach((coord, i) => {
    expect(coord).toBeCloseTo(expectedValues[i], 1)
  })
  return svgHtml
}

describe('variable modifiers', () => {
  it('converts value in degrees into radians', () => {
    let perc = 0
    expect(gauge.perc2RadWithShift(perc)).toEqual(-0.5 * Math.PI)

    perc = 10
    expect(gauge.perc2RadWithShift(perc)).toEqual(-0.4 * Math.PI)

    perc = 100
    expect(gauge.perc2RadWithShift(perc)).toEqual(0.5 * Math.PI)
  })

  it('checks whether the number of colors is ok and corrects it if not', () => {
    let arcDelimiters = [2, 5]
    let arcColors = ['red']
    expect(gauge.arcColorsModifier(arcDelimiters, arcColors)).toEqual([
      'red',
      schemePaired[0],
      schemePaired[1],
    ])

    arcDelimiters = [2]
    arcColors = ['red', 'blue', 'green']
    expect(gauge.arcColorsModifier(arcDelimiters, arcColors)).toEqual([
      'red',
      'blue',
    ])

    arcDelimiters = [2, 5]
    arcColors = ['red', 'blue', 'green']
    expect(gauge.arcColorsModifier(arcDelimiters, arcColors)).toEqual(arcColors)
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

  it('checks arc svg outline', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let arcDelimiters = []
    let arcColors = ['red']
    gauge.arcOutline(
      svg,
      chartHeight,
      offset,
      arcColors,
      outerRadius,
      arcDelimiters,
      true,
      0,
      undefined,
      undefined,
      undefined,
      'sans-serif',
      '#000111',
    )
    expect(svg).not.toBe(null)
    expect(svg.html().match(/path/g).length / 2).toBe(2)
  })

  it('checks correct path of arc', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let arcDelimiters = []
    let arcColors = ['red']
    gauge.arcOutline(
      svg,
      chartHeight,
      offset,
      arcColors,
      outerRadius,
      arcDelimiters,
      true,
      0,
      undefined,
      undefined,
      undefined,
      'sans-serif',
      'red',
    )
    // define the whole path string (M...A...L...A...Z for svg arc)

    let svgHtml = svg
      .html()
      .slice(svg.html().search('M'), svg.html().search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-80, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 1, 1, 80, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [60, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [60, 60, 0, 1, 0, -60, 0])
  })

  it('checks splitting of arc', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let arcDelimiters = [50]
    let arcColors = ['red', 'blue']
    gauge.arcOutline(
      svg,
      chartHeight,
      offset,
      arcColors,
      outerRadius,
      arcDelimiters,
      true,
      0,
      undefined,
      [],
      undefined,
      'sans-serif',
      'red',
    )
    // number of paths in svg html has to be 4 (2 arcs and 2 arc shadows onmouseover)
    expect(svg.html().match(/path/g).length / 2).toBe(4)

    let svgHtmlPath = svg
      .html()
      .slice(svg.html().search('path'), svg.html().search('/path'))
    let svgLeftHtml = svg.html().slice(svg.html().search('/path') + 5)

    let svgHtml = svgHtmlPath.slice(
      svgHtmlPath.search('M'),
      svgHtmlPath.search('Z'),
    )
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-80, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 0, 1, 0, -80])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [0, -60])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [60, 60, 0, 0, 0, -60, 0])

    svgHtmlPath = svgLeftHtml.slice(
      svgLeftHtml.search('path'),
      svgLeftHtml.search('/path'),
    )
    svgLeftHtml = svgLeftHtml.slice(svgLeftHtml.search('/path') + 5)

    svgHtml = svgHtmlPath.slice(
      svgHtmlPath.search('M'),
      svgHtmlPath.search('Z'),
    )
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-88, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [88, 88, 0, 0, 1, 0, -88])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [0, -80])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [80, 80, 0, 0, 0, -80, 0])

    svgHtmlPath = svgLeftHtml.slice(
      svgLeftHtml.search('path'),
      svgLeftHtml.search('/path'),
    )
    svgLeftHtml = svgLeftHtml.slice(svgLeftHtml.search('/path') + 5)

    svgHtml = svgHtmlPath.slice(
      svgHtmlPath.search('M'),
      svgHtmlPath.search('Z'),
    )
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [0, -80])
    svgHtml = pathValueChecker(svgHtml, 'A', 'L', [80, 80, 0, 0, 1, 80, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'A', [60, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [60, 60, 0, 0, 0, 0, -60])

    svgHtmlPath = svgLeftHtml.slice(
      svgLeftHtml.search('path'),
      svgLeftHtml.search('/path'),
    )
    svgLeftHtml = svgLeftHtml.slice(svgLeftHtml.search('/path') + 5)

    svgHtml = svgHtmlPath.slice(
      svgHtmlPath.search('M'),
      svgHtmlPath.search('Z'),
    )
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

  it('checks needle svg outline', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    let outerNeedle = false
    gauge.needleBaseOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      centralLabel,
      outerNeedle,
    )
    expect(svg).not.toBe(null)
    expect(svg.html().match(/path/g).length / 2).toBe(1)
  })

  it('checks correct path of needle base without label', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    let outerNeedle = false
    gauge.needleBaseOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      centralLabel,
      outerNeedle,
    )
    // define the whole path string (M...A...A...Z for svg arc)
    let svgHtml = svg
      .html()
      .slice(svg.html().search('M') + 1, svg.html().search('Z'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'A', [-8, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', 'A', [8, 8, 0, 1, 1, 8, 0])
    svgHtml = pathValueChecker(svgHtml, 'A', '', [8, 8, 0, 1, 1, -8, 0])
  })

  it('checks correct path of needle base with label', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = '23'
    let outerNeedle = false
    gauge.needleBaseOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      centralLabel,
      outerNeedle,
    )

    let svgHtml = svg
      .html()
      .slice(svg.html().search('M'), svg.html().search('Z'))
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

  it('checks needle svg outline', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    let outerNeedle = false
    let needleStartValue = 0
    gauge.needleOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      outerRadius,
      centralLabel,
      outerNeedle,
      needleStartValue,
    )
    expect(svg).not.toBe(null)
    expect(svg.html().match(/path/g).length / 2).toBe(1)
  })

  it('checks correct path of needle without label', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    let outerNeedle = false
    let needleStartValue = 0
    gauge.needleOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      outerRadius,
      centralLabel,
      outerNeedle,
      needleStartValue,
    )
    // define the whole path string (M...L...L...L...L... for svg arc)
    let svgHtml = svg
      .html()
      .slice(svg.html().search('M'), svg.html().search('" stroke'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'L', [-58.2, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [0, 4])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [4, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [0, -4])
    svgHtml = pathValueChecker(svgHtml, 'L', '', [-58.2, 0])
  })

  it('checks correct path of needle with label', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = '23'
    let outerNeedle = false
    let needleStartValue = 0
    gauge.needleOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      outerRadius,
      centralLabel,
      outerNeedle,
      needleStartValue,
    )
    // define the whole path string (M...L...L...L... for svg arc)
    console.log('hi')
    let svgHtml = svg
      .html()
      .slice(svg.html().search('M') + 1, svg.html().search('" stroke'))
    svgHtml = pathValueChecker(svgHtml, 'M', 'L', [-58.2, 0])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [-42, 9.3])
    svgHtml = pathValueChecker(svgHtml, 'L', 'L', [-42, -9.3])
    svgHtml = pathValueChecker(svgHtml, 'L', '', [-58.2, 0])
  })
})

describe('label outlining', () => {
  let offset = 10
  let areaWidth = 200
  let chartWidth = 200 - offset * 2
  let chartHeight = 100 - offset * 2
  let element = document.createElement('test')
  let outerRadius = chartHeight * 0.75

  it('checks label svg outline', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = '2'
    let rangeLabel = ['0', '4']
    let rangeLabelFontSize = null
    gauge.labelOutline(
      svg,
      areaWidth,
      chartHeight,
      offset,
      outerRadius,
      rangeLabel,
      centralLabel,
      rangeLabelFontSize,
      'sans-serif',
    )
    expect(svg).not.toBe(null)
    expect(svg.html().match(/text/g).length / 2).toBe(3)
  })

  it('checks correct text of gauge with central label', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = '2'
    let rangeLabel = []
    let rangeLabelFontSize = null
    gauge.labelOutline(
      svg,
      areaWidth,
      chartHeight,
      offset,
      outerRadius,
      rangeLabel,
      centralLabel,
      rangeLabelFontSize,
      'sans-serif',
    )

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop() // removed last element (empty string)
    expect(svgHtml[0]).toBe(
      '<text x="0" y="106.8" font-size="14px"' + ' font-family="sans-serif">',
    )
    expect(svgHtml[1]).toBe(
      '<text x="0" y="106.8" font-size="14px"' + ' font-family="sans-serif">',
    )
    expect(svgHtml[2]).toBe(
      '<text x="94.12" y="90" font-size="21px"' +
        ' font-family="sans-serif">' +
        centralLabel,
    )
  })

  it('checks correct text of gauge with range labels', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    let rangeLabel = ['0', '4']
    let rangeLabelFontSize = null
    gauge.labelOutline(
      svg,
      areaWidth,
      chartHeight,
      offset,
      outerRadius,
      rangeLabel,
      centralLabel,
      rangeLabelFontSize,
      'sans-serif',
    )

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop() // removed last element (empty string)
    expect(svgHtml[0]).toBe(
      '<text x="25.8" y="106.8" font-size="14px"' +
        ' font-family="sans-serif">' +
        rangeLabel[0],
    )
    expect(svgHtml[1]).toBe(
      '<text x="165.8" y="106.8" font-size="14px"' +
        ' font-family="sans-serif">' +
        rangeLabel[1],
    )
    expect(svgHtml[2]).toBe(
      '<text x="100" y="90" font-size="21px"' + ' font-family="sans-serif">',
    )
  })

  it('checks correct text of gauge with central and range labels', () => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = '2'
    let rangeLabel = ['0', '4']
    let rangeLabelFontSize = null
    gauge.labelOutline(
      svg,
      areaWidth,
      chartHeight,
      offset,
      outerRadius,
      rangeLabel,
      centralLabel,
      rangeLabelFontSize,
      'sans-serif',
    )

    let svgHtml = svg.html().split('</text>')
    svgHtml.pop() // removed last element (empty string)
    expect(svgHtml[0]).toBe(
      '<text x="25.8" y="106.8" font-size="14px"' +
        ' font-family="sans-serif">' +
        rangeLabel[0],
    )
    expect(svgHtml[1]).toBe(
      '<text x="165.8" y="106.8" font-size="14px"' +
        ' font-family="sans-serif">' +
        rangeLabel[1],
    )
    expect(svgHtml[2]).toBe(
      '<text x="94.12" y="90" font-size="21px"' +
        ' font-family="sans-serif">' +
        centralLabel,
    )
  })
})

describe('chart outlining', () => {
  it('checks correct parameters of final svg', () => {
    let areaWidth = 200
    let element = document.createElement('test')
    let gaugeOptions = {}
    let g = gauge.gaugeChart(element, areaWidth, gaugeOptions)
    let svgHtml = (g as any).svg.html().split(/<\/[a-z]+>/g)
    svgHtml.pop() // removed last element (empty string)
    expect(svgHtml.length).toBe(5)
    let pathNum = 0
    let textNum = 0
    svgHtml.forEach(svgEl => {
      if (svgEl.substr(0, 5) === '<path') pathNum += 1
      else if (svgEl.substr(0, 5) === '<text') textNum += 1
    })
    expect(pathNum).toBe(2)
    expect(textNum).toBe(3)
  })
})

describe('needle value updating', () => {
  let offset = 10
  let chartWidth = 200 - offset * 2
  let chartHeight = 100 - offset * 2
  let element = document.createElement('test')
  let outerRadius = chartHeight * 0.75
  let needleColor = 'gray'

  it('checks correct path of new needle position', done => {
    let svg = d3
      .select(element)
      .append('svg')
      .attr('width', chartWidth + offset * 2)
      .attr('height', chartHeight + offset * 2)
    let centralLabel = ''
    let outerNeedle = false
    let needleStartValue = 0
    let needle = gauge.needleOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      outerRadius,
      centralLabel,
      outerNeedle,
      needleStartValue,
    )
    let needleUpdateSpeed = 1000
    let g = new Gauge(svg, needleUpdateSpeed, needle)
    g.updateNeedle(10)
    setTimeout(() => {
      // define the whole path string (M...L...L...L...L... for svg arc)
      let svgHtml = svg
        .html()
        .slice(svg.html().search('M'), svg.html().search('" stroke'))
      svgHtml = pathValueChecker(svgHtml, 'M', 'L', [-55.4, -18])
      svgHtml = pathValueChecker(svgHtml, 'L', 'L', [-1.2, 3.8])
      svgHtml = pathValueChecker(svgHtml, 'L', 'L', [3.8, 1.2])
      svgHtml = pathValueChecker(svgHtml, 'L', 'L', [1.2, -3.8])
      svgHtml = pathValueChecker(svgHtml, 'L', '', [-55.4, -18])
      done()
    }, needleUpdateSpeed * 2)
  })
})

describe('console warnings and errors', () => {
  it('spies an error about delimiters range', () => {
    spyOn(console, 'error')
    let arcDelimiters = [-10, 5]
    let message =
      'Gauge-chart Error: gauge delimiters have to be LARGER than 0 and LESS than 100'
    gaugeParam.delimiterRangeErrorChecker(arcDelimiters)
    expect(console.error).toHaveBeenCalledWith(message)
  })
  it('spies an error about delimiters sorting', () => {
    spyOn(console, 'error')
    let arcDelimiters = [50, 5]
    let message = 'Gauge-chart Error: gauge delimiters are not sorted'
    gaugeParam.delimiterSortErrorChecker(arcDelimiters)
    expect(console.error).toHaveBeenCalledWith(message)
  })
  it('spies a warning about lack of colors', () => {
    spyOn(console, 'warn')
    let arcDelimiters = [2]
    let arcColors = []
    let message =
      'Gauge-chart Warning: list of colors is not complete, standard colors added to the chart'
    gaugeParam.colorsLackWarnChecker(arcDelimiters, arcColors)
    expect(console.warn).toHaveBeenCalledWith(message)
  })
  it('spies a warning about too many colors', () => {
    spyOn(console, 'warn')
    let arcDelimiters = []
    let arcColors = ['red', 'blue']
    let message =
      'Gauge-chart Warning: list of colors exceeds number of slices, therefore it was shortened'
    gaugeParam.colorsExcessWarnChecker(arcDelimiters, arcColors)
    expect(console.warn).toHaveBeenCalledWith(message)
  })
  it('spies a warning about neddle value range', () => {
    spyOn(console, 'warn')
    let needleValue = -10
    let message =
      'Gauge-chart Warning: value of needdle is less that 0 or larger than 100'
    gaugeParam.needleValueWarnChecker(needleValue)
    expect(console.warn).toHaveBeenCalledWith(message)
  })
})
