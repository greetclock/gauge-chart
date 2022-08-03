import * as GaugeChart from 'https://unpkg.com/gauge-chart@next/dist/bundle.mjs'

let gauge

window.onload = function () {
  const href = window.location.href
  const jsonStrStartId = href.search('\\?')
  let options = {}
  if (jsonStrStartId >= 0) {
    const jsonStr = href
      .substr(jsonStrStartId + 1, href.length - 1)
      .replace(/%22/g, '"')
    options = JSON.parse(decodeURIComponent(jsonStr))
  } else {
    // DEFAULT VALUES
    options = {
      hasNeedle: true,
      outerNeedle: false,
      needleColor: 'gray',
      needleStartValue: 0,
      needleUpdateSpeed: 1000,
      arcColors: ['rgb(44, 151, 222)', 'lightgray'],
      arcDelimiters: [40],
      rangeLabel: ['0', '100'],
    }
  }
  const chartWidth = 400
  const needleValue = 20
  // GAUGE DEPICTION
  setGauge(false, options, chartWidth, needleValue)

  // OPTIONS SETTING AND EDITOR UPDATING
  const allOptions = options
  allOptions.chartWidth = chartWidth
  allOptions.needleValue = needleValue
  setEditorValues(allOptions)
}

function setGauge(isDel, options, chartWidth, needleValue) {
  const element = document.querySelector('#gaugeArea')
  if (isDel) gauge.removeGauge()
  gauge = GaugeChart.gaugeChart(element, chartWidth, options)
  gauge.updateNeedle(needleValue)
}

function setEditorValues(options) {
  const optionNames = [
    'chartWidth',
    'needleValue',
    'hasNeedle',
    'outerNeedle',
    'needleColor',
    'needleStartValue',
    'needleUpdateSpeed',
    'arcColors',
    'arcDelimiters',
    'rangeLabel',
    'centralLabel',
    'rangeLabelFontSize',
  ]
  for (let optionName of optionNames)
    if (options.hasOwnProperty(optionName))
      document.getElementById('input-' + optionName).value = options[optionName]
}

function optionChange() {
  const allOptionNames = [
    'chartWidth',
    'needleValue',
    'hasNeedle',
    'outerNeedle',
    'needleColor',
    'needleStartValue',
    'needleUpdateSpeed',
    'arcColors',
    'arcDelimiters',
    'rangeLabel',
    'centralLabel',
    'rangeLabelFontSize',
  ]
  const allOptions = {}
  const chartWidth = 0
  const needleValue = 0
  for (let optionName of allOptionNames) {
    const optionElement = document.getElementById('input-' + optionName)
    if (optionElement && optionElement.value) {
      // delete all redundant spaces from the string
      const optionVal = optionElement.value.replace(/%22/g, '"')
      if (
        [
          'chartWidth',
          'needleValue',
          'needleStartValue',
          'needleUpdateSpeed',
          'rangeLabelFontSize',
        ].indexOf(optionName) >= 0
      ) {
        allOptions[optionName] = +optionVal
      } else if (['hasNeedle', 'outerNeedle'].indexOf(optionName) >= 0) {
        allOptions[optionName] = optionVal == 'true'
      } else if (['arcDelimiters', 'rangeLabel'].indexOf(optionName) >= 0) {
        allOptions[optionName] = optionVal.split(',')
      } else if (optionName === 'arcColors') {
        allOptions[optionName] = colorsStrToArr(optionVal)
      } else {
        allOptions[optionName] = optionVal
      }
    }
  }
  setGauge(true, allOptions, allOptions.chartWidth, allOptions.needleValue)
}

window.optionChange = optionChange

function colorsStrToArr(str) {
  const colorArr = []
  let color = ''
  let openBracket = false
  for (let char of str) {
    if (char === '(') {
      openBracket = true
      color += char
    } else if (char === ')') {
      openBracket = false
      color += char
    } else if (char === ',' && !openBracket) {
      colorArr.push(color)
      color = ''
    } else {
      color += char
    }
  }
  colorArr.push(color)
  return colorArr
}

function copyAsCode() {
  const optionNames = ['chartWidth', 'needleValue']
  const extraOptionNames = [
    'hasNeedle',
    'outerNeedle',
    'needleColor',
    'needleStartValue',
    'needleUpdateSpeed',
    'arcColors',
    'arcDelimiters',
    'rangeLabel',
    'centralLabel',
    'rangeLabelFontSize',
  ]
  code = ''
  for (optionName of optionNames) {
    const optionVal = document.getElementById('input-' + optionName).value
    code += 'let ' + optionName + ' = ' + optionVal + '\n'
  }
  code += 'let options = {\n'
  for (optionName of extraOptionNames) {
    const optionVal = document.getElementById('input-' + optionName).value
    if (optionVal) {
      if (['hasNeedle', 'outerNeedle'].indexOf(optionName) >= 0) {
        if (optionVal !== 'blank')
          code += '\t' + optionName + ': ' + optionVal + ',\n'
      } else if (
        optionName === 'needleColor' ||
        optionName === 'centralLabel'
      ) {
        code += '\t' + optionName + ': "' + optionVal + '",\n'
      } else if (optionName === 'arcDelimiters') {
        code += '\t' + optionName + ': [' + optionVal + '],\n'
      } else if (optionName === 'arcColors') {
        code += '\t' + optionName + ': ['
        for (val of colorsStrToArr(optionVal)) {
          code += '"' + val + '",'
        }
        code = code.slice(0, -1)
        code += '],\n'
      } else if (optionName === 'rangeLabel') {
        code += '\t' + optionName + ': ['
        for (val of optionVal.split(',')) {
          code += '"' + val + '",'
        }
        code = code.slice(0, -1)
        code += '],\n'
      } else {
        code += '\t' + optionName + ': ' + optionVal + ',\n'
      }
    }
  }
  code += '}'
  const codeElement = document.getElementById('code')
  codeElement.value = code
  codeElement.select()
  document.execCommand('Copy')
}

function saveAsPng() {
  const doctype =
    '<?xml version="1.0" standalone="no"?>' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'

  // serializing SVG XML to a string.
  const source = new XMLSerializer().serializeToString(d3.select('svg').node())
  // creating a file blob of our SVG.
  const blob = new Blob([doctype + source], {
    type: 'image/svg+xml;charset=utf-8',
  })
  const url = window.URL.createObjectURL(blob)
  const width = document.querySelector('svg').getBoundingClientRect().width
  const height = document.querySelector('svg').getBoundingClientRect().height
  // Putting the svg into an image tag so that the Canvas element can read it in.
  const img = d3
    .select('body')
    .append('img')
    .attr('id', 'img')
    .attr('width', width)
    .attr('height', height)
    .style('display', 'none')
    .node()
  const href = d3
    .select('body')
    .append('a')
    .attr('id', 'link')
    .attr('download', 'gauge.png')
  img.onload = function () {
    // putting the image into a canvas element.
    const canvas = d3
      .select('body')
      .append('canvas')
      .attr('id', 'canvas')
      .style('display', 'none')
      .node()
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const canvasUrl = canvas.toDataURL('image/png')
    const img2 = d3
      .select('#link')
      .append('img')
      .attr('id', 'img2')
      .attr('width', width)
      .attr('height', height)
      .style('display', 'none')
      .node()
    // base64 encoded version of the PNG
    img2.src = canvasUrl
    const link = d3.select('#link').attr('href', canvasUrl)
    document.getElementById('link').click()
    // deleting redundant data
    const imgNode = document.getElementById('img')
    const img2Node = document.getElementById('img2')
    const canvasNode = document.getElementById('canvas')
    const linkNode = document.getElementById('link')
    imgNode.parentNode.removeChild(imgNode)
    img2Node.parentNode.removeChild(img2Node)
    canvasNode.parentNode.removeChild(canvasNode)
    linkNode.parentNode.removeChild(linkNode)
  }
  // starting loading the image.
  img.src = url
}

function copyAsLink() {
  const codeElement = document.getElementById('code')
  codeElement.value = code
  codeElement.select()
  document.execCommand('Copy')
}
