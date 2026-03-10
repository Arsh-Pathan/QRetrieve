import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db';
import { config } from './config';
import v1Routes from './routes/v1';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(config.uploadDir)));

app.use('/api/v1', v1Routes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`QRetrieve backend running on port ${config.port}`);
  });
};

startServer();

export default app;
