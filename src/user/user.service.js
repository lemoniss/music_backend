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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_repository_1 = require("./user.repository");
var user_file_repository_1 = require("./user_file.repository");
var UserService = /** @class */ (function () {
    function UserService(userRepository, userFileRepository) {
        this.userRepository = userRepository;
        this.userFileRepository = userFileRepository;
    }
    UserService.prototype.createUser = function (createUserDto) {
        return this.userRepository.createUser(createUserDto);
    };
    UserService.prototype.updateUser = function (id, updateUserDto) {
        if (typeof updateUserDto.fileId != 'undefined') {
            this.userFileRepository.createUserFile(id, updateUserDto).then();
        }
        return this.userRepository.updateUser(id, updateUserDto);
    };
    UserService.prototype.findById = function (id) {
        return this.userRepository.findById(id);
    };
    UserService.prototype.findByIdAndAddress = function (id, address) {
        return this.userRepository.findByIdAndAddress(id, address);
    };
    UserService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
        __param(1, (0, typeorm_1.InjectRepository)(user_file_repository_1.UserFileRepository))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
