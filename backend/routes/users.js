// routes/users.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
  res.json(req.user); // password is excluded by protect middleware
});

export default router;
