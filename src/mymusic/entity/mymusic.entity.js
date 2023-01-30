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
exports.MyMusicEntity = void 0;
var typeorm_1 = require("typeorm");
var mymusic_genre_entity_1 = require("./mymusic_genre.entity");
var mymusic_file_entity_1 = require("./mymusic_file.entity");
var user_entity_1 = require("../../user/entity/user.entity");
var MyMusicEntity = /** @class */ (function (_super) {
    __extends(MyMusicEntity, _super);
    function MyMusicEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id', comment: '내가만든음원 식별자' })
    ], MyMusicEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'title', length: 50, comment: '제목' })
    ], MyMusicEntity.prototype, "title");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'name', length: 50, comment: '노래명' })
    ], MyMusicEntity.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'artist', length: 50, comment: '아티스트명' })
    ], MyMusicEntity.prototype, "artist");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'description', length: 2000, comment: '설명' })
    ], MyMusicEntity.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부 YN' })
    ], MyMusicEntity.prototype, "viewYn");
    __decorate([
        (0, typeorm_1.Column)({ type: 'bigint', name: 'play_time', comment: '음원재생시간' })
    ], MyMusicEntity.prototype, "playTime");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], MyMusicEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], MyMusicEntity.prototype, "updateAt");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.UserEntity; }, function (userEntity) { return userEntity.userFileEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'user_id' })
    ], MyMusicEntity.prototype, "userEntity");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return mymusic_genre_entity_1.MyMusicGenreEntity; }, function (myMusicGenreEntity) { return myMusicGenreEntity.myMusicEntity; })
    ], MyMusicEntity.prototype, "myMusicGenreEntity");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return mymusic_file_entity_1.MyMusicFileEntity; }, function (myMusicFileEntity) { return myMusicFileEntity.myMusicEntity; })
    ], MyMusicEntity.prototype, "myMusicFileEntity");
    MyMusicEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'my_music' })
    ], MyMusicEntity);
    return MyMusicEntity;
}(typeorm_1.BaseEntity));
exports.MyMusicEntity = MyMusicEntity;
