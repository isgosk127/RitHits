import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getArtists(): Promise<any>;
    findById(id: string): Promise<any>;
    findByUsername(username: string): Promise<any>;
    getHistory(req: any): Promise<any>;
    updateProfile(req: any, body: any): Promise<any>;
}
