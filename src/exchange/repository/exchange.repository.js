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
exports.NftMusicRepository = void 0;
var typeorm_1 = require("typeorm");
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
var nftmusic_entity_1 = require("./entity/nftmusic.entity");
var info_nft_dto_1 = require("./dto/info.nft.dto");
var ExchangeRepository = /** @class */ (function (_super) {
    __extends(NftMusicRepository, _super);
    function NftMusicRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 음악 정보 생성
     * @param createUserDto
     */
    NftMusicRepository.prototype.createNft = function (createNftDto, ipfsHash, infoMusicDto) {
        return __awaiter(this, void 0, void 0, function () {
            var nftMusic, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.save({
                                ipfsHash: ipfsHash,
                                title: infoMusicDto.title,
                                name: infoMusicDto.name,
                                artist: infoMusicDto.artist,
                                description: infoMusicDto.description,
                                playTime: infoMusicDto.playTime,
                                playCount: 0
                            })];
                    case 1:
                        nftMusic = _a.sent();
                        return [2 /*return*/, nftMusic.id];
                    case 2:
                        e_1 = _a.sent();
                        throw new runtime_exception_1.RuntimeException('Server Error. Please try again later.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 음악 리스트 (검색도 있음)
     * @param id
     */
    NftMusicRepository.prototype.findNftList = function (userId, search) {
        return __awaiter(this, void 0, void 0, function () {
            var nftList, infoNftDtos, _i, nftList_1, nftEntity, infoNftDto, _a, _b, nftFileEntity, genres, _c, _d, nftGenreEntity, _e, _f, nftLikeEntity;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(nftmusic_entity_1.NftMusicEntity)
                            .createQueryBuilder('m')
                            .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
                            .leftJoinAndSelect('mf.fileEntity', 'f')
                            .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
                            .leftJoinAndSelect('mg.genreEntity', 'g')
                            .leftJoinAndSelect('m.nftMusicLikeEntity', 'ml')
                            .where('ml.userEntity = :userId', { userId: userId })
                            .andWhere(typeof search != 'undefined' ? 'm.name like :search' : '1 = 1', { search: "%".concat(search, "%") })
                            .orderBy('m.id', 'DESC')
                            .getMany()];
                    case 1:
                        nftList = _g.sent();
                        if (!nftList) {
                            throw new runtime_exception_1.RuntimeException('Music Not Found');
                        }
                        infoNftDtos = [];
                        for (_i = 0, nftList_1 = nftList; _i < nftList_1.length; _i++) {
                            nftEntity = nftList_1[_i];
                            infoNftDto = new info_nft_dto_1.InfoNftDto();
                            infoNftDto.nftMusicId = nftEntity.id;
                            infoNftDto.title = nftEntity.title;
                            infoNftDto.name = nftEntity.name;
                            infoNftDto.artist = nftEntity.artist;
                            infoNftDto.description = nftEntity.description;
                            for (_a = 0, _b = nftEntity.nftMusicFileEntity; _a < _b.length; _a++) {
                                nftFileEntity = _b[_a];
                                switch (nftFileEntity.fileType) {
                                    case 'MUSIC':
                                        infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
                                        break;
                                    case 'IMAGE':
                                        infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
                                        break;
                                }
                            }
                            genres = '';
                            for (_c = 0, _d = nftEntity.nftMusicGenreEntity; _c < _d.length; _c++) {
                                nftGenreEntity = _d[_c];
                                genres += nftGenreEntity.genreEntity.name + ', ';
                            }
                            infoNftDto.genres = genres.substring(0, genres.length - 2);
                            for (_e = 0, _f = nftEntity.nftMusicLikeEntity; _e < _f.length; _e++) {
                                nftLikeEntity = _f[_e];
                                if (typeof nftLikeEntity != 'undefined') {
                                    infoNftDto.isLike = true;
                                }
                                else {
                                    infoNftDto.isLike = false;
                                }
                            }
                            infoNftDtos.push(infoNftDto);
                        }
                        return [2 /*return*/, infoNftDtos];
                }
            });
        });
    };
    /**
     * 음악 상세
     * @param id
     */
    NftMusicRepository.prototype.findNftInfo = function (nftMusicId) {
        return __awaiter(this, void 0, void 0, function () {
            var nftInfo, infoNftDto, _i, _a, nftFileEntity, genres, _b, _c, nftGenreEntity;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(nftmusic_entity_1.NftMusicEntity)
                            .createQueryBuilder('m')
                            .leftJoinAndSelect('m.nftMusicFileEntity', 'mf')
                            .leftJoinAndSelect('mf.fileEntity', 'f')
                            .leftJoinAndSelect('m.nftMusicGenreEntity', 'mg')
                            .leftJoinAndSelect('mg.genreEntity', 'g')
                            .where('m.id = :nftMusicId', { nftMusicId: nftMusicId })
                            .getOne()];
                    case 1:
                        nftInfo = _d.sent();
                        if (!nftInfo) {
                            throw new runtime_exception_1.RuntimeException('Music Not Found');
                        }
                        infoNftDto = new info_nft_dto_1.InfoNftDto();
                        infoNftDto.nftMusicId = nftInfo.id;
                        infoNftDto.title = nftInfo.title;
                        infoNftDto.name = nftInfo.name;
                        infoNftDto.artist = nftInfo.artist;
                        infoNftDto.description = nftInfo.description;
                        for (_i = 0, _a = nftInfo.nftMusicFileEntity; _i < _a.length; _i++) {
                            nftFileEntity = _a[_i];
                            switch (nftFileEntity.fileType) {
                                case 'MUSIC':
                                    infoNftDto.musicFileUrl = nftFileEntity.fileEntity.url;
                                    break;
                                case 'IMAGE':
                                    infoNftDto.imgFileUrl = nftFileEntity.fileEntity.url;
                                    break;
                            }
                        }
                        genres = '';
                        for (_b = 0, _c = nftInfo.nftMusicGenreEntity; _b < _c.length; _b++) {
                            nftGenreEntity = _c[_b];
                            genres += nftGenreEntity.genreEntity.name + ', ';
                        }
                        infoNftDto.genres = genres.substring(0, genres.length - 2);
                        return [2 /*return*/, infoNftDto];
                }
            });
        });
    };
    NftMusicRepository = __decorate([
        (0, typeorm_1.EntityRepository)(nftmusic_entity_1.NftMusicEntity)
    ], NftMusicRepository);
    return NftMusicRepository;
}(typeorm_1.Repository));
exports.NftMusicRepository = ExchangeRepository;
