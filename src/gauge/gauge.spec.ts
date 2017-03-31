import { gaugeChart } from './gauge'
import { paramChecker } from './param-checker'

describe('draw gauge', () => {
  it('draws gauge', () => {
    let element = document.createElement('gaugeChart')
    let gaugeOptions = {
      chartColors: [],
      chartRatios: [25, 50, 75],
      gaugeRangeLabel: ['0', '100'],
      gaugeCentralLabel: '60',
    }
    gaugeChart(element, 600, 60, gaugeOptions)
  })
})

describe('check parameters', () => {
  it('checks parameters', () => {
    let chartColors = ['red', 'green']
    let chartRatios = [20, 60]
    let needleValue = 70
    paramChecker(chartRatios, chartColors, needleValue)
  })
})


