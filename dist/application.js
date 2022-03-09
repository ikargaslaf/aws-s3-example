"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Application = void 0;
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const multer_1 = (0, tslib_1.__importDefault)(require("multer"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const keys_1 = require("./keys");
const sequence_1 = require("./sequence");
class AwsS3Application extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        require('dotenv').config();
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
        this.configureFileUpload(options.fileStorageDirectory);
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
    configureFileUpload(destination) {
        // Upload files to `dist/.sandbox` by default
        destination = destination !== null && destination !== void 0 ? destination : path_1.default.join(__dirname, '../.sandbox');
        this.bind(keys_1.STORAGE_DIRECTORY).to(destination);
        const multerOptions = {
            storage: multer_1.default.diskStorage({
                destination,
                // Use the original file name as is
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
        };
        // Configure the file upload service with multer options
        this.configure(keys_1.FILE_UPLOAD_SERVICE).to(multerOptions);
    }
}
exports.AwsS3Application = AwsS3Application;
//# sourceMappingURL=application.js.map