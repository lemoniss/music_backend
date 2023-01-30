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
exports.NftMusicService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
var nftmusic_repository_1 = require("./nftmusic.repository");
var nftmusic_genre_repository_1 = require("./exchange_genre.repository");
var nftmusic_file_repository_1 = require("./exchange_file.repository");
var user_nftmusic_repository_1 = require("./user_exchange.repository");
var nftmusic_like_repository_1 = require("./nftmusic_like.repository");
var metadata_nft_dto_1 = require("./dto/metadata.nft.dto");
var ExchangeService = /** @class */ (function () {
    function NftMusicService(
    // @InjectRepository(MyMusicRepository) private myMusicRepository: MyMusicRepository,
    // @InjectRepository(MyMusicGenreRepository) private myMusicGenreRepository: MyMusicGenreRepository,
    // @InjectRepository(MyMusicFileRepository) private myMusicFileRepository: MyMusicFileRepository,
    nftMusicRepository, nftMusicGenreRepository, nftMusicFileRepository, userNftMusicRepository, nftMusicLikeRepository, myMusicService, uploadService) {
        this.nftMusicRepository = nftMusicRepository;
        this.nftMusicGenreRepository = nftMusicGenreRepository;
        this.nftMusicFileRepository = nftMusicFileRepository;
        this.userNftMusicRepository = userNftMusicRepository;
        this.nftMusicLikeRepository = nftMusicLikeRepository;
        this.myMusicService = myMusicService;
        this.uploadService = uploadService;
    }
    NftMusicService.prototype.createNft = function (userId, createNftDto) {
        return __awaiter(this, void 0, void 0, function () {
            var infoMusicDto_1, metadataNftDto, _i, _a, i, _b, _c, web3, e_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.myMusicService.findMusicInfo(createNftDto.myMusicId)];
                    case 1:
                        infoMusicDto_1 = _d.sent();
                        metadataNftDto = new metadata_nft_dto_1.MetadataNftDto();
                        metadataNftDto.title = infoMusicDto_1.title;
                        metadataNftDto.name = infoMusicDto_1.name;
                        metadataNftDto.artist = infoMusicDto_1.artist;
                        metadataNftDto.genres = infoMusicDto_1.genres;
                        metadataNftDto.description = infoMusicDto_1.description;
                        metadataNftDto.playTime = infoMusicDto_1.playTime;
                        _i = 0, _a = infoMusicDto_1.files;
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        i = _a[_i];
                        if (!(i.filetype == 'MUSIC')) return [3 /*break*/, 4];
                        _b = metadataNftDto;
                        return [4 /*yield*/, this.uploadService.uploadFileToIpfs(i.fileId)];
                    case 3:
                        _b.musicIpfsHash = _d.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        _c = metadataNftDto;
                        return [4 /*yield*/, this.uploadService.uploadFileToIpfs(i.fileId)];
                    case 5:
                        _c.imageIpfsHash = _d.sent();
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        web3 = require('web3');
                        return [4 /*yield*/, this.uploadService.uploadMetadataToIpfs(metadataNftDto).then(function (ipfsHash) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, _c;
                                var _this = this;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _b = (_a = this.nftMusicRepository).createNft;
                                            _c = [createNftDto, ipfsHash];
                                            return [4 /*yield*/, infoMusicDto_1];
                                        case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()])).then(function (nftMusicId) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, _b, _c, _d, _e, _f;
                                                return __generator(this, function (_g) {
                                                    switch (_g.label) {
                                                        case 0:
                                                            _b = (_a = this.nftMusicGenreRepository).createNftMusicGenre;
                                                            _c = [nftMusicId];
                                                            return [4 /*yield*/, infoMusicDto_1];
                                                        case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_g.sent()]))];
                                                        case 2:
                                                            _g.sent();
                                                            _e = (_d = this.nftMusicFileRepository).createNftMusicFile;
                                                            _f = [nftMusicId];
                                                            return [4 /*yield*/, infoMusicDto_1];
                                                        case 3: return [4 /*yield*/, _e.apply(_d, _f.concat([_g.sent()]))];
                                                        case 4:
                                                            _g.sent();
                                                            return [4 /*yield*/, this.userNftMusicRepository.createUserNftMusic(userId, nftMusicId)];
                                                        case 5:
                                                            _g.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                        case 2:
                                            _d.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, this.myMusicService.deleteMusic(createNftDto.myMusicId)];
                    case 9:
                        _d.sent();
                        // await this.myMusicGenreRepository.deleteMusicGenre(createNftDto.myMusicId).then(async () => {
                        //   await this.myMusicFileRepository.deleteMusicFile(createNftDto.myMusicId).then(async () => {
                        //     await this.myMusicRepository.deleteMusic(createNftDto.myMusicId);
                        //   });
                        // });
                        return [2 /*return*/, true];
                    case 10:
                        e_1 = _d.sent();
                        console.log(e_1);
                        throw new runtime_exception_1.RuntimeException();
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    NftMusicService.prototype.findNftList = function (userId, search) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nftMusicRepository.findNftList(userId, search)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NftMusicService.prototype.findNftInfo = function (nftMusicId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nftMusicRepository.findNftInfo(nftMusicId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NftMusicService.prototype.createMusicLike = function (nftLikeDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nftMusicLikeRepository.createMusicLike(nftLikeDto)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NftMusicService.prototype.deleteMusicLike = function (nftLikeDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nftMusicLikeRepository.deleteMusicLike(nftLikeDto)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NftMusicService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(nftmusic_repository_1.NftMusicRepository)),
        __param(1, (0, typeorm_1.InjectRepository)(nftmusic_genre_repository_1.NftMusicGenreRepository)),
        __param(2, (0, typeorm_1.InjectRepository)(nftmusic_file_repository_1.NftMusicFileRepository)),
        __param(3, (0, typeorm_1.InjectRepository)(user_nftmusic_repository_1.UserNftMusicRepository)),
        __param(4, (0, typeorm_1.InjectRepository)(nftmusic_like_repository_1.NftMusicLikeRepository))
    ], NftMusicService);
    return NftMusicService;
}());
exports.NftMusicService = ExchangeService;
