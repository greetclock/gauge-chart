let element = document.querySelector('#gaugeArea')
let gaugeOptions = {
  needleValue: 10,
  needleColor: 'gray',
  arcColors: [],
  arcRatios: [40],
  rangeLabel: ['1', '10'],
  centralLabel: '2',
}

GaugeChart.gaugeChart(element, 250, gaugeOptions)
