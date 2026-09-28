import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),

  DYNAMODB_ENDPOINT: z.string().url(),
  DYNAMODB_TABLE_NAME: z.string().min(1),

  S3_ENDPOINT: z.string().url(),
  S3_BUCKET_NAME: z.string().min(1),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('2h'),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_FROM: z.string().email(),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.log('Faltan variables de entorno o tienen valores incorrectos');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
