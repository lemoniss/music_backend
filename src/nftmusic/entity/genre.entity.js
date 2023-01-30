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
exports.GenreEntity = void 0;
var typeorm_1 = require("typeorm");
var nftmusic_genre_entity_1 = require("./nftmusic_genre.entity");
var GenreEntity = /** @class */ (function (_super) {
    __extends(GenreEntity, _super);
    function GenreEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id', comment: '장르식별자' })
    ], GenreEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'name', length: 50, comment: '이름' })
    ], GenreEntity.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부 YN' })
    ], GenreEntity.prototype, "viewYn");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], GenreEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], GenreEntity.prototype, "updateAt");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return nftmusic_genre_entity_1.NftMusicGenreEntity; }, function (nftMusicGenreEntity) { return nftMusicGenreEntity.genreEntity; })
    ], GenreEntity.prototype, "nftMusicGenreEntity");
    GenreEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'genre' })
    ], GenreEntity);
    return GenreEntity;
}(typeorm_1.BaseEntity));
exports.GenreEntity = GenreEntity;
