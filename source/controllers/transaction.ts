import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/transaction';

const getAllTransactions = (req: Request, res: Response, next: NextFunction) => {
    Transaction.find()
        .exec()
        .then((results) => {
            console.log(results.toString());
            return res.status(200).json({
                transactions: results,
                count: results.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { getAllTransactions };
