import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive(),
  CLIENT_ORIGINS: z.string().min(1, 'CLIENT_ORIGINS is required'),

  DB_URL_LOCAL: z.string().min(1, 'DB_URL_LOCAL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  SALT_ROUNDS: z.coerce.number().int().positive(),
  IV_LENGTH: z.coerce.number().int().positive(),
  ENCRYPTION_SECRET_KEY: z.string().length(32, 'ENCRYPTION_SECRET_KEY must be 32 characters for aes-256-cbc'),

  USER_EMAIL: z.string().email(),
  USER_EMAIL_PASSWORD: z.string().min(1, 'USER_EMAIL_PASSWORD is required'),

  // SMTP configuration
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1, 'JWT_ACCESS_EXPIRES_IN is required'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1, 'JWT_REFRESH_EXPIRES_IN is required'),
  JWT_PREFIX: z.literal('Bearer'),

  AWS_REGION: z.string().min(1, 'AWS_REGION is required'),
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY is required'),
  AWS_KEY_FOLDER: z.string().min(1, 'AWS_KEY_FOLDER is required'),
  AWS_S3_BUCKET_NAME: z.string().min(1, 'AWS_S3_BUCKET_NAME is required'),
})

const envValidation = envSchema.safeParse(process.env)

if (!envValidation.success) {
  console.error('Invalid environment configuration:')

  for (const issue of envValidation.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`)
  }

  process.exit(1)
}

export const env = envValidation.data
