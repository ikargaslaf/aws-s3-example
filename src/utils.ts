import S3, {PutObjectRequest} from 'aws-sdk/clients/s3';
import {createReadStream, ReadStream} from 'fs';
import {IFile} from './interface';

const bucketName: string = process.env.AWS_BUCKET_NAME!;
const region: string = process.env.AWS_BUCKET_REGION!;
const accessKeyId: string = process.env.AWS_ACCESS_KEY!;
const secretAccessKey: string = process.env.AWS_SECRET_KEY!;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export const uploadFile = (file: IFile): Promise<S3.ManagedUpload.SendData> => {
  console.log(file);
  const fileStream: ReadStream = createReadStream(file.path);

  const uploadParams: PutObjectRequest = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};
