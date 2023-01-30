"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NftMusicLikeEntity = void 0;
var typeorm_1 = require("typeorm");
var nftmusic_entity_1 = require("./nftmusic.entity");
var user_entity_1 = require("./user.entity");
var NftMusicLikeEntity = /** @class */ (function () {
    function NftMusicLikeEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id' })
    ], NftMusicLikeEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return nftmusic_entity_1.NftMusicEntity; }, function (nftMusicEntity) { return nftMusicEntity.nftMusicLikeEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'nft_music_id' })
    ], NftMusicLikeEntity.prototype, "nftMusicEntity");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.UserEntity; }, function (userEntity) { return userEntity.nftMusicLikeEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'user_id' })
    ], NftMusicLikeEntity.prototype, "userEntity");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], NftMusicLikeEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], NftMusicLikeEntity.prototype, "updateAt");
    NftMusicLikeEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'nft_music_like' })
    ], NftMusicLikeEntity);
    return NftMusicLikeEntity;
}());
exports.NftMusicLikeEntity = NftMusicLikeEntity;
