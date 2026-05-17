export declare class StreamingService {
    private readonly logger;
    constructor();
    transcodeToHLS(inputPath: string, outputDir: string, songId: string): Promise<string>;
    getWaveformData(inputPath: string): Promise<number[]>;
    getHookClip(inputPath: string, outputDir: string, songId: string): Promise<string>;
}
