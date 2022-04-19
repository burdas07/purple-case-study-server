import express from 'express';
import controller from '../controllers/transaction';

const router = express.Router();

router.get('/', controller.getAllTransactions);

export = router;
