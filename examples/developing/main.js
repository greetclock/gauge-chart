let element = document.querySelector('#gaugeArea')

let gaugeOptions = {
  hasNeedle: true,
  needleColor: 'gray',
  needleUpdateSpeed: 1000,
  arcColors: [],
  arcDelimiters: [10, 60],
  rangeLabel: ['0', '350'],
  centralLabel: '',
  rangeLabelFontSize: false,
  outerNeedle: true,
}

GaugeChart
  .gaugeChart(element, 400, gaugeOptions)
  .updateNeedle(50)
