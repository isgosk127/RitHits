import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    recordPlay(req: any, songId: string, duration: number): Promise<any>;
    getTrending(limit: string): Promise<any>;
}
