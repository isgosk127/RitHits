import { Module } from '@nestjs/common';
import { RadioService } from './radio.service';
import { RadioController } from './radio.controller';
import { PrismaModule } from '../../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RadioService],
  controllers: [RadioController],
  exports: [RadioService],
})
export class RadioModule {}
