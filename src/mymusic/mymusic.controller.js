"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.MyMusicController = void 0;
var common_1 = require("@nestjs/common");
var MyMusicController = /** @class */ (function () {
    function MyMusicController(myMusicService) {
        this.myMusicService = myMusicService;
    }
    /**
     * 음악 정보 생성
     * @param createMusicDto
     */
    MyMusicController.prototype.createMusic = function (userId, createMusicDto) {
        return this.myMusicService.createMusic(userId, createMusicDto);
    };
    /**
     * 음악 정보 수정
     * @param updateUserDto
     */
    MyMusicController.prototype.updateMusic = function (myMusicId, updateMusicDto) {
        return this.myMusicService.updateMusic(myMusicId, updateMusicDto);
    };
    /**
     * 음악 리스트 (검색: nullable)
     * @param userId
     * @param search
     */
    MyMusicController.prototype.findMusicList = function (userId, search) {
        return this.myMusicService.findMusicList(userId, search);
    };
    /**
     * 음악 상세
     * @param myMusicId
     */
    MyMusicController.prototype.findMusicInfo = function (myMusicId) {
        return this.myMusicService.findMusicInfo(myMusicId);
    };
    /**
     * 음악 삭제
     * @param myMusicId
     */
    MyMusicController.prototype.deleteMusic = function (myMusicId) {
        return this.myMusicService.deleteMusic(myMusicId);
    };
    __decorate([
        (0, common_1.Post)("/:userId"),
        __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
        __param(1, (0, common_1.Body)())
    ], MyMusicController.prototype, "createMusic");
    __decorate([
        (0, common_1.Patch)("/:myMusicId"),
        __param(0, (0, common_1.Param)("myMusicId", common_1.ParseIntPipe)),
        __param(1, (0, common_1.Body)())
    ], MyMusicController.prototype, "updateMusic");
    __decorate([
        (0, common_1.Get)("/:userId"),
        __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
        __param(1, (0, common_1.Query)('search'))
    ], MyMusicController.prototype, "findMusicList");
    __decorate([
        (0, common_1.Get)("/details/:myMusicId"),
        __param(0, (0, common_1.Param)("myMusicId", common_1.ParseIntPipe))
    ], MyMusicController.prototype, "findMusicInfo");
    __decorate([
        (0, common_1.Delete)("/:myMusicId"),
        __param(0, (0, common_1.Param)("myMusicId", common_1.ParseIntPipe))
    ], MyMusicController.prototype, "deleteMusic");
    MyMusicController = __decorate([
        (0, common_1.Controller)("/musics")
    ], MyMusicController);
    return MyMusicController;
}());
exports.MyMusicController = MyMusicController;
