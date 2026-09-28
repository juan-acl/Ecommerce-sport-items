import { env } from '@shared/infrastructure/config/env';

export class S3ImageService {
  constructor(
    private readonly bucketName: string,
    private readonly publicEndpoint: string,
  ) {}

  getPublicUrl(key: string): string {
    return `${this.publicEndpoint}/${this.bucketName}/${key}`;
  }

  buildProductKey(productId: string, extension = 'jpg'): string {
    return `products/${productId}.${extension}`;
  }
}

export function createS3ImageService(): S3ImageService {
  return new S3ImageService(env.S3_BUCKET_NAME, env.S3_ENDPOINT);
}
