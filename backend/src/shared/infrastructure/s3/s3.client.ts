import { S3Client } from '@aws-sdk/client-s3';
import { env } from '../config/env';

export const s3Client = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.S3_ENDPOINT,
  forcePathStyle: env.S3_FORCE_PATH_STYLE,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export const BUCKET_NAME = env.S3_BUCKET_NAME;
