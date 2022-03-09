"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const tslib_1 = require("tslib");
const s3_1 = (0, tslib_1.__importDefault)(require("aws-sdk/clients/s3"));
const fs_1 = require("fs");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new s3_1.default({
    region,
    accessKeyId,
    secretAccessKey,
});
const uploadFile = (file) => {
    console.log(file);
    const fileStream = (0, fs_1.createReadStream)(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=utils.js.map