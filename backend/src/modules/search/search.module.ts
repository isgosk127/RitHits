import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { PrismaModule } from '../../prisma.module';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    }),
    PrismaModule
  ],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService]
})
export class SearchModule {}
