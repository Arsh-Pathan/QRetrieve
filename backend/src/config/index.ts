import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '7600', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/qretrieve',
  baseUrl: process.env.BASE_URL || 'https://QRetrieve.arsh-io.website',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'qretrieve-dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};
