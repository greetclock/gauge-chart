export declare function delimiterRangeErrorChecker(chartDelimiters: number[]): boolean;
export declare function delimiterSortErrorChecker(chartDelimiters: number[]): boolean;
export declare function colorsLackWarnChecker(chartDelimiters: number[], chartColors: string[]): void;
export declare function colorsExcessWarnChecker(chartDelimiters: number[], chartColors: string[]): void;
export declare function needleValueWarnChecker(needleValue: number): void;
export declare function rangeLabelNumberWarnChecker(rangeLabel: string[]): void;
export declare function warnChecker(chartDelimiters: number[], chartColors: any, rangeLabel: string[]): void;
export declare function errorChecker(chartDelimiters: number[]): boolean;
/**
 * Function that checks whether there are any errors or typos in specified parameters.
 * Outputs to logger errors and warnings if there are any.
 * @param chartDelimiters - array of delimiters in percentage.
 * @param chartColors - array of colors.
 * @param needleValue - value at which needle points.
 * @returns modified needleValue.
 */
export declare function paramChecker(chartDelimiters: number[], chartColors: string[], rangeLabel: string[]): boolean;
