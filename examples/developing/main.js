let element = document.querySelector('#gaugeArea')

let gaugeOptions = {
  // needle options
  hasNeedle: true,
  outerNeedle: false,
  needleColor: 'gray',
  needleStartValue: 10,
  needleUpdateSpeed: 1000,
  // arc options
  arcColors: [],
  arcDelimiters: [10, 60],
  // label options
  rangeLabel: ['0', '350'],
  centralLabel: '10',
  rangeLabelFontSize: false,
}

GaugeChart
  .gaugeChart(element, 400, gaugeOptions)
  .updateNeedle(50)
