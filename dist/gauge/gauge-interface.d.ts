/**
 * Gauge interface.
 */
export interface GaugeInterface {
    updateNeedle(needleValue: number): void;
    removeGauge(): void;
}
export declare class Gauge {
    private svg;
    private needleUpdateSpeed;
    private needle;
    constructor(svg: any, needleUpdateSpeed: any, needle?: any);
    updateNeedle(needleValue: any): void;
    removeGauge(): void;
}
