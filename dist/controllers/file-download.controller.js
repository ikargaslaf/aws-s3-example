"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDownloadController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const util_1 = require("util");
const keys_1 = require("../keys");
const readdir = (0, util_1.promisify)(fs_1.default.readdir);
/**
 * A controller to handle file downloads using multipart/form-data media type
 */
let FileDownloadController = class FileDownloadController {
    constructor(storageDirectory) {
        this.storageDirectory = storageDirectory;
    }
    async listFiles() {
        const files = await readdir(this.storageDirectory);
        return files;
    }
    downloadFile(fileName, response) {
        const file = this.validateFileName(fileName);
        response.download(file, fileName);
        const del_res = (0, rest_1.del)(this.storageDirectory);
        console.log(del_res);
        return response;
    }
    /**
     * Validate file names to prevent them goes beyond the designated directory
     * @param fileName - File name
     */
    validateFileName(fileName) {
        const resolved = path_1.default.resolve(this.storageDirectory, fileName);
        if (resolved.startsWith(this.storageDirectory))
            return resolved;
        // The resolved file is outside sandbox
        throw new rest_1.HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
    }
};
(0, tslib_1.__decorate)([
    (0, rest_1.get)('/files', {
        responses: {
            200: {
                content: {
                    // string[]
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    },
                },
                description: 'A list of files',
            },
        },
    }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], FileDownloadController.prototype, "listFiles", null);
(0, tslib_1.__decorate)([
    (0, rest_1.get)('/files/{filename}'),
    rest_1.oas.response.file(),
    (0, tslib_1.__param)(0, rest_1.param.path.string('filename')),
    (0, tslib_1.__param)(1, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, Object]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FileDownloadController.prototype, "downloadFile", null);
FileDownloadController = (0, tslib_1.__decorate)([
    (0, tslib_1.__param)(0, (0, core_1.inject)(keys_1.STORAGE_DIRECTORY)),
    (0, tslib_1.__metadata)("design:paramtypes", [String])
], FileDownloadController);
exports.FileDownloadController = FileDownloadController;
//# sourceMappingURL=file-download.controller.js.map