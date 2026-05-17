import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: string): Promise<{
        songs: any[];
        artists: never[];
    }>;
}
