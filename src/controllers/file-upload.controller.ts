import {inject} from '@loopback/core';
import {
  HttpErrors, post,
  Request, requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import {ManagedUpload} from 'aws-sdk/clients/s3';
import {unlink} from 'fs';
import util from 'util';
import {IFile} from '../interface';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {FileUploadHandler} from '../types';
import {uploadFile} from '../utils';

/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
  /**
   * Constructor
   * @param handler - Inject an express request handler to deal with the request
   */
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
  ) { }
  @post('/files', {
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
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
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
  private static getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;

    const mapper = (f: globalThis.Express.Multer.File) => ({
      filename: f.filename,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path,
    });
    let files: IFile[] = [];

    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    const unlinkFile = util.promisify(unlink);
    const result: Promise<ManagedUpload.SendData | void>[] = files.map(
      (file: IFile) =>
        uploadFile(file)
          .then((response: ManagedUpload.SendData) => {
            unlinkFile(file.path).catch(err =>
              console.log('unlinkFile err: ', err),
            );
            return response;
          })
          .catch(err => {
            throw new HttpErrors.BadRequest(`s3 upload err: ${err}`);
          }),
    );
    return result[0];
    return {files}
  }
}

