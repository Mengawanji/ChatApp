import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';


export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};


export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};


export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};


export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};