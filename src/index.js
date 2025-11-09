import http from 'node:http';
import process from 'node:process';
import createApp from './app.js';
import { config } from './config/index.js';
import { initializeDatabase } from './db/sqlite.js';
import { warmUpCatalog } from './services/movieService.js';

const createServer = () => {
  const app = createApp();
  return http.createServer(app);
};

const start = async () => {
  initializeDatabase();
  await warmUpCatalog();

  const server = createServer();

  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Cinemademoapp API running at http://localhost:${config.port}`);
  });

  const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start Cinemademoapp API', error);
  process.exit(1);
});
