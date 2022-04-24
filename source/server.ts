import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import axios from 'axios';

// Routes import
import convertRoutes from './routes/convert';
import transactionRoutes from './routes/transaction';

const NAMESPACE = 'Server';
const router = express();

// let's init our rates here - either from fixer API or using pre-saved data

// Open Exchange rate consts -> USD base in default
const baseUrlOER = 'http://openexchangerates.org/api/latest.json';
const API_KEY_OER = '18abbc2925cf4d0384b83f625045a91a';

// Open Exchange Rate
const getLatestRatesOER = () => {
    var request = baseUrlOER + '?app_id=' + API_KEY_OER;
    console.log(request);

    axios.get(request).then((response) => {
        console.log('Open Exchange Rate API Call');
        // console.log(response);
        // console.log(response.data.rates);
        // console.log(JSON.stringify(response.data.rates, null, 2));

        // Read data structure test
        // console.log('1 US Dollar equals ' + response.data.rates.GBP + ' British Pounds');
        var rates = response.data.rates;
        console.log(rates);
    });
};

getLatestRatesOER();

// connect to mongo atlas
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'MongoAtlas Connected');
        logging.info(NAMESPACE, config.mongo.url);
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

// Parse the body of the request ... not necessary, we are requesting via url
//router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());

// Rules for the API
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');

        return res.status(200).json({
            usage: '/api/convert/?from={FROM}&to={TO}&amount={AMOUNT}',
            example: '/api/convert?from=EUR&to=USD&amount=10'
        });
    }

    next();
});

// All the routes
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
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running at ${config.server.hostname}:${config.server.port}`));
