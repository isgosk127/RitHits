import { FollowsService } from './follows.service';
export declare class FollowsController {
    private readonly followsService;
    constructor(followsService: FollowsService);
    follow(targetId: string, req: any): Promise<any>;
    unfollow(targetId: string, req: any): Promise<any>;
    isFollowing(targetId: string, req: any): Promise<{
        following: boolean;
    }>;
    getFollowers(userId: string): Promise<any>;
    getFollowing(userId: string): Promise<any>;
}
