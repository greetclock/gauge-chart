let element = document.querySelector('#gaugeArea')
let gaugeOptions = {
  needleValue: -1,
  needleColor: 'gray',
  arcColors: [],
  arcRatios: [],
  rangeLabel: [],
  centralLabel: '2',
}

GaugeChart.gaugeChart(element, 200, gaugeOptions)
