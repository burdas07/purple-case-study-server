import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/transaction';

const createTransaction = (req: Request, res: Response, next: NextFunction) => {
    let { author, title } = req.body;

    const transaction = new Transaction({
        _id: new mongoose.Types.ObjectId(),
        author,
        title
    });

    return transaction
        .save()
        .then((result) => {
            return res.status(201).json({
                book: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

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

export default { createTransaction, getAllTransactions };
