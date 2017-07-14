let element = document.querySelector('#gaugeArea')

let gaugeOptions = {
  hasNeedle: true,
  needleColor: 'gray',
  needleUpdateSpeed: 1000,
  arcColors: [],
  arcDelimiters: [],
  rangeLabel: ['', ''],
  centralLabel: '',
  rangeLabelFontSize: null,
}

GaugeChart
  .gaugeChart(element, 185, gaugeOptions)
  .updateNeedle(80)
