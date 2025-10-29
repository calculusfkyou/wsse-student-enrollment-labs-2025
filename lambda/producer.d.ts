export declare const handler: (event: any) => Promise<{
    statusCode: number;
    body: string;
    headers?: undefined;
} | {
    statusCode: number;
    headers: {
        'Content-Type': string;
    };
    body: string;
}>;
