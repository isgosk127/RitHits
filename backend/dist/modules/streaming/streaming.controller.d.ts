import * as express from 'express';
export declare class StreamingController {
    streamAudio(songId: string, range: string, res: express.Response): Promise<express.Response<any, Record<string, any>> | undefined>;
}
