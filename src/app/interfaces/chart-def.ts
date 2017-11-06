export interface DataPoint {
    x: number;
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
    FromDate: Date;
    ToDate: Date;
    Randomize: number;
}

export interface ResponseModel {
    DateTime: Date;
    RandomNumber: number;
}