import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<any>;
    findOne(email: string): Promise<any>;
    findById(id: string): Promise<any>;
    findByUsername(username: string): Promise<any>;
    updateProfile(id: string, data: {
        username?: string;
        bio?: string;
        avatarUrl?: string;
        bannerUrl?: string;
        isArtist?: boolean;
    }): Promise<any>;
    updateRefreshToken(id: string, refreshToken: string | null): Promise<any>;
    findByEmail(email: string): Promise<any>;
    getArtists(limit?: number): Promise<any>;
    getListeningHistory(userId: string, limit?: number): Promise<any>;
}
