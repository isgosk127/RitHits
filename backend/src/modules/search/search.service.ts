import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    try {
      await this.createIndex();
    } catch (error) {
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

  async search(query: string) {
    try {
      // Intento Enterprise (Elasticsearch)
      const response = await this.elasticsearchService.search<any>({
        index: 'songs',
        query: {
          multi_match: {
            query,
            fields: ['title^3', 'artist^2'],
            fuzziness: 'AUTO',
          },
        },
      });

      return response.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
        score: hit._score,
      }));
    } catch (error) {
      // Fallback Lite (Prisma Search)
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
}
