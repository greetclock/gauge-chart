import { arc, easeLinear, select } from 'd3'
import { schemePaired } from 'd3-scale-chromatic'

import { Gauge, GaugeInterface } from './gauge-interface'
import { Needle } from './needle-interface'
import { paramChecker } from './param-checker'

/**
 * Function that checks whether the number of colors is enough for drawing specified delimiters.
 * Adds standard colors if not enough or cuts the array if there are too many of them.
 * @param arcDelimiters - array of delimiters.
 * @param arcColors - array of colors (strings).
 * @returns modified list of colors.
 */
export function arcColorsModifier(
  arcDelimiters: number[],
  arcColors: string[],
) {
  if (arcDelimiters.length > arcColors.length - 1) {
    const colorDiff = arcDelimiters.length - arcColors.length + 1
    for (let i = 0; i < colorDiff; i++) {
      arcColors.push(schemePaired[i % schemePaired.length])
    }
  } else if (arcDelimiters.length < arcColors.length - 1) {
    arcColors = arcColors.slice(0, arcDelimiters.length + 1)
  }

  return arcColors
}

/**
 * Function that checks whether value that needle points at is between 0 and 100.
 * If it is less than 0 or larger than 100, value is equated to 0 and 100 respectively.
 * @param needleValue - value at which needle points.
 * @returns modified needleValue.
 */
export function needleValueModifier(needleValue: number) {
  return needleValue < 0 ? 0 : needleValue > 100 ? 100 : needleValue
}

/**
 * Function that converts percentage into radians.
 * @param perc - percentage.
 * @returns value in radians.
 */
export function perc2RadWithShift(perc: number) {
  return (perc / 100 - 0.5) * Math.PI
}

/**
 * Function for drawing gauge arc.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param arcColors - array of colors.
 * @param outerRadius - outter radius of gauge.
 * @param arcDelimiters - array of delimiters in percentage.
 * @returns modified svg.
 */
export function arcOutline(
  svg,
  chartHeight: number,
  offset: number,
  arcColors: string[],
  outerRadius: number,
  arcDelimiters: number[],
  arcOverEffect: boolean,
  padding: number,
  paddingColor: string,
  arcLabels: string[],
  arcLabelFontSize: number,
  labelsFont: string,
) {
  arcColors.forEach((color, i) => {
    const startAngle = perc2RadWithShift(i ? arcDelimiters[i - 1] : 0)
    const endAngle = perc2RadWithShift(arcDelimiters[i] || 100) // 100 for last arc slice

    let gaugeArc = arc()
      .innerRadius(chartHeight)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle)

    const innerArc = svg
      .append('path')
      .attr('d', gaugeArc)
      .attr('fill', color)
      .attr(
        'transform',
        'translate(' +
          (chartHeight + offset * 2) +
          ', ' +
          (chartHeight + offset) +
          ')',
      )

    if (arcOverEffect) {
      gaugeArc = arc()
        .innerRadius(chartHeight)
        .outerRadius(chartHeight + chartHeight * 0.1)
        .startAngle(startAngle)
        .endAngle(endAngle)

      const outerArc = svg
        .append('path')
        .attr('d', gaugeArc)
        .attr('fill', 'transparent')
        .attr('opacity', '0.2')
        .attr(
          'transform',
          'translate(' +
            (chartHeight + offset * 2) +
            ', ' +
            (chartHeight + offset) +
            ')',
        )

      innerArc
        .on('mouseover', () => {
          innerArc.style('opacity', 0.8)
          outerArc
            .transition()
            .duration(50)
            .ease(easeLinear)
            .attr('fill', color)
        })
        .on('mouseout', () => {
          innerArc.style('opacity', 1)
          outerArc
            .transition()
            .duration(300)
            .ease(easeLinear)
            .attr('fill', 'transparent')
        })
    }
  })

  arcColors.forEach((color, i) => {
    if (arcDelimiters[i]) {
      const endAngle = perc2RadWithShift(arcDelimiters[i])

      if (padding && paddingColor) {
        const scale = 1.1
        const centerX = chartHeight + offset * 2
        const centerY = offset - chartHeight * (scale - 1)

        svg
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('fill', paddingColor)
          .attr('width', padding)
          .attr('height', chartHeight * scale)
          .attr(
            'transform',
            'translate(' +
              centerX +
              ',' +
              centerY +
              ') ' +
              'rotate(' +
              (endAngle * 180) / Math.PI +
              ', ' +
              0 +
              ',' +
              chartHeight * scale +
              ')',
          )
      }

      if (arcLabels[i]) {
        // end of arc
        const spacing = 1.07
        const x =
          chartHeight +
          offset * 2 +
          Math.cos(endAngle - Math.PI / 2) * (chartHeight * spacing)
        const y =
          chartHeight +
          offset +
          Math.sin(endAngle - Math.PI / 2) * (chartHeight * spacing)

        // font size
        const fontScale = 0.09
        arcLabelFontSize =
          arcLabelFontSize || Math.round(chartHeight * fontScale)

        // measure text width
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        ctx.font = arcLabelFontSize + 'px'
        const size = ctx.measureText(arcLabels[i])

        // calc offset:
        // labels on the left need more offset (full width)
        // labels on the top need medium offset (half width)
        // labels on the right need little to no offset
        // endAngle = -PI/2 => offset = -width
        // endAngle = PI/2 => offset = 0
        const xPadding = 4
        const xOffset =
          ((endAngle - Math.PI / 2) / Math.PI) * (size.width + xPadding)

        // now place label
        svg
          .append('text')
          .attr('x', x + xOffset)
          .attr('y', y)
          .text(arcLabels[i])
          .attr('align', 'center')
          .attr('font-size', arcLabelFontSize + 'px')
          .attr('font-family', labelsFont)
      }
    }
  })
}

/**
 * Function for drawing needle base.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param needleColor - color of a needle.
 * @param centralLabel - value of the central label.
 * @returns modified svg.
 */
export function needleBaseOutline(
  svg,
  chartHeight: number,
  offset: number,
  needleColor: string,
  centralLabel: string,
  outerNeedle: boolean,
) {
  // Different circle radiuses in the base of needle
  const innerGaugeRadius =
    centralLabel || outerNeedle ? chartHeight * 0.5 : chartHeight * 0.1
  const gaugeArc = arc()
    .innerRadius(innerGaugeRadius)
    .outerRadius(0)
    .startAngle(perc2RadWithShift(0))
    .endAngle(perc2RadWithShift(200))

  // White needle base if something should be written on it, gray otherwise
  svg
    .append('path')
    .attr('d', gaugeArc)
    .attr('fill', centralLabel || outerNeedle ? 'transparent' : needleColor)
    .attr(
      'transform',
      'translate(' +
        (chartHeight + offset * 2) +
        ', ' +
        (chartHeight + offset) +
        ')',
    )
    .attr('class', 'bar')
}

/**
 * Function for drawing needle.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param needleColor - color of needle.
 * @param outerRadius - outer radius of gauge.
 * @param needleValue - value at which needle points.
 * @param centralLabel - value of the central label.
 * @returns modified svg.
 */
export function needleOutline(
  svg,
  chartHeight: number,
  offset: number,
  needleColor: string,
  outerRadius: number,
  centralLabel: string,
  outerNeedle: boolean,
  needleStartValue: number,
) {
  const needleValue = needleStartValue
  const needle = new Needle(
    svg,
    needleValue,
    centralLabel,
    chartHeight,
    outerRadius,
    offset,
    needleColor,
    outerNeedle,
  )
  needle.setValue(needleValue)
  needle.getSelection()

  return needle
}

/**
 * Function for drawing labels.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param outerRadius - outer radius of gauge.
 * @param rangeLabel - range labels of gauge.
 * @param centralLabel - value of the central label.
 * @returns modified svg.
 */
export function labelOutline(
  svg,
  areaWidth: number,
  chartHeight: number,
  offset: number,
  outerRadius: number,
  rangeLabel: string[],
  centralLabel: string,
  rangeLabelFontSize: number,
  labelsFont: string,
) {
  const arcWidth = chartHeight - outerRadius

  // Fonts specification (responsive to chart size)
  rangeLabelFontSize = rangeLabelFontSize || Math.round(chartHeight * 0.18)
  const realRangeFontSize = rangeLabelFontSize * 0.6 // counted empirically
  const centralLabelFontSize = rangeLabelFontSize * 1.5
  const realCentralFontSize = centralLabelFontSize * 0.56

  // Offsets specification (responsive to chart size)
  const leftRangeLabelOffsetX = rangeLabel[0]
    ? areaWidth / 2 -
      outerRadius -
      arcWidth / 2 -
      (realRangeFontSize * rangeLabel[0].length) / 2
    : 0
  const rightRangeLabelOffsetX = rangeLabel[1]
    ? areaWidth / 2 +
      outerRadius +
      arcWidth / 2 -
      (realRangeFontSize * rangeLabel[1].length) / 2
    : 0
  const rangeLabelOffsetY = offset + chartHeight + realRangeFontSize * 2
  const centralLabelOffsetX =
    areaWidth / 2 - (realCentralFontSize * centralLabel.length) / 2
  const centralLabelOffsetY = offset + chartHeight

  svg
    .append('text')
    .attr('x', leftRangeLabelOffsetX)
    .attr('y', rangeLabelOffsetY)
    .text(rangeLabel ? rangeLabel[0] : '')
    .attr('font-size', rangeLabelFontSize + 'px')
    .attr('font-family', labelsFont)

  svg
    .append('text')
    .attr('x', rightRangeLabelOffsetX)
    .attr('y', rangeLabelOffsetY)
    .text(rangeLabel ? rangeLabel[1] : '')
    .attr('font-size', rangeLabelFontSize + 'px')
    .attr('font-family', labelsFont)

  svg
    .append('text')
    .attr('x', centralLabelOffsetX)
    .attr('y', centralLabelOffsetY)
    .text(centralLabel)
    .attr('font-size', centralLabelFontSize + 'px')
    .attr('font-family', labelsFont)
}

export interface GaugeOptions {
  needleValue?: number
  needleColor?: string
  arcColors?: string[]
  arcRatios?: number[]
  rangeLabel?: string[]
  centralLabel?: string
}

/**
 * Function for drawing gauge.
 * @param chartWidth: number - width of gauge.
 * @param needleValue: number - value at which an arrow points.
 * @param gaugeOptions?: string[] - object of optional parameters.
 */
export function gaugeChart(
  element: Element,
  areaWidth: number,
  gaugeOptions: GaugeOptions,
): GaugeInterface {
  const defaultGaugeOption = {
    hasNeedle: false,
    outerNeedle: false,
    needleColor: 'gray',
    needleStartValue: 0,
    needleUpdateSpeed: 1000,
    arcColors: [],
    arcDelimiters: [],
    arcOverEffect: true,
    arcPadding: 0,
    arcPaddingColor: undefined,
    arcLabels: [],
    arcLabelFontSize: undefined,
    rangeLabel: [],
    centralLabel: '',
    rangeLabelFontSize: undefined,
    labelsFont: 'Roboto,Helvetica Neue,sans-serif',
  }

  let {
    hasNeedle,
    needleColor,
    needleUpdateSpeed,
    arcColors,
    arcDelimiters,
    arcOverEffect,
    arcPadding,
    arcPaddingColor,
    arcLabels,
    arcLabelFontSize,
    rangeLabel,
    centralLabel,
    rangeLabelFontSize,
    labelsFont,
    outerNeedle,
    needleStartValue,
  } = (Object as any).assign(defaultGaugeOption, gaugeOptions)
  if (!paramChecker(arcDelimiters, arcColors, rangeLabel)) {
    return
  }

  arcColors = arcColorsModifier(arcDelimiters, arcColors)

  const offset = areaWidth * 0.075
  const chartHeight = areaWidth * 0.5 - offset * 2
  const chartWidth = areaWidth - offset * 2
  const outerRadius = chartHeight * 0.75
  const svg = select(element)
    .append('svg')
    .attr('width', chartWidth + offset * 2)
    .attr('height', chartHeight + offset * 4)

  arcOutline(
    svg,
    chartHeight,
    offset,
    arcColors,
    outerRadius,
    arcDelimiters,
    arcOverEffect,
    arcPadding,
    arcPaddingColor,
    arcLabels,
    arcLabelFontSize,
    labelsFont,
  )

  let needle = null
  if (hasNeedle) {
    needle = needleOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      outerRadius,
      centralLabel,
      outerNeedle,
      needleStartValue,
    )
    needleBaseOutline(
      svg,
      chartHeight,
      offset,
      needleColor,
      centralLabel,
      outerNeedle,
    )
  }

  labelOutline(
    svg,
    areaWidth,
    chartHeight,
    offset,
    outerRadius,
    rangeLabel,
    centralLabel,
    rangeLabelFontSize,
    labelsFont,
  )

  return new Gauge(svg, needleUpdateSpeed, needle)
}
