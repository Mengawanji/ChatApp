import express from 'express';

const router = express.Router();

router.post('/register', authLimiter, validateUser, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticateToken, getMe);

export default router;