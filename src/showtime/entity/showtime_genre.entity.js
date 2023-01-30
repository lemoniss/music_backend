"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyMusicGenreEntity = void 0;
var typeorm_1 = require("typeorm");
var mymusic_entity_1 = require("./mymusic.entity");
var genre_entity_1 = require("./genre.entity");
var MyMusicGenreEntity = /** @class */ (function () {
    function MyMusicGenreEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id' })
    ], MyMusicGenreEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return mymusic_entity_1.MyMusicEntity; }, function (myMusicEntity) { return myMusicEntity.myMusicGenreEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'my_music_id' })
    ], MyMusicGenreEntity.prototype, "myMusicEntity");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return genre_entity_1.GenreEntity; }, function (genreEntity) { return genreEntity.myMusicGenreEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'genre_id' })
    ], MyMusicGenreEntity.prototype, "genreEntity");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], MyMusicGenreEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], MyMusicGenreEntity.prototype, "updateAt");
    MyMusicGenreEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'my_music_genre' })
    ], MyMusicGenreEntity);
    return MyMusicGenreEntity;
}());
exports.MyMusicGenreEntity = MyMusicGenreEntity;
