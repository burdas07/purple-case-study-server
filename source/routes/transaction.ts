import express from 'express';
import controller from '../controllers/transaction';
//import controller from '../controllers/sample';

const router = express.Router();

router.get('/', controller.getAllTransactions);
//router.get('/', controller.serverHealthCheck);

export = router;
