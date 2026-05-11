import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Get all users (for project assignment)
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, email, name, role FROM users ORDER BY name ASC'
    );

    res.json({ users: result.rows });
  } catch (err) {
    next(err);
  }
});

export default router;
