import { dbConnection } from './startup/db';
import { routes } from './startup/routes';
import express from 'express';
import config from 'config';

const app = express();
const port = process.env.PORT || 3000;

dbConnection();
routes(app);

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

export default server;