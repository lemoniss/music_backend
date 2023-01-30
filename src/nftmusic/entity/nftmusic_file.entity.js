"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NftMusicFileEntity = void 0;
var typeorm_1 = require("typeorm");
var file_entity_1 = require("./file.entity");
var nftmusic_entity_1 = require("./nftmusic.entity");
var NftMusicFileEntity = /** @class */ (function () {
    function NftMusicFileEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id' })
    ], NftMusicFileEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return nftmusic_entity_1.NftMusicEntity; }, function (nftMusicEntity) { return nftMusicEntity.nftMusicFileEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'nft_music_id' })
    ], NftMusicFileEntity.prototype, "nftMusicEntity");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return file_entity_1.FileEntity; }, function (fileEntity) { return fileEntity.nftMusicFileEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'file_id' })
    ], NftMusicFileEntity.prototype, "fileEntity");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'file_type', length: 10, comment: '파일유형' })
    ], NftMusicFileEntity.prototype, "fileType");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], NftMusicFileEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], NftMusicFileEntity.prototype, "updateAt");
    NftMusicFileEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'nft_music_file' })
    ], NftMusicFileEntity);
    return NftMusicFileEntity;
}());
exports.NftMusicFileEntity = NftMusicFileEntity;
