import { env } from '@/shared/infrastructure/config/env';
import { s3Client } from '@/shared/infrastructure/s3/s3.client';
import { CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';

async function bucketExists(name: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: name }));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const bucket = env.S3_BUCKET_NAME;

  if (await bucketExists(bucket)) {
    console.log(`El bucket "${bucket}" ya existe.`);
  } else {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
    console.log(`Bucket "${bucket}" creado.`);
  }

  // Política para hacer las imágenes de productos accesibles públicamente
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadProducts',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/products/*`],
      },
    ],
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify(policy),
    }),
  );

  console.log(`Política pública aplicada al prefijo "products/" del bucket "${bucket}".`);
}

main().catch((err) => {
  console.error('Error creando bucket:', err);
  process.exit(1);
});
