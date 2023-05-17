import { registerAs } from '@nestjs/config';

// namespaced configuration
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
}));
