import express from 'express';
import crypto from 'crypto';
import { query } from '../db.js';

const router = express.Router();

/**
 * ========== SIGNUP ROUTE ==========
 * POST /api/auth/signup
 * 
 * What it does:
 * 1. Creates a new user account
 * 2. Hashes the password (never store plain text!)
 * 3. Creates a session token
 * 4. Returns token to frontend
 * 
 * Frontend sends: { email, password, name }
 * Backend returns: { token, user }
 */
router.post('/signup', async (req, res, next) => {
  try {
    // Extract data from request body
    const { email, password, name } = req.body;

    // ✅ VALIDATION: Check all required fields exist
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // 📋 CHECK IF EMAIL ALREADY EXISTS
    // Prevent duplicate accounts with same email
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 🔐 HASH PASSWORD using built-in crypto.scrypt
    // We'll store as: salt:hashHex
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashedPassword = `${salt}:${derivedKey}`;

    // 💾 SAVE USER TO DATABASE
    // Store email, hashed password, name, and default role as 'member'
    const result = await query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, hashedPassword, name, 'member']
    );

    const user = result.rows[0];

    // 🔑 CREATE A SIMPLE SESSION TOKEN
    // Generate a random token, store it in sessions table with expiry
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await query('INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)', [token, user.id, expiresAt]);

    // ✅ SEND RESPONSE
    // Frontend will receive token and store it in localStorage
    res.status(201).json({
      message: 'User registered successfully',
      token,  // ← Frontend stores this!
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ========== LOGIN ROUTE ==========
 * POST /api/auth/login
 * 
 * What it does:
 * 1. Finds user by email
 * 2. Verifies password matches
 * 3. Creates session token
 * 4. Returns token to frontend
 * 
 * Frontend sends: { email, password }
 * Backend returns: { token, user }
 */
router.post('/login', async (req, res, next) => {
  try {
    // Extract email and password from request
    const { email, password } = req.body;

    // ✅ VALIDATION: Check both fields exist
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 🔍 FIND USER BY EMAIL
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      // Don't say "Email not found" (security best practice)
      // Attackers could find which emails exist
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // 🔐 VERIFY PASSWORD using stored salt:hash
    const [salt, storedHash] = user.password.split(':');
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashBuffer = Buffer.from(storedHash, 'hex');
    const derivedBuffer = Buffer.from(derivedKey, 'hex');
    const passwordsMatch = hashBuffer.length === derivedBuffer.length && crypto.timingSafeEqual(hashBuffer, derivedBuffer);
    if (!passwordsMatch) return res.status(401).json({ error: 'Invalid email or password' });

    // 🔑 CREATE SESSION TOKEN
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await query('INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)', [token, user.id, expiresAt]);

    // ✅ SEND RESPONSE
    res.json({
      message: 'Logged in successfully',
      token,  // ← Frontend stores this!
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
