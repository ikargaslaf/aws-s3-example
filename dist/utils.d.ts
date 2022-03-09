import S3 from 'aws-sdk/clients/s3';
import { IFile } from './interface';
export declare const uploadFile: (file: IFile) => Promise<S3.ManagedUpload.SendData>;
