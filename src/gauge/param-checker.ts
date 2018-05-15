import * as logger from './logger'

export function delimiterRangeErrorChecker(chartDelimiters: number[]) {
  if (
    chartDelimiters &&
    (chartDelimiters.slice(-1)[0] >= 100 || chartDelimiters[0] <= 0)
  ) {
    logger.error(
      'Gauge-chart Error: gauge delimiters have to be LARGER than 0 and LESS than 100',
    )
    return false
  }
  return true
}

export function delimiterSortErrorChecker(chartDelimiters: number[]) {
  let isErrorFree = true
  if (chartDelimiters) {
    chartDelimiters.forEach((delimiter, i) => {
      if (i && delimiter < chartDelimiters[i - 1]) {
        logger.error('Gauge-chart Error: gauge delimiters are not sorted')
        isErrorFree = false
      }
    })
  }
  return isErrorFree
}

export function colorsLackWarnChecker(
  chartDelimiters: number[],
  chartColors: string[],
) {
  if (
    chartDelimiters &&
    chartColors &&
    chartDelimiters.length > chartColors.length - 1
  )
    logger.warn(
      'Gauge-chart Warning: list of colors is not complete, standard colors added to the chart',
    )
}

export function colorsExcessWarnChecker(
  chartDelimiters: number[],
  chartColors: string[],
) {
  if (
    chartDelimiters &&
    chartColors &&
    chartDelimiters.length < chartColors.length - 1
  )
    logger.warn(
      'Gauge-chart Warning: list of colors exceeds number of slices, therefore it was shortened',
    )
}

export function needleValueWarnChecker(needleValue: number) {
  if (needleValue < 0 || needleValue > 100)
    logger.warn(
      'Gauge-chart Warning: value of needdle is less that 0 or larger than 100',
    )
}

export function rangeLabelNumberWarnChecker(rangeLabel: string[]) {
  if (rangeLabel.length > 2)
    logger.warn(
      'Gauge-chart Warning: number of range label parameters is bigger than 2',
    )
}

export function warnChecker(
  chartDelimiters: number[],
  chartColors,
  rangeLabel: string[],
) {
  colorsLackWarnChecker(chartDelimiters, chartColors)
  colorsExcessWarnChecker(chartDelimiters, chartColors)
  // needleValueWarnChecker(needleValue)
  rangeLabelNumberWarnChecker(rangeLabel)
}

export function errorChecker(chartDelimiters: number[]) {
  return (
    delimiterRangeErrorChecker(chartDelimiters) &&
    delimiterSortErrorChecker(chartDelimiters)
  )
}

/**
 * Function that checks whether there are any errors or typos in specified parameters.
 * Outputs to logger errors and warnings if there are any.
 * @param chartDelimiters - array of delimiters in percentage.
 * @param chartColors - array of colors.
 * @param needleValue - value at which needle points.
 * @returns modified needleValue.
 */
export function paramChecker(
  chartDelimiters: number[],
  chartColors: string[],
  rangeLabel: string[],
) {
  warnChecker(chartDelimiters, chartColors, rangeLabel)
  return errorChecker(chartDelimiters)
}
