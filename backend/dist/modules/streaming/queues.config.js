"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingQueueConfig = void 0;
const bullmq_1 = require("@nestjs/bullmq");
exports.StreamingQueueConfig = bullmq_1.BullModule.registerQueue({
    name: 'media_processing',
});
//# sourceMappingURL=queues.config.js.map