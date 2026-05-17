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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SongsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const songs_service_1 = require("./songs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const media_processor_1 = require("../modules/streaming/media.processor");
const fs_1 = require("fs");
let SongsController = SongsController_1 = class SongsController {
    songsService;
    mediaProcessor;
    logger = new common_1.Logger(SongsController_1.name);
    constructor(songsService, mediaProcessor) {
        this.songsService = songsService;
        this.mediaProcessor = mediaProcessor;
        const paths = ['./uploads/songs', './uploads/covers'];
        paths.forEach(p => {
            if (!(0, fs_1.existsSync)(p))
                (0, fs_1.mkdirSync)(p, { recursive: true });
        });
    }
    async uploadSong(files, body, req) {
        try {
            this.logger.log('--- NUEVA SUBIDA DE CANCIÓN ---');
            this.logger.log(`Usuario ID: ${req.user?.userId || req.user?.id || 'NO ENCONTRADO'}`);
            this.logger.log(`Título: ${body.title}`);
            this.logger.log(`Audio File: ${files.audio?.[0]?.filename || 'MISSING'}`);
            const artistId = req.user?.userId || req.user?.id || req.user?.sub;
            const audioFile = files.audio?.[0];
            const coverFile = files.cover?.[0];
            if (!audioFile) {
                this.logger.error('Error: No se recibió el archivo de audio');
                throw new Error('Audio file is required');
            }
            if (!artistId) {
                this.logger.error('Error: No se pudo identificar al artista (ID faltante)');
                throw new Error('User ID not found in token');
            }
            const songData = {
                title: body.title || 'Sin Título',
                genre: body.genre || 'Pop',
                lyrics: body.lyrics || '',
                isPublic: body.isPublic === 'true' || body.isPublic === true || true,
                audioUrl: `/uploads/songs/${audioFile.filename}`,
                coverUrl: coverFile ? `/uploads/covers/${coverFile.filename}` : null,
                duration: 0,
                artist: { connect: { id: artistId } },
            };
            this.logger.log('Intentando guardar en base de datos...');
            const song = await this.songsService.create(songData);
            this.logger.log(`¡Éxito! Canción creada con ID: ${song.id}`);
            this.mediaProcessor.process({
                data: { songId: song.id, filePath: audioFile.path, fileName: audioFile.filename },
            }).catch(err => this.logger.error(`Error en procesamiento background: ${err.message}`));
            return song;
        }
        catch (err) {
            this.logger.error(`FALLO CRÍTICO EN UPLOAD: ${err.message}`);
            this.logger.error(err.stack);
            throw new common_1.InternalServerErrorException(`Fallo en el servidor: ${err.message}`);
        }
    }
    findAll(limit) {
        return this.songsService.findAll(Number(limit) || 50);
    }
    getRanking(period, limit) {
        return this.songsService.getRanking(period || 'all', Number(limit) || 50);
    }
    findByArtist(artistId) {
        return this.songsService.findByArtist(artistId);
    }
    findOne(id) {
        return this.songsService.findOne(id);
    }
    findMine(req) {
        return this.songsService.findMy(req.user?.userId || req.user?.id);
    }
    remove(id) {
        return this.songsService.remove(id);
    }
};
exports.SongsController = SongsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'audio', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const dest = file.fieldname === 'audio' ? './uploads/songs' : './uploads/covers';
                cb(null, dest);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SongsController.prototype, "uploadSong", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SongsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('ranking'),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SongsController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Get)('artist/:artistId'),
    __param(0, (0, common_1.Param)('artistId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SongsController.prototype, "findByArtist", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SongsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SongsController.prototype, "findMine", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SongsController.prototype, "remove", null);
exports.SongsController = SongsController = SongsController_1 = __decorate([
    (0, common_1.Controller)('songs'),
    __metadata("design:paramtypes", [songs_service_1.SongsService,
        media_processor_1.MediaProcessor])
], SongsController);
//# sourceMappingURL=songs.controller.js.map