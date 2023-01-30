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
exports.NftMusicController = void 0;
var common_1 = require("@nestjs/common");
var ExchangeController = /** @class */ (function () {
    function NftMusicController(nftMusicService) {
        this.nftMusicService = nftMusicService;
    }
    /**
     * 음악 정보 생성
     * @param createMusicDto
     */
    NftMusicController.prototype.createMusic = function (userId, createNftDto) {
        return this.nftMusicService.createNft(userId, createNftDto);
    };
    /**
     * 음악 리스트 (검색: nullable)
     * @param userId
     * @param search
     */
    NftMusicController.prototype.findMusicList = function (userId, search) {
        return this.nftMusicService.findNftList(userId, search);
    };
    /**
     * 좋아요 추가
     * @param nftLikeDto
     */
    NftMusicController.prototype.createMusicLike = function (nftLikeDto) {
        return this.nftMusicService.createMusicLike(nftLikeDto);
    };
    /**
     * 좋아요 삭제
     * @param nftLikeDto
     */
    NftMusicController.prototype.deleteMusicLike = function (nftLikeDto) {
        return this.nftMusicService.deleteMusicLike(nftLikeDto);
    };
    /**
     * 음악 상세
     * @param nftMusicId
     */
    NftMusicController.prototype.findMusicInfo = function (nftMusicId) {
        return this.nftMusicService.findNftInfo(nftMusicId);
    };
    __decorate([
        (0, common_1.Post)('/mint/:userId'),
        __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
        __param(1, (0, common_1.Body)())
    ], NftMusicController.prototype, "createMusic");
    __decorate([
        (0, common_1.Get)('/:userId'),
        __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
        __param(1, (0, common_1.Query)('search'))
    ], NftMusicController.prototype, "findMusicList");
    __decorate([
        (0, common_1.Post)('/like'),
        __param(0, (0, common_1.Body)())
    ], NftMusicController.prototype, "createMusicLike");
    __decorate([
        (0, common_1.Delete)('/like'),
        __param(0, (0, common_1.Body)())
    ], NftMusicController.prototype, "deleteMusicLike");
    __decorate([
        (0, common_1.Get)("/details/:nftMusicId"),
        __param(0, (0, common_1.Param)("nftMusicId", common_1.ParseIntPipe))
    ], NftMusicController.prototype, "findMusicInfo");
    NftMusicController = __decorate([
        (0, common_1.Controller)("/nfts")
    ], NftMusicController);
    return NftMusicController;
}());
exports.NftMusicController = ExchangeController;
