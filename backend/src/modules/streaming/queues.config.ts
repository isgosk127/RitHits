import { BullModule } from '@nestjs/bullmq';

export const StreamingQueueConfig = BullModule.registerQueue({
  name: 'media_processing',
});
