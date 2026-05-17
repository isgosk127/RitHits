import { AlbumsService } from './albums.service';
export declare class AlbumsController {
    private readonly albumsService;
    constructor(albumsService: AlbumsService);
    findAll(limit: string, offset: string): Promise<any>;
    findMy(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
    findByArtist(artistId: string): Promise<any>;
    create(req: any, body: any, file: Express.Multer.File): Promise<any>;
    update(id: string, req: any, body: any, file: Express.Multer.File): Promise<any>;
    remove(id: string, req: any): Promise<any>;
    addSong(id: string, songId: string, req: any): Promise<any>;
}
