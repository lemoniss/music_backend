"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateMusicDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateMusicDto = /** @class */ (function () {
    function UpdateMusicDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.MaxLength)(25)
    ], UpdateMusicDto.prototype, "title");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.MaxLength)(25)
    ], UpdateMusicDto.prototype, "name");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.MaxLength)(25)
    ], UpdateMusicDto.prototype, "artist");
    __decorate([
        (0, class_validator_1.IsOptional)()
    ], UpdateMusicDto.prototype, "genreId");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.MaxLength)(1000)
    ], UpdateMusicDto.prototype, "description");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)()
    ], UpdateMusicDto.prototype, "musicFileId");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)()
    ], UpdateMusicDto.prototype, "imgFileId");
    return UpdateMusicDto;
}());
exports.UpdateMusicDto = UpdateMusicDto;
