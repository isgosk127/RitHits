import { RadioService } from './radio.service';
export declare class RadioController {
    private readonly radioService;
    constructor(radioService: RadioService);
    getPersonalized(req: any, genre: string): Promise<{
        station: {
            name: string;
            genre: string;
            description: string;
        };
        queue: any[];
    }>;
    getGlobal(): Promise<{
        station: {
            name: string;
            description: string;
        };
        queue: any[];
    }>;
}
