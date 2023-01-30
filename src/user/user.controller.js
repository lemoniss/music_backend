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
exports.UserController = void 0;
var common_1 = require("@nestjs/common");
var UserController = /** @class */ (function () {
    function UserController(userService) {
        this.userService = userService;
    }
    /**
     * 사용자 정보 생성
     * @param createUserDto
     */
    UserController.prototype.createUser = function (createUserDto) {
        return this.userService.createUser(createUserDto);
    };
    /**
     * 사용자 정보 수정
     * @param updateUserDto
     */
    // @UsePipes(ValidationPipe)
    UserController.prototype.updateUser = function (id, updateUserDto) {
        return this.userService.updateUser(id, updateUserDto);
    };
    UserController.prototype.findById = function (id) {
        return this.userService.findById(id);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)())
    ], UserController.prototype, "createUser");
    __decorate([
        (0, common_1.Patch)("/:id"),
        __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
        __param(1, (0, common_1.Body)())
    ], UserController.prototype, "updateUser");
    __decorate([
        (0, common_1.Get)("/:id"),
        __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe))
    ], UserController.prototype, "findById");
    UserController = __decorate([
        (0, common_1.Controller)("users")
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
