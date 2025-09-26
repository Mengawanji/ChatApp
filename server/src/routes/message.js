import express from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/send', authLimiter);

export default router;