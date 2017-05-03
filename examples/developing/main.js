let element = document.querySelector('#gaugeArea')
let gaugeOptions = {
  needleValue: 0,
  needleColor: 'gray',
  arcColors: [],
  arcRatios: [40],
  rangeLabel: [],
  centralLabel: '',
}

GaugeChart.gaugeChart(element, 250, gaugeOptions)
