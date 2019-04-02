import config from 'nconf';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';

config.argv().env().file({
  file: path.resolve(`../../config/envs/${environment}.json`),
});

config.defaults({});

export const configProvider = config;
