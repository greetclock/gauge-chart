/**
 * Needle interface.
 */
export declare class Needle {
    needleValue: any;
    centralLabel: any;
    chartHeight: any;
    outerRadius: any;
    needleColor: any;
    offset: any;
    lineData: any;
    lineFunction: any;
    needleSvg: any;
    outerNeedle: any;
    constructor(svg: any, needleValue: any, centralLabel: any, chartHeight: any, outerRadius: any, offset: any, needleColor: any, outerNeedle: any);
    setValue(needleValue: any): void;
    getValue(): any;
    calcCoordinates(): any;
    getSelection(): any;
    private getLine();
}
