let element = document.querySelector('#gaugeArea')

let gaugeOptions = {
  needleValue: 80,
  needleColor: 'gray',
  arcColors: [],
  arcRatios: [50],
  rangeLabel: ['1', '10'],
  centralLabel: '',
}
let g = GaugeChart.gaugeChart(element, 500, gaugeOptions)

setInterval(() => {
  let rand = Math.random() * 100
  g.updateNeedle(rand)
  console.log('done')
}, 2000)
