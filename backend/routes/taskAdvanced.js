import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Add comment to task
router.post('/:taskId/comments', async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    // Get task
    const taskResult = await query('SELECT project_id FROM tasks WHERE id = $1', [taskId]);
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const projectId = taskResult.rows[0].project_id;

    // Check access
    const accessCheck = await query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await query(
      'INSERT INTO task_comments (task_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [taskId, userId, comment]
    );

    res.status(201).json({ message: 'Comment added', comment: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Get task comments
router.get('/:taskId/comments', async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Get task
    const taskResult = await query('SELECT project_id FROM tasks WHERE id = $1', [taskId]);
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const projectId = taskResult.rows[0].project_id;

    // Check access
    const accessCheck = await query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await query(
      `SELECT tc.*, u.name as user_name, u.email 
       FROM task_comments tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.task_id = $1
       ORDER BY tc.created_at DESC`,
      [taskId]
    );

    res.json({ comments: result.rows });
  } catch (err) {
    next(err);
  }
});

// Search tasks
router.get('/search/query', async (req, res, next) => {
  try {
    const { q, projectId, status, priority } = req.query;
    const userId = req.user.id;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let sql = `
      SELECT t.* FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = $1
      AND (t.title ILIKE $2 OR t.description ILIKE $2)
    `;
    const params = [userId, `%${q}%`];

    if (projectId) {
      sql += ` AND t.project_id = $${params.length + 1}`;
      params.push(projectId);
    }

    if (status) {
      sql += ` AND t.status = $${params.length + 1}`;
      params.push(status);
    }

    if (priority) {
      sql += ` AND t.priority = $${params.length + 1}`;
      params.push(priority);
    }

    sql += ' ORDER BY t.due_date ASC, t.priority DESC';

    const result = await query(sql, params);
    res.json({ tasks: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get activity log (tasks updated recently)
router.get('/project/:projectId/activity', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check access
    const accessCheck = await query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await query(`
      SELECT t.*, u.name as updated_by_name, u.email as updated_by_email
      FROM tasks t
      JOIN users u ON t.created_by = u.id
      WHERE t.project_id = $1
      ORDER BY t.updated_at DESC
      LIMIT 20
    `, [projectId]);

    res.json({ activity: result.rows });
  } catch (err) {
    next(err);
  }
});

export default router;
