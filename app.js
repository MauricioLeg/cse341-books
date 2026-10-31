import express from 'express';
import {  } from './src/db/connect.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({'message': 'Hello, World!'});
});

export default app;
