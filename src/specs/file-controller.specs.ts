import {ResponsesObject, SchemaObject} from '@loopback/rest';

export const postS3ResponseSchema: SchemaObject = {
  type: 'object',
  properties: {
    ETag: {type: 'string'},
    Location: {type: 'string'},
    key: {type: 'string'},
    Key: {type: 'string'},
    Bucket: {type: 'string'},
  },
}

export const postS3ResponseBody: ResponsesObject = {
  200: {
    content: {
      'application/json': {
        schema: postS3ResponseSchema,
      },
    },
    description: 'S3 Data, img url - Data.Location',
  },
}
