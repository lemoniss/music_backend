"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NftMusicGenreEntity = void 0;
var typeorm_1 = require("typeorm");
var nftmusic_entity_1 = require("./nftmusic.entity");
var genre_entity_1 = require("./genre.entity");
var NftMusicGenreEntity = /** @class */ (function () {
    function NftMusicGenreEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id' })
    ], NftMusicGenreEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return nftmusic_entity_1.NftMusicEntity; }, function (nftMusicEntity) { return nftMusicEntity.nftMusicFileEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'nft_music_id' })
    ], NftMusicGenreEntity.prototype, "nftMusicEntity");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return genre_entity_1.GenreEntity; }, function (genreEntity) { return genreEntity.nftMusicGenreEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'genre_id' })
    ], NftMusicGenreEntity.prototype, "genreEntity");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], NftMusicGenreEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], NftMusicGenreEntity.prototype, "updateAt");
    NftMusicGenreEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'nft_music_genre' })
    ], NftMusicGenreEntity);
    return NftMusicGenreEntity;
}());
exports.NftMusicGenreEntity = NftMusicGenreEntity;
