"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postS3ResponseBody = exports.postS3ResponseSchema = void 0;
exports.postS3ResponseSchema = {
    type: 'object',
    properties: {
        ETag: { type: 'string' },
        Location: { type: 'string' },
        key: { type: 'string' },
        Key: { type: 'string' },
        Bucket: { type: 'string' },
    },
};
exports.postS3ResponseBody = {
    200: {
        content: {
            'application/json': {
                schema: exports.postS3ResponseSchema,
            },
        },
        description: 'S3 Data, img url - Data.Location',
    },
};
//# sourceMappingURL=file-controller.specs.js.map