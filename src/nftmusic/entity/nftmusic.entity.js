"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NftMusicEntity = void 0;
var typeorm_1 = require("typeorm");
var nftmusic_file_entity_1 = require("./nftmusic_file.entity");
var user_nftmusic_entity_1 = require("./user_nftmusic.entity");
var nftmusic_like_entity_1 = require("./nftmusic_like.entity");
var nftmusic_genre_entity_1 = require("./nftmusic_genre.entity");
var NftMusicEntity = /** @class */ (function (_super) {
    __extends(NftMusicEntity, _super);
    function NftMusicEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id', comment: '내가만든음원 식별자' })
    ], NftMusicEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'ipfs_hash', length: 50, comment: 'IPFS해시' })
    ], NftMusicEntity.prototype, "ipfsHash");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'title', length: 50, comment: '제목' })
    ], NftMusicEntity.prototype, "title");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'name', length: 50, comment: '노래명' })
    ], NftMusicEntity.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'artist', length: 50, comment: '아티스트명' })
    ], NftMusicEntity.prototype, "artist");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'description', length: 2000, comment: '설명' })
    ], NftMusicEntity.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)({ type: 'bigint', name: 'play_time', comment: '음원재생시간' })
    ], NftMusicEntity.prototype, "playTime");
    __decorate([
        (0, typeorm_1.Column)({ type: 'bigint', name: 'play_count', comment: '음원재생횟수' })
    ], NftMusicEntity.prototype, "playCount");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], NftMusicEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], NftMusicEntity.prototype, "updateAt");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return user_nftmusic_entity_1.UserNftMusicEntity; }, function (userNftMusicEntity) { return userNftMusicEntity.nftMusicEntity; })
    ], NftMusicEntity.prototype, "userNftMusicEntity");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return nftmusic_file_entity_1.NftMusicFileEntity; }, function (nftMusicFileEntity) { return nftMusicFileEntity.nftMusicEntity; })
    ], NftMusicEntity.prototype, "nftMusicFileEntity");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return nftmusic_genre_entity_1.NftMusicGenreEntity; }, function (nftMusicGenreEntity) { return nftMusicGenreEntity.nftMusicEntity; })
    ], NftMusicEntity.prototype, "nftMusicGenreEntity");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return nftmusic_like_entity_1.NftMusicLikeEntity; }, function (nftMusicLikeEntity) { return nftMusicLikeEntity.nftMusicEntity; })
    ], NftMusicEntity.prototype, "nftMusicLikeEntity");
    NftMusicEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'nft_music' })
    ], NftMusicEntity);
    return NftMusicEntity;
}(typeorm_1.BaseEntity));
exports.NftMusicEntity = NftMusicEntity;
