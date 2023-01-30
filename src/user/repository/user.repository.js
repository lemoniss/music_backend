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
exports.UserRepository = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../entity/user.entity");
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
var info_user_dto_1 = require("../dto/info.user.dto");
var UserRepository = /** @class */ (function (_super) {
    __extends(UserRepository, _super);
    function UserRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 사용자 정보 생성
     * @param createUserDto
     */
    UserRepository.prototype.createUser = function (createUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.save({
                                address: createUserDto.address,
                                nickname: 'NONAME',
                                introduce: '',
                                lang: createUserDto.lang,
                                nation: createUserDto.nation
                            })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user.id];
                    case 2:
                        e_1 = _a.sent();
                        throw new runtime_exception_1.RuntimeException('Server Error. Please try again later.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 사용자 정보 수정
     * @param updateUserDto
     */
    UserRepository.prototype.updateUser = function (id, updateUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var infoUserDto, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.findById(id)];
                    case 1:
                        infoUserDto = _a.sent();
                        return [4 /*yield*/, this.update({ id: id }, {
                                nickname: updateUserDto.nickname == '' || typeof updateUserDto.nickname == 'undefined' ? infoUserDto.nickname : updateUserDto.nickname,
                                introduce: updateUserDto.introduce == '' || typeof updateUserDto.introduce == 'undefined' ? infoUserDto.introduce : updateUserDto.introduce
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
    // async findById(id: number): Promise<InfoUserDto> {
    //   const user = await this.findOne(id);
    //
    //   if (!user) {
    //     throw new RuntimeException('User Not Found');
    //   }
    //
    //   const infoUserDto = new InfoUserDto();
    //   infoUserDto.nickname = user.nickname;
    //   infoUserDto.introduce = user.introduce;
    //
    //   return infoUserDto;
    // }
    UserRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, infoUserDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(user_entity_1.UserEntity)
                            .createQueryBuilder('user')
                            .leftJoinAndSelect('user.userFileEntity', 'userFile')
                            .leftJoinAndSelect('userFile.fileEntity', 'file')
                            .where('user.id = :id', { id: id })
                            .getOne()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new runtime_exception_1.RuntimeException('User Not Found');
                        }
                        infoUserDto = new info_user_dto_1.InfoUserDto();
                        infoUserDto.nickname = user.nickname;
                        infoUserDto.introduce = user.introduce;
                        infoUserDto.profileImgUrl = user.userFileEntity[0].fileEntity.url;
                        return [2 /*return*/, infoUserDto];
                }
            });
        });
    };
    // 최초 사용자데이터 존재여부 검색시 사용
    UserRepository.prototype.findByAddress = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(user_entity_1.UserEntity)
                            .createQueryBuilder('user')
                            .where('user.address = :address', { address: address })
                            .getOne()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.NotFoundException('User Not Found');
                        return [2 /*return*/, user];
                }
            });
        });
    };
    // header 검증용. 결과없으면 여기서 짤라버림
    UserRepository.prototype.findByIdAndAddress = function (id, address) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(user_entity_1.UserEntity)
                            .createQueryBuilder('user')
                            .where('user.id = :id', { id: id })
                            .andWhere('user.address = :address', { address: address })
                            .getOne()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.NotFoundException('User Not Found');
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserRepository = __decorate([
        (0, typeorm_1.EntityRepository)(user_entity_1.UserEntity)
    ], UserRepository);
    return UserRepository;
}(typeorm_1.Repository));
exports.UserRepository = UserRepository;
