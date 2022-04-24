import { Rates } from 'cashify/dist/lib/options';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import url from 'url';
import convert from '../lib/cashify/convert';
import Transaction from '../models/transaction';
import { convertRates } from '../server';

// rates with EUR base from 12.4. 2022, in case API doesn't work (limit reached etc..)

const urlPrefixHack = 'http://yeahIKnow.NotTheBestWay';

const convertMoney = (req: Request, res: Response, next: NextFunction) => {
    // parse the url params from request
    const url = new URL(urlPrefixHack + req.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const amount = url.searchParams.get('amount');

    console.log(`We are exchanging ${amount} ${from} into ${to}`);

    // convert using Cahify lib
    //const result = convert(1000, { from: 'EUR', to: 'GBP', base: 'EUR', rates });
    const result = convert(amount || 0, { from: from || 'NULL', to: to || 'NULL', base: 'EUR', rates: convertRates });
    console.log('result: ' + result);

    // log into the database before sending the result back to user
    const transaction = new Transaction({
        _id: new mongoose.Types.ObjectId(),
        from: from,
        to: to,
        amount: amount,
        result: result
    }).save();

    // reply for client
    return res.status(200).json({
        message: 'convert called success',
        from: from,
        to: to,
        amount: amount,
        result: result
    });
};

const convertGetRates = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: 'Convert GetRates success',
        rates: convertRates
    });
};

export default { convertMoney, convertGetRates };
