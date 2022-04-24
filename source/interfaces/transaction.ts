import { Document } from 'mongoose';

export default interface ITransaction extends Document {
    from: string;
    to: string;
    amount: number;
    result: number;
}
