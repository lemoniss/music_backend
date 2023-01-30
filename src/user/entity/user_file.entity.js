"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserFileEntity = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var file_entity_1 = require("./file.entity");
var UserFileEntity = /** @class */ (function () {
    function UserFileEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id' })
    ], UserFileEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.UserEntity; }, function (userEntity) { return userEntity.userFileEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'user_id' })
    ], UserFileEntity.prototype, "userEntity");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return file_entity_1.FileEntity; }, function (fileEntity) { return fileEntity.userFileEntity; }),
        (0, typeorm_1.JoinColumn)({ name: 'file_id' })
    ], UserFileEntity.prototype, "fileEntity");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], UserFileEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], UserFileEntity.prototype, "updateAt");
    UserFileEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'user_file' })
    ], UserFileEntity);
    return UserFileEntity;
}());
exports.UserFileEntity = UserFileEntity;
