import { dbConnection } from './startup/db';
import { routes } from './startup/routes';
import express from 'express';
import config from 'config';
import nodeApiDocGenerator from 'node-api-doc-generator';

const app = express();
const port = process.env.PORT || 3000;

dbConnection();
routes(app);

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
nodeApiDocGenerator(app, 'shelves', port);

export default server;