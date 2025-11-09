import express from 'express';
import cors from 'cors';
import movieRoutes from './routes/movieRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { config } from './config/index.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: config.env });
  });

  app.use('/api/movies', movieRoutes);

  app.use(errorHandler);

  return app;
};

export default createApp;
