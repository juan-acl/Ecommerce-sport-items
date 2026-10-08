import { v4 as uuid } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface GenerateUploadUrlResult {
  uploadUrl: string;
  publicUrl: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export class GenerateProductUploadUrlUseCase {
  constructor(
    private readonly s3Client: S3Client,
    private readonly bucketName: string,
    private readonly publicEndpoint: string,
  ) {}

  async execute(filename: string, contentType: string): Promise<GenerateUploadUrlResult> {
    const safeType = ALLOWED_TYPES.includes(contentType) ? contentType : 'image/jpeg';
    const ext = filename.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const key = `products/${uuid()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: safeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 600 });
    const publicUrl = `${this.publicEndpoint}/${this.bucketName}/${key}`;

    return { uploadUrl, publicUrl };
  }
}
