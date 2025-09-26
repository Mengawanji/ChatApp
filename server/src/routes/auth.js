import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateUser } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';


const router = express.Router();

router.post('/register',authLimiter, validateUser, register);
router.post('/login', authLimiter,authenticate, login);
export default router;