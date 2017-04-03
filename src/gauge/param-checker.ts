export function delimeterRangeErrorChecker(chartRatios: number[]) {
  if (chartRatios && (chartRatios.slice(-1)[0] >= 100 || chartRatios[0] <= 0)) {
    console.error
      ('Gauge-chart Error: gauge delimeters have to be LARGER than 0 and LESS than 100')
    return false
  }
  return true
}

export function delimiterSortErrorChecker(chartRatios: number[]) {
  let isErrorFree = true
  if (chartRatios) {
    chartRatios.forEach((ratio, i) => {
      if (i && ratio < chartRatios[i - 1]) {
        console.error
          ('Gauge-chart Error: gauge delimeters are not sorted')
        isErrorFree = false
      }
    })
  }
  return isErrorFree
}

export function colorsLackWarnChecker(chartRatios: number[], chartColors: string[]) {
  if (chartRatios && chartColors && chartRatios.length > chartColors.length - 1){
    console.warn
     ('Gauge-chart Warning: list of colors is not complete, standard colors added to the chart')
  }
}

export function colorsExcessWarnChecker(chartRatios: number[], chartColors: string[]) {
  if (chartRatios && chartColors && chartRatios.length < chartColors.length - 1){
    console.warn
     ('Gauge-chart Warning: list of colors exceeds number of slices, therefore it was shortened')
  }
}

export function needleValueWarnChecker(needleValue) {
  if (needleValue < 0 || needleValue > 100) {
    console.warn('Gauge-chart Warning: value of needdle is less that 0 or larger than 100')
  }
}

export function warnChecker(chartRatios: number[], chartColors, needleValue: number) {
  colorsLackWarnChecker(chartRatios, chartColors)
  colorsExcessWarnChecker(chartRatios, chartColors)
  needleValueWarnChecker(needleValue)
}

export function errorChecker(chartRatios: number[]) {
  return delimeterRangeErrorChecker(chartRatios) &&
         delimiterSortErrorChecker(chartRatios)
}

/**
 * Function that checks whether there are any errors or typos in specified parameters.
 * Outputs to console errors and warnings if there are any.
 * @param chartRatios - array of ratios in percentage.
 * @param chartColors - array of colors.
 * @param needleValue - value at which needle points.
 * @returns modified needleValue.
 */
export function paramChecker(chartRatios: number[], chartColors: string[], needleValue: number) {
  warnChecker(chartRatios, chartColors, needleValue)
  return errorChecker(chartRatios)
}
