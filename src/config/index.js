import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../');

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number.parseInt(process.env.PORT ?? '4000', 10),
  externalApi: {
    baseUrl: process.env.MOVIE_API_BASE_URL ?? 'https://api.sampleapis.com/movies',
    defaultCategory: process.env.MOVIE_API_DEFAULT_CATEGORY ?? 'animation'
  },
  database: {
    file: process.env.DATABASE_FILE
      ? path.resolve(rootDir, process.env.DATABASE_FILE)
      : path.resolve(rootDir, 'data', 'cinemademoapp.db')
  },
  server: {
    requestTimeoutMs: Number.parseInt(process.env.SERVER_REQUEST_TIMEOUT_MS ?? '15000', 10)
  }
};

export default config;
