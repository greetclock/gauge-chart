let element = document.querySelector('#gaugeArea')

let gaugeOptions = {
  hasNeedle: true,
  needleColor: 'gray',
  needleUpdateSpeed: 1000,
  arcColors: [],
  arcDelimiters: [],
  rangeLabel: ['', ''],
  centralLabel: '',
}

GaugeChart
  .gaugeChart(element, 200, gaugeOptions)
  .updateNeedle(80)
