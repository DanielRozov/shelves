import { dbConnection } from './startup/db';
import { routes } from './startup/routes';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

dbConnection();
routes(app);

const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

export default server;