export interface IFile {
  filename: string;
  originalname: string;
  mimetype?: string;
  size?: number;
  path: string | Buffer;
}
