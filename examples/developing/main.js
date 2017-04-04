let element = document.querySelector('#gaugeArea')
let gaugeOptions = {
  chartColors: [],
  chartRatios: [50],
  gaugeRangeLabel: ['0%', '40%'],
  gaugeCentralLabel: '23%',
}

GaugeChart.gaugeChart(element, 250, 65, gaugeOptions)
