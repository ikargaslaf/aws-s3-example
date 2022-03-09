"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const fs_1 = require("fs");
const util_1 = (0, tslib_1.__importDefault)(require("util"));
const keys_1 = require("../keys");
const utils_1 = require("../utils");
/**
 * A controller to handle file uploads using multipart/form-data media type
 */
let FileUploadController = class FileUploadController {
    /**
     * Constructor
     * @param handler - Inject an express request handler to deal with the request
     */
    constructor(handler) {
        this.handler = handler;
    }
    async fileUpload(request, response) {
        return new Promise((resolve, reject) => {
            this.handler(request, response, (err) => {
                if (err)
                    reject(err);
                else {
                    console.log(request.files);
                    resolve(FileUploadController.getFilesAndFields(request));
                }
            });
        });
    }
    /**
     * Get files and fields for the request
     * @param request - Http request
     */
    static getFilesAndFields(request) {
        const uploadedFiles = request.files;
        const mapper = (f) => ({
            filename: f.filename,
            originalname: f.originalname,
            mimetype: f.mimetype,
            size: f.size,
            path: f.path,
        });
        let files = [];
        if (Array.isArray(uploadedFiles)) {
            files = uploadedFiles.map(mapper);
        }
        else {
            for (const filename in uploadedFiles) {
                files.push(...uploadedFiles[filename].map(mapper));
            }
        }
        const unlinkFile = util_1.default.promisify(fs_1.unlink);
        const result = files.map((file) => (0, utils_1.uploadFile)(file)
            .then((response) => {
            unlinkFile(file.path).catch(err => console.log('unlinkFile err: ', err));
            return response;
        })
            .catch(err => {
            throw new rest_1.HttpErrors.BadRequest(`s3 upload err: ${err}`);
        }));
        return result[0];
        return { files };
    }
};
(0, tslib_1.__decorate)([
    (0, rest_1.post)('/files', {
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                        },
                    },
                },
                description: 'Files and fields',
            },
        },
    }),
    (0, tslib_1.__param)(0, rest_1.requestBody.file()),
    (0, tslib_1.__param)(1, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], FileUploadController.prototype, "fileUpload", null);
FileUploadController = (0, tslib_1.__decorate)([
    (0, tslib_1.__param)(0, (0, core_1.inject)(keys_1.FILE_UPLOAD_SERVICE)),
    (0, tslib_1.__metadata)("design:paramtypes", [Function])
], FileUploadController);
exports.FileUploadController = FileUploadController;
//# sourceMappingURL=file-upload.controller.js.map