function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  resendApiKey: requireEnv('RESEND_API_KEY'),
  fromEmail: requireEnv('FROM_EMAIL'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
