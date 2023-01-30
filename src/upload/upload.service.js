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
exports.UploadService = void 0;
var AWS = require("aws-sdk");
var common_1 = require("@nestjs/common");
var create_upload_dto_1 = require("./dto/create.upload.dto");
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
var UploadService = /** @class */ (function () {
    function UploadService(uploadRepository) {
        this.uploadRepository = uploadRepository;
        AWS.config.update({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
    }
    UploadService.prototype.uploadFileToS3 = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var s3Filename, error_1, s3Url, ext, createUploadDto, getAudioDurationInSeconds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3Filename = "".concat(Date.now() + this.makeId() + file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new AWS.S3()
                                .putObject({
                                Key: s3Filename,
                                Body: file.buffer,
                                Bucket: process.env.AWS_BUCKET
                            })
                                .promise()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw new runtime_exception_1.RuntimeException();
                    case 4:
                        s3Url = "https://" + process.env.AWS_BUCKET + ".s3." + process.env.AWS_REGION + ".amazonaws.com/" + s3Filename;
                        ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length);
                        createUploadDto = new create_upload_dto_1.CreateUploadDto();
                        createUploadDto.key = s3Filename;
                        createUploadDto.name = file.originalname;
                        createUploadDto.url = s3Url;
                        createUploadDto.ext = ext;
                        getAudioDurationInSeconds = require('get-audio-duration').getAudioDurationInSeconds;
                        if (ext == 'mp3' || ext == 'wav' || ext == 'flac') {
                            createUploadDto.playTime = getAudioDurationInSeconds(file).then(function (duration) {
                                return duration;
                            });
                        }
                        return [2 /*return*/, this.uploadRepository.createFile(createUploadDto)];
                }
            });
        });
    };
    UploadService.prototype.uploadFileToIpfs = function (fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var fileInfo, ipfsApi, ipfs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadRepository.findFile(fileId)];
                    case 1:
                        fileInfo = _a.sent();
                        ipfsApi = require("ipfs-api");
                        ipfs = ipfsApi(process.env.IPFS_HOST, process.env.IPFS_PORT, { protocol: process.env.IPFS_PROTOCOL });
                        return [4 /*yield*/, ipfs.util.addFromURL(fileInfo.url).then(function (result) {
                                return result[0].hash;
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UploadService.prototype.uploadMetadataToIpfs = function (metadataNftDto) {
        return __awaiter(this, void 0, void 0, function () {
            var ipfsApi, ipfs, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ipfsApi = require("ipfs-api");
                        ipfs = ipfsApi(process.env.IPFS_HOST, process.env.IPFS_PORT, { protocol: process.env.IPFS_PROTOCOL });
                        metadata = JSON.stringify({
                            music_ipfs_hash: metadataNftDto.musicIpfsHash,
                            image_ipfs_hash: metadataNftDto.imageIpfsHash,
                            title: metadataNftDto.title,
                            name: metadataNftDto.name,
                            artist: metadataNftDto.artist,
                            genres: metadataNftDto.genres,
                            description: metadataNftDto.description,
                            play_time: metadataNftDto.playTime
                        });
                        return [4 /*yield*/, ipfs.util.add(metadata).then(function (result) {
                                return result[0].hash;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UploadService.prototype.makeId = function () {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    };
    __decorate([
        __param(0, (0, common_1.UploadedFile)())
    ], UploadService.prototype, "uploadFileToS3");
    UploadService = __decorate([
        (0, common_1.Injectable)()
    ], UploadService);
    return UploadService;
}());
exports.UploadService = UploadService;
