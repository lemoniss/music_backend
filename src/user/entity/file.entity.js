"use strict";
/*
@Entity - 해당 클래스는 DB user 테이블과 매핑시킬 때 사용
@Unique - 유니크 컬럼을 설정할 때 사용(배열 형태로 원하는 컬럼 값을 지정하면 된다)
@PrimaryGeneratedColumn - uuid 값을 지정하면 해당 컬럼은 uuid 타입으로 설정이 되며, Auto Increment 타입으로 설정
Auto_Increment : @PrimaryGeneratedColumn()
UUID: @PrimaryGeneratedColumn('uuid')
@Column - 해당 클래스 속성과 DB user 테이블 컬럼과 매핑시킬 때 사용
@CreateDateColumn - 데이터가 생성되는 시간을 기록할 때 사용
@UpdateDateColumn - 데이터가 수정되는 시간을 기록할 때 사용
*/
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
var user_file_entity_1 = require("./user_file.entity");
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
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return user_file_entity_1.UserFileEntity; }, function (userFileEntity) { return userFileEntity.fileEntity; })
    ], FileEntity.prototype, "userFileEntity");
    FileEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'file' })
    ], FileEntity);
    return FileEntity;
}(typeorm_1.BaseEntity));
exports.FileEntity = FileEntity;
