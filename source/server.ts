import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';

// Routes import
import sampleRoutes from './routes/sample';
import convertRoutes from './routes/convert';
import transactionRoutes from './routes/transaction';

const NAMESPACE = 'Server';
const router = express();

// connect to mongo atlas
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'MongoAtlas Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

// Log the request response
router.use((req, res, next) => {
    // request
    logging.info(NAMESPACE, `REQ METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        // response
        logging.info(NAMESPACE, `RESP METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

// Parse the body of the request
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Rules for the API
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

        return res.status(200).json({
            message: '/api/convert/?from={FROM}&to={TO}&amount={AMOUNT}',
            example: '/api/convert?from=EUR&to=USD&amount=10',
            convertedValue: 'result:number'
        });
    }

    next();
});

// All the routes
router.use('/api/sample', sampleRoutes);
router.use('/api/convert', convertRoutes);
router.use('/api/transaction', transactionRoutes);

// Error handling
router.use((req, res, next) => {
    const error = new Error('Api endpoint not found :(');

    res.status(404).json({
        message: error.message
    });
});

// Start the server
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running my mate at ${config.server.hostname}:${config.server.port}`));
