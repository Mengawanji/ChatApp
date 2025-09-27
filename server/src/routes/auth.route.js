import express from 'express';
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);

router.put("/update-profile", authenticate, updateProfile);

router.get("/check", authenticate, (req, res) => res.status(200).json(req.user));

export default router;
