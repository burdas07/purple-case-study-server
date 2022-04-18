import express from 'express';
import controller from '../controllers/convert';

const router = express.Router();

router.get('/money', controller.convertHealthCheck);

export = router;
