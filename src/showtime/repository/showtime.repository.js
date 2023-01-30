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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MyMusicRepository = void 0;
var typeorm_1 = require("typeorm");
var mymusic_entity_1 = require("./entity/mymusic.entity");
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
var user_entity_1 = require("../../user/entity/user.entity");
var info_music_dto_1 = require("./dto/info.music.dto");
var info_file_dto_1 = require("./dto/info.file2.dto");
var ShowtimeRepository = /** @class */ (function (_super) {
    __extends(MyMusicRepository, _super);
    function MyMusicRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 음악 정보 생성
     * @param createUserDto
     */
    MyMusicRepository.prototype.createMusic = function (userId, createMusicDto) {
        return __awaiter(this, void 0, void 0, function () {
            var userEntity, myMusic, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userEntity = new user_entity_1.UserEntity();
                        userEntity.id = userId;
                        return [4 /*yield*/, this.save({
                                title: createMusicDto.title,
                                name: createMusicDto.name,
                                artist: createMusicDto.artist,
                                description: createMusicDto.description,
                                viewYn: 'Y',
                                userEntity: userEntity
                            })];
                    case 1:
                        myMusic = _a.sent();
                        return [2 /*return*/, myMusic.id];
                    case 2:
                        e_1 = _a.sent();
                        throw new runtime_exception_1.RuntimeException('Server Error. Please try again later.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 음악 정보 수정
     * @param updateUserDto
     */
    MyMusicRepository.prototype.updateMusic = function (myMusicId, updateMusicDto) {
        return __awaiter(this, void 0, void 0, function () {
            var infoMyMusicDto, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.findOne(myMusicId)];
                    case 1:
                        infoMyMusicDto = _a.sent();
                        return [4 /*yield*/, this.update({ id: myMusicId }, {
                                title: typeof updateMusicDto.title == 'undefined' ? infoMyMusicDto.title : updateMusicDto.title,
                                name: typeof updateMusicDto.name == 'undefined' ? infoMyMusicDto.name : updateMusicDto.name,
                                artist: typeof updateMusicDto.artist == 'undefined' ? infoMyMusicDto.title : updateMusicDto.artist,
                                description: typeof updateMusicDto.description == 'undefined' ? infoMyMusicDto.description : updateMusicDto.description
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_2 = _a.sent();
                        throw new runtime_exception_1.RuntimeException('Server Error. Please try again later.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 음악 리스트 (검색도 있음)
     * @param id
     */
    MyMusicRepository.prototype.findMusicList = function (userId, search) {
        return __awaiter(this, void 0, void 0, function () {
            var musicList, infoUserDtos, _i, musicList_1, musicEntity, infoMusicDto, _a, _b, musicFileEntity, genres, genreIds, _c, _d, musicGenreEntity;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(mymusic_entity_1.MyMusicEntity)
                            .createQueryBuilder('m')
                            .leftJoinAndSelect('m.myMusicFileEntity', 'mf')
                            .leftJoinAndSelect('mf.fileEntity', 'f')
                            .leftJoinAndSelect('m.myMusicGenreEntity', 'mg')
                            .leftJoinAndSelect('mg.genreEntity', 'g')
                            .where('m.userEntity = :userId', { userId: userId })
                            .andWhere(typeof search != 'undefined' ? 'm.name like :search' : '1 = 1', { search: "%".concat(search, "%") })
                            .orderBy('m.id', 'DESC')
                            .getMany()];
                    case 1:
                        musicList = _e.sent();
                        if (!musicList) {
                            throw new runtime_exception_1.RuntimeException('Music Not Found');
                        }
                        infoUserDtos = [];
                        for (_i = 0, musicList_1 = musicList; _i < musicList_1.length; _i++) {
                            musicEntity = musicList_1[_i];
                            infoMusicDto = new info_music_dto_1.InfoMusicDto();
                            infoMusicDto.myMusicId = musicEntity.id;
                            infoMusicDto.title = musicEntity.title;
                            infoMusicDto.name = musicEntity.name;
                            infoMusicDto.artist = musicEntity.artist;
                            infoMusicDto.description = musicEntity.description;
                            infoMusicDto.playTime = musicEntity.playTime;
                            for (_a = 0, _b = musicEntity.myMusicFileEntity; _a < _b.length; _a++) {
                                musicFileEntity = _b[_a];
                                switch (musicFileEntity.fileType) {
                                    case 'MUSIC':
                                        infoMusicDto.musicFileUrl = musicFileEntity.fileEntity.url;
                                        break;
                                    case 'IMAGE':
                                        infoMusicDto.imgFileUrl = musicFileEntity.fileEntity.url;
                                        break;
                                }
                            }
                            genres = '';
                            genreIds = [];
                            for (_c = 0, _d = musicEntity.myMusicGenreEntity; _c < _d.length; _c++) {
                                musicGenreEntity = _d[_c];
                                genres += musicGenreEntity.genreEntity.name + ', ';
                                genreIds.push(musicGenreEntity.genreEntity.id);
                            }
                            infoMusicDto.genres = genres.substring(0, genres.length - 2);
                            infoMusicDto.genreIds = genreIds;
                            infoUserDtos.push(infoMusicDto);
                        }
                        return [2 /*return*/, infoUserDtos];
                }
            });
        });
    };
    /**
     * 음악 상세
     * @param id
     */
    MyMusicRepository.prototype.findMusicInfo = function (myMusicId) {
        return __awaiter(this, void 0, void 0, function () {
            var musicInfo, infoMusicDto, fileInfos, _i, _a, musicFileEntity, infoFileDto, genres, genreIds, _b, _c, musicGenreEntity;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(mymusic_entity_1.MyMusicEntity)
                            .createQueryBuilder('m')
                            .leftJoinAndSelect('m.myMusicFileEntity', 'mf')
                            .leftJoinAndSelect('mf.fileEntity', 'f')
                            .leftJoinAndSelect('m.myMusicGenreEntity', 'mg')
                            .leftJoinAndSelect('mg.genreEntity', 'g')
                            .where('m.id = :myMusicId', { myMusicId: myMusicId })
                            .getOne()];
                    case 1:
                        musicInfo = _d.sent();
                        if (!musicInfo) {
                            throw new runtime_exception_1.RuntimeException('Music Not Found');
                        }
                        infoMusicDto = new info_music_dto_1.InfoMusicDto();
                        infoMusicDto.myMusicId = musicInfo.id;
                        infoMusicDto.title = musicInfo.title;
                        infoMusicDto.name = musicInfo.name;
                        infoMusicDto.artist = musicInfo.artist;
                        infoMusicDto.description = musicInfo.description;
                        infoMusicDto.playTime = musicInfo.playTime;
                        fileInfos = [];
                        for (_i = 0, _a = musicInfo.myMusicFileEntity; _i < _a.length; _i++) {
                            musicFileEntity = _a[_i];
                            switch (musicFileEntity.fileType) {
                                case 'MUSIC':
                                    infoMusicDto.musicFileUrl = musicFileEntity.fileEntity.url;
                                    break;
                                case 'IMAGE':
                                    infoMusicDto.imgFileUrl = musicFileEntity.fileEntity.url;
                                    break;
                            }
                            infoFileDto = new info_file_dto_1.InfoFileDto();
                            infoFileDto.fileId = musicFileEntity.fileEntity.id;
                            infoFileDto.filetype = musicFileEntity.fileType;
                            fileInfos.push(infoFileDto);
                        }
                        infoMusicDto.files = fileInfos;
                        genres = '';
                        genreIds = [];
                        for (_b = 0, _c = musicInfo.myMusicGenreEntity; _b < _c.length; _b++) {
                            musicGenreEntity = _c[_b];
                            genres += musicGenreEntity.genreEntity.name + ', ';
                            genreIds.push(musicGenreEntity.genreEntity.id);
                        }
                        infoMusicDto.genres = genres.substring(0, genres.length - 2);
                        infoMusicDto.genreIds = genreIds;
                        return [2 /*return*/, infoMusicDto];
                }
            });
        });
    };
    /**
     *
     */
    MyMusicRepository.prototype.deleteMusic = function (myMusicId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, typeorm_1.getConnection)()
                                .createQueryBuilder()["delete"]()
                                .from(mymusic_entity_1.MyMusicEntity)
                                .where('id = :myMusicId', { myMusicId: myMusicId })
                                .execute()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        throw new runtime_exception_1.RuntimeException('Server Error. Please try again later.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MyMusicRepository = __decorate([
        (0, typeorm_1.EntityRepository)(mymusic_entity_1.MyMusicEntity)
    ], MyMusicRepository);
    return MyMusicRepository;
}(typeorm_1.Repository));
exports.MyMusicRepository = ShowtimeRepository;
