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
exports.MyMusicService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var mymusic_repository_1 = require("./mymusic.repository");
var mymusic_genre_repository_1 = require("./mymusic_genre.repository");
var mymusic_file_repository_1 = require("./mymusic_file.repository");
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
var MyMusicService = /** @class */ (function () {
    function MyMusicService(myMusicRepository, myMusicGenreRepository, myMusicFileRepository) {
        this.myMusicRepository = myMusicRepository;
        this.myMusicGenreRepository = myMusicGenreRepository;
        this.myMusicFileRepository = myMusicFileRepository;
    }
    MyMusicService.prototype.createMusic = function (userId, createMusicDto) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.myMusicRepository.createMusic(userId, createMusicDto).then(function (myMusicId) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.myMusicGenreRepository.createMusicGenre(myMusicId, createMusicDto)];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.myMusicFileRepository.createMusicFile(myMusicId, createMusicDto)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        throw new runtime_exception_1.RuntimeException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MyMusicService.prototype.updateMusic = function (myMusicId, updateMusicDto) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.myMusicRepository.updateMusic(myMusicId, updateMusicDto).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(typeof updateMusicDto.genreId != 'undefined')) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.myMusicGenreRepository.updateMusicGenre(myMusicId, updateMusicDto)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            if (!(typeof updateMusicDto.musicFileId != 'undefined')) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.myMusicFileRepository.updateMusicFile(myMusicId, updateMusicDto, 'MUSIC')];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4:
                                            if (!(typeof updateMusicDto.imgFileId != 'undefined')) return [3 /*break*/, 6];
                                            return [4 /*yield*/, this.myMusicFileRepository.updateMusicFile(myMusicId, updateMusicDto, 'IMAGE')];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_2 = _a.sent();
                        console.log(e_2);
                        throw new runtime_exception_1.RuntimeException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MyMusicService.prototype.findMusicList = function (userId, search) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.myMusicRepository.findMusicList(userId, search)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MyMusicService.prototype.findMusicInfo = function (myMusicId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.myMusicRepository.findMusicInfo(myMusicId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MyMusicService.prototype.deleteMusic = function (myMusicId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.myMusicGenreRepository.deleteMusicGenre(myMusicId).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.myMusicFileRepository.deleteMusicFile(myMusicId).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this.myMusicRepository.deleteMusic(myMusicId)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_3 = _a.sent();
                        throw new runtime_exception_1.RuntimeException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MyMusicService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(mymusic_repository_1.MyMusicRepository)),
        __param(1, (0, typeorm_1.InjectRepository)(mymusic_genre_repository_1.MyMusicGenreRepository)),
        __param(2, (0, typeorm_1.InjectRepository)(mymusic_file_repository_1.MyMusicFileRepository))
    ], MyMusicService);
    return MyMusicService;
}());
exports.MyMusicService = MyMusicService;
