"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_module_1 = require("./user/user.module");
var auth_middleware_1 = require("./middleware/auth.middleware");
var user_controller_1 = require("./user/user.controller");
var genre_module_1 = require("./genre/genre.module");
var config_1 = require("@nestjs/config");
var upload_module_1 = require("./upload/upload.module");
var upload_controller_1 = require("./upload/upload.controller");
var genre_controller_1 = require("./genre/genre.controller");
var mymusic_module_1 = require("./mymusic/mymusic.module");
var mymusic_controller_1 = require("./mymusic/mymusic.controller");
var nftmusic_controller_1 = require("./nftmusic/nftmusic.controller");
var nftmusic_module_1 = require("./nftmusic/nftmusic.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.configure = function (consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            //exclude 함수는 제외 하고싶은 라우터를 등록합니다.
            .exclude({ path: 'user', method: common_1.RequestMethod.POST }) // 유저 생성
            // .exclude({ path: 'user/user_all', method: RequestMethod.GET }) // 유저 전체 조회
            .forRoutes(user_controller_1.UserController, upload_controller_1.UploadController, genre_controller_1.GenreController, mymusic_controller_1.MyMusicController, nftmusic_controller_1.NftMusicController); // 1.유저 컨트롤러 등록
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                // TypeOrmModule.forRoot(typeORMConfig), // TypeORM 설정 파일 연결
                config_1.ConfigModule.forRoot({
                    isGlobal: true
                }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: process.env.MYSQL_HOST,
                    port: Number(process.env.MYSQL_PORT),
                    username: process.env.MYSQL_USERNAME,
                    password: process.env.MYSQL_PASSWORD,
                    database: process.env.MYSQL_DATABASE,
                    entities: ['dist/**/*.entity.{ts,js}'],
                    synchronize: true,
                    logging: true
                }),
                user_module_1.UserModule,
                genre_module_1.GenreModule,
                upload_module_1.UploadModule,
                mymusic_module_1.MyMusicModule,
                nftmusic_module_1.NftMusicModule,
            ],
            controllers: [],
            providers: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
