import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { StreamingService } from './streaming.service';
import { SongsService } from '../../songs/songs.service';
export declare class MediaProcessor extends WorkerHost {
    private readonly streamingService;
    private readonly songsService;
    private readonly logger;
    constructor(streamingService: StreamingService, songsService: SongsService);
    process(job: Job<any, any, string>): Promise<any>;
}
