export interface DataPoint {
    x: string;
    y: number;
}

export interface ChartDef {
    title: string;
    xLabel: string;
    yLabel: string;
    labelFont: string;
    dataPointFont: string;
}

export interface MessageData {
    Seconds: number;
    Randomized: number;
}

export interface RequestModel {
    FromDate: string;
    ToDate: string;
    Randomize: number;
    Points: number;
}

export interface ResponseModel {
    DateTime: string;
    Randomized: number;
}