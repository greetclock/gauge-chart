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
  arcDelimiters: [10, 60, 90],
  arcPadding: 6,
  arcPaddingColor: 'white',
  arcLabels: ['35', '210', '315'],
  arcLabelFontSize: false,
  //arcOverEffect: false,
  // label options
  rangeLabel: ['0', '350'],
  centralLabel: '175',
  rangeLabelFontSize: false,
  labelsFont: 'Consolas',
  labelsColor: 'red',
}

GaugeChart.gaugeChart(element, 400, gaugeOptions).updateNeedle(50)
