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
exports.MyMusicGenreRepository = void 0;
var typeorm_1 = require("typeorm");
var mymusic_entity_1 = require("../entity/mymusic.entity");
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
var mymusic_genre_entity_1 = require("../entity/mymusic_genre.entity");
var genre_entity_1 = require("../entity/genre.entity");
var MyMusicGenreRepository = /** @class */ (function (_super) {
    __extends(MyMusicGenreRepository, _super);
    function MyMusicGenreRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 음악_장르 정보 생성
     * @param createUserDto
     */
    MyMusicGenreRepository.prototype.createMusicGenre = function (myMusicId, createMusicDto) {
        return __awaiter(this, void 0, void 0, function () {
            var myMusicEntity, _i, _a, genreId, genreEntity, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        myMusicEntity = new mymusic_entity_1.MyMusicEntity();
                        myMusicEntity.id = myMusicId;
                        _i = 0, _a = createMusicDto.genreId;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        genreId = _a[_i];
                        genreEntity = new genre_entity_1.GenreEntity();
                        genreEntity.id = genreId;
                        return [4 /*yield*/, this.save({
                                myMusicEntity: myMusicEntity,
                                genreEntity: genreEntity
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        throw new runtime_exception_1.RuntimeException('Server Error. Please try again later.');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 음악_장르 정보 갱신
     * @param createUserDto
     */
    MyMusicGenreRepository.prototype.updateMusicGenre = function (myMusicId, updateMusicDto) {
        return __awaiter(this, void 0, void 0, function () {
            var myMusicEntity, _i, _a, genreId, genreEntity, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        myMusicEntity = new mymusic_entity_1.MyMusicEntity();
                        myMusicEntity.id = myMusicId;
                        return [4 /*yield*/, (0, typeorm_1.getConnection)()
                                .createQueryBuilder()["delete"]()
                                .from(mymusic_genre_entity_1.MyMusicGenreEntity)
                                .where('myMusicEntity = :myMusicId', { myMusicId: myMusicId })
                                .execute()];
                    case 1:
                        _b.sent();
                        _i = 0, _a = updateMusicDto.genreId;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        genreId = _a[_i];
                        genreEntity = new genre_entity_1.GenreEntity();
                        genreEntity.id = genreId;
                        return [4 /*yield*/, this.save({
                                myMusicEntity: myMusicEntity,
                                genreEntity: genreEntity
                            })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_2 = _b.sent();
                        throw new runtime_exception_1.RuntimeException('Server Error. Please try again later.');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 음악_장르 삭제
     * @param myMusicId
     */
    MyMusicGenreRepository.prototype.deleteMusicGenre = function (myMusicId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, typeorm_1.getConnection)()
                                .createQueryBuilder()["delete"]()
                                .from(mymusic_genre_entity_1.MyMusicGenreEntity)
                                .where('myMusicEntity = :myMusicId', { myMusicId: myMusicId })
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
    MyMusicGenreRepository = __decorate([
        (0, typeorm_1.EntityRepository)(mymusic_genre_entity_1.MyMusicGenreEntity)
    ], MyMusicGenreRepository);
    return MyMusicGenreRepository;
}(typeorm_1.Repository));
exports.MyMusicGenreRepository = MyMusicGenreRepository;
