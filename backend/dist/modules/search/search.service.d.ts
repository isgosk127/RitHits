import { OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '../../prisma.service';
export declare class SearchService implements OnModuleInit {
    private readonly elasticsearchService;
    private readonly prisma;
    private readonly logger;
    constructor(elasticsearchService: ElasticsearchService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    createIndex(): Promise<void>;
    search(query: string): Promise<any[]>;
}
