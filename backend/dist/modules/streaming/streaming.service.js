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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StreamingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingService = void 0;
const common_1 = require("@nestjs/common");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffprobeStatic = __importStar(require("ffprobe-static"));
const ffmpegStatic = __importStar(require("ffmpeg-static"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let StreamingService = StreamingService_1 = class StreamingService {
    logger = new common_1.Logger(StreamingService_1.name);
    constructor() {
        const ffmpegPath = ffmpegStatic.default || ffmpegStatic;
        fluent_ffmpeg_1.default.setFfmpegPath(ffmpegPath);
        fluent_ffmpeg_1.default.setFfprobePath(ffprobeStatic.path);
        this.logger.log(`FFmpeg path set to: ${ffmpegPath}`);
    }
    async transcodeToHLS(inputPath, outputDir, songId) {
        const songFolder = path.join(outputDir, 'streaming', songId);
        if (!fs.existsSync(songFolder)) {
            fs.mkdirSync(songFolder, { recursive: true });
        }
        const playlistPath = path.join(songFolder, 'playlist.m3u8');
        return new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(inputPath)
                .outputOptions([
                '-profile:v baseline',
                '-level 3.0',
                '-start_number 0',
                '-hls_time 10',
                '-hls_list_size 0',
                '-f hls'
            ])
                .output(playlistPath)
                .on('start', (commandLine) => {
                this.logger.log('Spawned FFmpeg with command: ' + commandLine);
            })
                .on('end', () => {
                this.logger.log('Transcoding finished !');
                resolve(`/uploads/streaming/${songId}/playlist.m3u8`);
            })
                .on('error', (err) => {
                this.logger.error('An error occurred during transcoding: ' + err.message);
                reject(err);
            })
                .run();
        });
    }
    async getWaveformData(inputPath) {
        return new Promise((resolve, reject) => {
            resolve(Array.from({ length: 100 }, () => Math.random()));
        });
    }
    async getHookClip(inputPath, outputDir, songId) {
        const shortsFolder = path.join(outputDir, 'shorts');
        if (!fs.existsSync(shortsFolder)) {
            fs.mkdirSync(shortsFolder, { recursive: true });
        }
        const clipPath = path.join(shortsFolder, `${songId}.mp3`);
        return new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(inputPath)
                .setStartTime(20)
                .setDuration(30)
                .output(clipPath)
                .on('end', () => {
                this.logger.log(`Short clip for ${songId} generated`);
                resolve(`/uploads/shorts/${songId}.mp3`);
            })
                .on('error', (err) => {
                this.logger.error('Error generating short clip: ' + err.message);
                reject(err);
            })
                .run();
        });
    }
};
exports.StreamingService = StreamingService;
exports.StreamingService = StreamingService = StreamingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StreamingService);
//# sourceMappingURL=streaming.service.js.map