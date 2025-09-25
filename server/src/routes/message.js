import express from 'express';

const router = express.Router();

router.post('/send', authLimiter, validateUser, register);

export default router;