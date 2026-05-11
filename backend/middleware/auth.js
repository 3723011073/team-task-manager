import { query } from '../db.js';

// Verify session token from `sessions` table
export async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // Look up token in sessions table
    const result = await query('SELECT user_id, expires_at FROM sessions WHERE token = $1', [token]);
    if (result.rows.length === 0) return res.status(403).json({ error: 'Invalid or expired token' });

    const session = result.rows[0];
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      // Session expired - remove it
      await query('DELETE FROM sessions WHERE token = $1', [token]);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach minimal user info (user_id); route handlers can fetch more if needed
    req.user = { id: session.user_id };
    next();
  } catch (err) {
    console.error('verifyToken error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export function requireRole(roles) {
  return async (req, res, next) => {
    try {
      // Fetch user role from DB
      const result = await query('SELECT role FROM users WHERE id = $1', [req.user.id]);
      if (result.rows.length === 0) return res.status(403).json({ error: 'User not found' });
      const role = result.rows[0].role;
      if (!roles.includes(role)) return res.status(403).json({ error: 'Insufficient permissions' });
      req.user.role = role;
      next();
    } catch (err) {
      console.error('requireRole error', err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
}

export function requireProjectAccess(req, res, next) {
  req.requireProjectAccess = true;
  next();
}
