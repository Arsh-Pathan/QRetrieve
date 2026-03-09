require('dotenv').config();

module.exports = {
  port: process.env.PORT || 7600,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/qretrieve',
  baseUrl: process.env.BASE_URL || 'https://QRetrieve.arsh-io.website',
  nodeEnv: process.env.NODE_ENV || 'development',
};
