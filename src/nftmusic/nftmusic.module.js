"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NftMusicModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var nftmusic_genre_repository_1 = require("./nftmusic_genre.repository");
var nftmusic_file_repository_1 = require("./nftmusic_file.repository");
var nftmusic_service_1 = require("./nftmusic.service");
var nftmusic_controller_1 = require("./nftmusic.controller");
var nftmusic_repository_1 = require("./nftmusic.repository");
var nftmusic_like_repository_1 = require("./nftmusic_like.repository");
var user_nftmusic_repository_1 = require("./user_nftmusic.repository");
var mymusic_module_1 = require("../mymusic/mymusic.module");
var upload_module_1 = require("../upload/upload.module");
var NftMusicModule = /** @class */ (function () {
    function NftMusicModule() {
    }
    NftMusicModule = __decorate([
        (0, common_1.Module)({
            imports: [
                mymusic_module_1.MyMusicModule,
                upload_module_1.UploadModule,
                typeorm_1.TypeOrmModule.forFeature([
                    nftmusic_repository_1.NftMusicRepository,
                    nftmusic_genre_repository_1.NftMusicGenreRepository,
                    nftmusic_file_repository_1.NftMusicFileRepository,
                    user_nftmusic_repository_1.UserNftMusicRepository,
                    nftmusic_like_repository_1.NftMusicLikeRepository,
                ])
            ],
            controllers: [nftmusic_controller_1.NftMusicController],
            providers: [nftmusic_service_1.NftMusicService],
            exports: [nftmusic_service_1.NftMusicService]
        })
    ], NftMusicModule);
    return NftMusicModule;
}());
exports.NftMusicModule = NftMusicModule;
