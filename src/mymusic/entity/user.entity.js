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
exports.UserEntity = void 0;
var typeorm_1 = require("typeorm");
var mymusic_entity_1 = require("./mymusic.entity");
var UserEntity = /** @class */ (function (_super) {
    __extends(UserEntity, _super);
    function UserEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id', comment: '사용자식별자' })
    ], UserEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'address', length: 50, comment: '지갑주소' })
    ], UserEntity.prototype, "address");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'nickname', length: 50, comment: '닉네임' })
    ], UserEntity.prototype, "nickname");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'introduce', length: 200, comment: '내소개글' })
    ], UserEntity.prototype, "introduce");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'lang', length: 50, comment: '최초 디바이스에 정의된 언어' })
    ], UserEntity.prototype, "lang");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'nation', length: 50, comment: '최초 디바이스에 정의된 국적' })
    ], UserEntity.prototype, "nation");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], UserEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], UserEntity.prototype, "updateAt");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return mymusic_entity_1.MyMusicEntity; }, function (myMusicEntity) { return myMusicEntity.userEntity; })
    ], UserEntity.prototype, "myMusicEntity");
    UserEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'user' }),
        (0, typeorm_1.Unique)(['address'])
    ], UserEntity);
    return UserEntity;
}(typeorm_1.BaseEntity));
exports.UserEntity = UserEntity;
