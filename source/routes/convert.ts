import express from 'express';
import controller from '../controllers/convert';

const router = express.Router();

router.get('/money', controller.convertMoney);
router.get('/getrates', controller.convertGetRates);

export = router;
