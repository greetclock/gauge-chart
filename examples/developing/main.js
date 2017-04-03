// GaugeChart.print('Hi')
let element = document.querySelector('#gaugeArea')
let gaugeOptions = {
  // chartColors: [],
  chartRatios: [50],
  // gaugeRangeLabel: ['10', '40'],
  // gaugeCentralLabel: '25',
}

GaugeChart.gaugeChart(element, 200, 50, gaugeOptions)
