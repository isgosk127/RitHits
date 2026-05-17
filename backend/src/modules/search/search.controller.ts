import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') query: string) {
    if (!query) return { songs: [], artists: [] };
    
    // Búsqueda en Elasticsearch
    const elasticResults = await this.searchService.search(query);
    
    return {
      songs: elasticResults,
      // Podríamos añadir búsqueda de artistas también
      artists: []
    };
  }
}
