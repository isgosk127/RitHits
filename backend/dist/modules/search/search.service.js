"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@nestjs/elasticsearch");
const prisma_service_1 = require("../../prisma.service");
let SearchService = SearchService_1 = class SearchService {
    elasticsearchService;
    prisma;
    logger = new common_1.Logger(SearchService_1.name);
    constructor(elasticsearchService, prisma) {
        this.elasticsearchService = elasticsearchService;
        this.prisma = prisma;
    }
    async onModuleInit() {
        try {
            await this.createIndex();
        }
        catch (error) {
            this.logger.warn('Elasticsearch not available. Using Prisma fallback for search.');
        }
    }
    async createIndex() {
        const indexName = 'songs';
        const exists = await this.elasticsearchService.indices.exists({ index: indexName });
        if (!exists) {
            await this.elasticsearchService.indices.create({
                index: indexName,
                mappings: {
                    properties: {
                        title: { type: 'text', analyzer: 'spanish' },
                        artist: { type: 'text' },
                        genre: { type: 'keyword' },
                    },
                },
            });
        }
    }
    async search(query) {
        try {
            const response = await this.elasticsearchService.search({
                index: 'songs',
                query: {
                    multi_match: {
                        query,
                        fields: ['title^3', 'artist^2'],
                        fuzziness: 'AUTO',
                    },
                },
            });
            return response.hits.hits.map((hit) => ({
                id: hit._id,
                ...hit._source,
                score: hit._score,
            }));
        }
        catch (error) {
            this.logger.debug(`Elasticsearch search failed, falling back to Prisma for query: ${query}`);
            return this.prisma.song.findMany({
                where: {
                    OR: [
                        { title: { contains: query } },
                        { genre: { contains: query } },
                        { artist: { username: { contains: query } } }
                    ]
                },
                include: { artist: { select: { username: true } } },
                take: 10
            });
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elasticsearch_1.ElasticsearchService,
        prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map