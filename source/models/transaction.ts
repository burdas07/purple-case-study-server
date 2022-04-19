// import mongoose, { Schema } from 'mongoose';
// import logging from '../config/logging';
// import ITransaction from '../interfaces/transaction';

// const TransactionSchema: Schema = new Schema(
//     {
//         from: { type: String, required: true },
//         to: { type: String, required: true },
//         amount: { type: Number }
//     },
//     {
//         timestamps: true
//     }
// );

// TransactionSchema.post<ITransaction>('save', function () {
//     logging.info('Mongo', 'New transaction added: ', this);
// });

// export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
