let gauge
window.onload = function() {
  // DEFAULT VALUES
  let options = {
      hasNeedle: true,
	outerNeedle: false,
	needleColor: 'gray',
	needleStartValue: 0,
	needleUpdateSpeed: 1000,
      arcColors: ['rgb(44, 151, 222)', 'lightgray'],
      arcDelimiters: [40],
      rangeLabel: ['0', '100'],
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
  if (isDel) {
	gauge.removeGauge()
  }
  gauge = GaugeChart.gaugeChart(element, chartWidth, options)
  gauge.updateNeedle(needleValue)
}
  
function setEditorValues(options) {
    optionNames = ['chartWidth', 'needleValue', 'hasNeedle', 'outerNeedle', 'needleColor', 'needleStartValue',
				 'needleUpdateSpeed', 'arcColors', 'arcDelimiters', 'rangeLabel', 'centralLabel', 'rangeLabelFontSize']
  for (let i=0; i < optionNames.length; i++) {
	if (options[optionNames[i]] !== undefined) {
	  document.getElementById('input-' + optionNames[i]).value = options[optionNames[i]]
	}
  }
}

function optionChange() {
    allOptionNames = ['chartWidth', 'needleValue', 'hasNeedle', 'outerNeedle', 'needleColor', 'needleStartValue',
				 'needleUpdateSpeed', 'arcColors', 'arcDelimiters', 'rangeLabel', 'centralLabel', 'rangeLabelFontSize']
  let options = {}
  let chartWidth = 0
  let needleValue = 0
  for (let i=0; i < allOptionNames.length; i++) {
	if (document.getElementById('input-' + allOptionNames[i]) &&
		  document.getElementById('input-' + allOptionNames[i]).value) {
	  let optionName = allOptionNames[i]
	  let optionVal = document.getElementById('input-' + optionName).value
	  if (optionName === 'chartWidth') {
		chartWidth = +optionVal
	  } else if (optionName === 'needleValue') {
		needleValue = +optionVal
	  } else if (optionName === 'hasNeedle' ||
			     optionName === 'outerNeedle') {
	    options[optionName] = (optionVal == 'true')
	  } else if (optionName === 'needleStartValue' ||
				 optionName === 'needleUpdateSpeed' ||
				 optionName === 'rangeLabelFontSize') {
		options[optionName] = +optionVal
	  } else if (optionName === 'arcDelimiters' ||
				 optionName === 'rangeLabel') {
	    options[optionName] = optionVal.split(',')
	  } else if (optionName === 'arcColors') {
		options[optionName] = colorsStrToArr(optionVal)
	  } else {
		options[optionName] = optionVal
	  }
	}
  }
  setGauge(true, options, chartWidth, needleValue)
}
  
function colorsStrToArr(str) {
  let arr = []
  let color = ''
  let openBracket = false
  for (let i = 0; i < str.length; i++) {
	if (str[i] === '(') {
	  openBracket = true
	  color += str[i]
	} else if (str[i] === ')') {
	  openBracket = false
	  color += str[i]
	} else if (str[i] === ',' && !openBracket) {
	  arr.push(color)
	  color = ''
	} else {
	  color += str[i]	
	}
  }
  arr.push(color)
  return arr
}
