const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
  throw new Error(
    'Something went wrong while loading environment variables. Please check for the existance of .env file',
  );
}

const { parsed: envs } = result;

module.exports = envs;
