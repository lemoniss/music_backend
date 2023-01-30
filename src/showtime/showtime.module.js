"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyMusicModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var mymusic_service_1 = require("./showtime.service");
var mymusic_controller_1 = require("./showtime.controller");
var mymusic_repository_1 = require("./repository/showtime.repository");
var mymusic_genre_repository_1 = require("./mymusic_genre.repository");
var mymusic_file_repository_1 = require("./mymusic_file.repository");
var ShowtimeModule = /** @class */ (function () {
    function MyMusicModule() {
    }
    MyMusicModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([
                    mymusic_repository_1.ShowtimeRepository,
                    mymusic_genre_repository_1.MyMusicGenreRepository,
                    mymusic_file_repository_1.MyMusicFileRepository
                ])],
            controllers: [mymusic_controller_1.ShowtimeController],
            providers: [mymusic_service_1.ShowtimeService],
            exports: [mymusic_service_1.ShowtimeService]
        })
    ], MyMusicModule);
    return MyMusicModule;
}());
exports.MyMusicModule = ShowtimeModule;
