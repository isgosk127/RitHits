"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MediaProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const streaming_service_1 = require("./streaming.service");
const songs_service_1 = require("../../songs/songs.service");
const musicMetadata = __importStar(require("music-metadata"));
const path_1 = require("path");
let MediaProcessor = MediaProcessor_1 = class MediaProcessor extends bullmq_1.WorkerHost {
    streamingService;
    songsService;
    logger = new common_1.Logger(MediaProcessor_1.name);
    constructor(streamingService, songsService) {
        super();
        this.streamingService = streamingService;
        this.songsService = songsService;
    }
    async process(job) {
        const { songId, filePath, fileName } = job.data;
        this.logger.log(`Processing song ${songId}...`);
        try {
            const outputDir = (0, path_1.join)(process.cwd(), 'uploads');
            const streamingDir = (0, path_1.join)(outputDir, 'streaming');
            const metadata = await musicMetadata.parseFile(filePath);
            const duration = Math.round(metadata.format.duration || 0);
            const hlsPath = await this.streamingService.transcodeToHLS(filePath, streamingDir, songId);
            const shortUrl = await this.streamingService.getHookClip(filePath, outputDir, songId);
            const waveformData = await this.streamingService.getWaveformData(filePath);
            const waveformJson = JSON.stringify(waveformData);
            await this.songsService.update(songId, {
                duration,
                audioUrl: hlsPath,
                waveform: waveformJson,
                hookStart: 20,
                hookEnd: 50,
            });
            this.logger.log(`Processing complete for song ${songId}`);
            return { hlsPath, shortUrl, duration, waveformData };
        }
        catch (error) {
            this.logger.error(`Failed to process song ${songId}: ${error.message}`);
            throw error;
        }
    }
};
exports.MediaProcessor = MediaProcessor;
exports.MediaProcessor = MediaProcessor = MediaProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('media_processing'),
    __metadata("design:paramtypes", [streaming_service_1.StreamingService,
        songs_service_1.SongsService])
], MediaProcessor);
//# sourceMappingURL=media.processor.js.map