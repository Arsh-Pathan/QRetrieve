require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/qretrieve',
  baseUrl: process.env.BASE_URL || 'https://qretrieve.app',
  nodeEnv: process.env.NODE_ENV || 'development',
};
