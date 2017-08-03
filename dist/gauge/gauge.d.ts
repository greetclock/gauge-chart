import './gauge.css';
import { GaugeInterface } from './gauge-interface';
import { Needle } from './needle-interface';
/**
 * Function that checks whether the number of colors is enough for drawing specified delimiters.
 * Adds standard colors if not enough or cuts the array if there are too many of them.
 * @param arcDelimiters - array of delimiters.
 * @param arcColors - array of colors (strings).
 * @returns modified list of colors.
 */
export declare function arcColorsModifier(arcDelimiters: number[], arcColors: string[]): string[];
/**
 * Function that checks whether value that needle points at is between 0 and 100.
 * If it is less than 0 or larger than 100, value is equated to 0 and 100 respectively.
 * @param needleValue - value at which needle points.
 * @returns modified needleValue.
 */
export declare function needleValueModifier(needleValue: number): number;
/**
 * Function that converts value in degrees into radians.
 * @param deg - value in degrees.
 * @returns value in radians.
 */
export declare function perc2RadWithShift(perc: number): number;
/**
 * Function for drawing gauge arc.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param arcColors - array of colors.
 * @param outerRadius - outter radius of gauge.
 * @param arcDelimiters - array of delimiters in percentage.
 * @returns modified svg.
 */
export declare function arcOutline(svg: any, chartHeight: number, offset: number, arcColors: string[], outerRadius: number, arcDelimiters: number[]): void;
/**
 * Function for drawing needle base.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param needleColor - color of a needle.
 * @param centralLabel - value of the central label.
 * @returns modified svg.
 */
export declare function needleBaseOutline(svg: any, chartHeight: number, offset: number, needleColor: string, centralLabel: string, outerNeedle: boolean): void;
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
export declare function needleOutline(svg: any, chartHeight: number, offset: number, needleColor: string, outerRadius: number, centralLabel: string, outerNeedle: boolean, needleStartValue: number): Needle;
/**
 * Function for drawing labels.
 * @param svg - original svg rectangle.
 * @param chartHeight - height of gauge.
 * @param outerRadius - outer radius of gauge.
 * @param rangeLabel - range labels of gauge.
 * @param centralLabel - value of the central label.
 * @returns modified svg.
 */
export declare function labelOutline(svg: any, areaWidth: number, chartHeight: number, offset: number, outerRadius: number, rangeLabel: string[], centralLabel: string, rangeLabelFontSize: number): void;
export interface GaugeOptions {
    needleValue?: number;
    needleColor?: string;
    arcColors?: string[];
    arcRatios?: number[];
    rangeLabel?: string[];
    centralLabel?: string;
}
/**
 * Function for drawing gauge.
 * @param chartWidth: number - width of gauge.
 * @param needleValue: number - value at which an arrow points.
 * @param gaugeOptions?: string[] - object of optional parameters.
 */
export declare function gaugeChart(element: Element, areaWidth: number, gaugeOptions: GaugeOptions): GaugeInterface;
