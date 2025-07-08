import { z } from 'zod'

const envSchema = z.object({
  KINDE_ISSUER_URL: z.string().url('KINDE_ISSUER_URL must be a valid url'),
  KINDE_CLIENT_ID: z.string(),
  KINDE_CLIENT_SECRET: z.string(),
  KINDE_SITE_URL: z.string().url('KINDE_SITE_URL must be a valid url'),
  KINDE_LOGOUT_REDIRECT_URI: z.string().url('KINDE_LOGOUT_REDIRECT_URI must be a valid url'),
  KINDE_DOMAIN: z.string().url('KINDE_DOMAIN must be a valid url'),
  KINDE_REDIRECT_URI: z.string().url('KINDE_REDIRECT_URI must be a valid url'),
  DATABASE_URL: z.string().nonempty(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('Error validading .env variables')
  console.table(result.error.issues, ['path', 'message'])
  process.exit(1)
}

export const env = result.data
