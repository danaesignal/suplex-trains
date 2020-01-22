import express from 'express';
import s3Controller from './s3.controller';
let router = express.Router();

router.post('', s3Controller.sign);

export default router;