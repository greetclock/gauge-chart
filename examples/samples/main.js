let gauge
window.onload = function() {
	let href = window.location.href
	let jsonStrStartId = href.search('\\?')
	let options = {}
	if (jsonStrStartId >= 0) {
		let jsonStr = href.substr(jsonStrStartId + 1, href.length - 1).replace(/%22/g, '"')
		options = JSON.parse(jsonStr)
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
  let chartWidth = 400
  let needleValue = 20
  // GAUGE DEPICTION
  setGauge(false, options, chartWidth, needleValue)
  
  // OPTIONS SETTING AND EDITOR UPDATING
  let allOptions = options
  allOptions.chartWidth = chartWidth
  allOptions.needleValue = needleValue
  setEditorValues(allOptions)
}

function setGauge(isDel, options, chartWidth, needleValue) {
  let element = document.querySelector('#gaugeArea')
  if (isDel)
		gauge.removeGauge()
  gauge = GaugeChart.gaugeChart(element, chartWidth, options)
  gauge.updateNeedle(needleValue)
}
  
function setEditorValues(options) {
  optionNames = ['chartWidth', 'needleValue', 'hasNeedle', 'outerNeedle', 'needleColor', 'needleStartValue',
	  'needleUpdateSpeed', 'arcColors', 'arcDelimiters', 'rangeLabel', 'centralLabel', 'rangeLabelFontSize']
  for (optionName of optionNames)
		if (options.hasOwnProperty(optionName))
	  	document.getElementById('input-' + optionName).value = options[optionName]
}

function optionChange() {
  allOptionNames = ['chartWidth', 'needleValue', 'hasNeedle', 'outerNeedle', 'needleColor', 'needleStartValue',
	  'needleUpdateSpeed', 'arcColors', 'arcDelimiters', 'rangeLabel', 'centralLabel', 'rangeLabelFontSize']
	let allOptions = {}
  let chartWidth = 0
  let needleValue = 0
  for (optionName of allOptionNames) {
		let optionElement = document.getElementById('input-' + optionName)
		if (optionElement && optionElement.value) {
			// delete all redundant spaces from the string
			let optionVal = optionElement.value.replace(/%22/g, '"')
			if (['chartWidth', 'needleValue', 'needleStartValue', 'needleUpdateSpeed',
			     'rangeLabelFontSize'].indexOf(optionName) >= 0) {
				allOptions[optionName] = +optionVal
		  } else if (['hasNeedle', 'outerNeedle'].indexOf(optionName) >= 0) {
		    allOptions[optionName] = (optionVal == 'true')
		  } else if (['arcDelimiters', 'rangeLabel'].indexOf(optionName) >= 0) {
		    allOptions[optionName] = optionVal.split(',')
		  } else if (optionName === 'arcColors') {
				allOptions[optionName] = colorsStrToArr(optionVal)
		  } else {
				allOptions[optionName] = optionVal
		  }
		}
	}
  setGauge(true, allOptions, allOptions['chartWidth'], allOptions['needleValue'])
}
  
function colorsStrToArr(str) {
  let colorArr = []
  let color = ''
  let openBracket = false
  for (char of str) {
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
	let optionNames = ['chartWidth', 'needleValue']
	let extraOptionNames = ['hasNeedle', 'outerNeedle', 'needleColor', 'needleStartValue',
		'needleUpdateSpeed', 'arcColors', 'arcDelimiters', 'rangeLabel', 'centralLabel', 'rangeLabelFontSize']
	code = ''
	for (optionName of optionNames) {
		let optionVal = document.getElementById('input-' + optionName).value
		code += 'let ' + optionName + ' = ' + optionVal + '\n'
	}
	code += 'let options = {\n'
	for (optionName of extraOptionNames) {
		let optionVal = document.getElementById('input-' + optionName).value
		if (optionVal) {
			if (['hasNeedle', 'outerNeedle'].indexOf(optionName) >= 0) {
			  if (optionVal !== 'blank')
					code += '\t' + optionName + ': ' + optionVal + ',\n'
			} else if (optionName === 'needleColor' || optionName === 'centralLabel') {
				code += '\t' + optionName + ': "' + optionVal + '",\n'
			}	else if (optionName === 'arcDelimiters') {
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
	let codeElement = document.getElementById('code')
	codeElement.value = code
	codeElement.select()
	document.execCommand('Copy')
}

function saveAsPng() {
	let doctype = '<?xml version="1.0" standalone="no"?>'
		+ '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
	
		// serializing SVG XML to a string.
	let source = (new XMLSerializer()).serializeToString(d3.select('svg').node())
	// creating a file blob of our SVG.
	let blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' })
	let url = window.URL.createObjectURL(blob)
	let width = document.querySelector('svg').getBoundingClientRect().width
	let height = document.querySelector('svg').getBoundingClientRect().height
	// Putting the svg into an image tag so that the Canvas element can read it in.
	let img = d3.select('body').append('img')
		.attr('id', 'img')
	 .attr('width', width)
	 .attr('height', height)
	 .style('display', 'none')
	 .node()
	let href = d3.select('body').append('a')
		.attr('id', 'link')
		.attr('download', 'gauge.png')
	img.onload = function() {
		// putting the image into a canvas element.
		let canvas = d3.select('body').append('canvas')
			.attr('id', 'canvas')
			.style('display', 'none')
			.node()
		canvas.width = width
		canvas.height = height
		let ctx = canvas.getContext('2d')
		ctx.drawImage(img, 0, 0)
		let canvasUrl = canvas.toDataURL('image/png')
		let img2 = d3.select('#link').append('img')
			.attr('id', 'img2')
			.attr('width', width)
			.attr('height', height)
			.style('display', 'none')
			.node()
		// base64 encoded version of the PNG
		img2.src = canvasUrl
		let link = d3.select('#link')
			.attr('href', canvasUrl)
		document.getElementById('link').click()
		// deleting redundant data
		let imgNode = document.getElementById('img')
		let img2Node = document.getElementById('img2')
		let canvasNode = document.getElementById('canvas')
		let linkNode = document.getElementById('link')
		imgNode.parentNode.removeChild(imgNode)
		img2Node.parentNode.removeChild(img2Node)
		canvasNode.parentNode.removeChild(canvasNode)
		linkNode.parentNode.removeChild(linkNode)
	}
	// starting loading the image.
	img.src = url
}

function copyAsLink() {
	let codeElement = document.getElementById('code')
	codeElement.value = code
	codeElement.select()
	document.execCommand('Copy')
}
