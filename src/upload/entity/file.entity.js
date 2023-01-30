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
exports.FileEntity = void 0;
var typeorm_1 = require("typeorm");
var FileEntity = /** @class */ (function (_super) {
    __extends(FileEntity, _super);
    function FileEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id', comment: '파일식별자' })
    ], FileEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'name', length: 50, comment: '파일명' })
    ], FileEntity.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'url', length: 100, comment: '파일URL' })
    ], FileEntity.prototype, "url");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'ext', length: 10, comment: '파일유형' })
    ], FileEntity.prototype, "ext");
    __decorate([
        (0, typeorm_1.Column)({ type: 'char', name: 'view_yn', length: 1, comment: '노출여부 YN' })
    ], FileEntity.prototype, "viewYn");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', name: 'key', length: 50, comment: 'S3 key' })
    ], FileEntity.prototype, "key");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'create_at', comment: '생성일' })
    ], FileEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', name: 'update_at', comment: '수정일' })
    ], FileEntity.prototype, "updateAt");
    FileEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'file' })
    ], FileEntity);
    return FileEntity;
}(typeorm_1.BaseEntity));
exports.FileEntity = FileEntity;
