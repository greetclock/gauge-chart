// GaugeChart.print('Hi')
let element = document.querySelector('#gaugeArea')
let gaugeOptions = {
  chartColors: [],
  chartRatios: [25, 50, 75],
  gaugeRangeLabel: ['0', '100'],
  gaugeCentralLabel: '60',
}

GaugeChart.gaugeChart(element, 600, 60, gaugeOptions)
