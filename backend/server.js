import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
require('dotenv').config({ path: '../.env' })
import { getFood } from './api';
import { router } from './router'

// and create our instances
const app = express();
require('./db')

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;
// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));