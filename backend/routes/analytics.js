import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get comprehensive project analytics
router.get('/:projectId/analytics', async (req, res, next) => {
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

    // Task statistics
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo_count,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done_count,
        SUM(CASE WHEN status != 'done' AND due_date < CURRENT_DATE THEN 1 ELSE 0 END) as overdue_count,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority_count,
        ROUND(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) * 100, 2) as completion_percentage
      FROM tasks WHERE project_id = $1
    `, [projectId]);

    // Team member performance
    const performanceResult = await query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(t.id) as total_assigned,
        SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN t.status = 'todo' THEN 1 ELSE 0 END) as todo,
        SUM(CASE WHEN t.status != 'done' AND t.due_date < CURRENT_DATE THEN 1 ELSE 0 END) as overdue
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_to AND t.project_id = $1
      WHERE u.id IN (SELECT user_id FROM project_members WHERE project_id = $1)
      GROUP BY u.id, u.name, u.email
      ORDER BY completed DESC
    `, [projectId]);

    // Task timeline (tasks by due date)
    const timelineResult = await query(`
      SELECT 
        DATE(due_date) as date,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed
      FROM tasks 
      WHERE project_id = $1 AND due_date IS NOT NULL
      GROUP BY DATE(due_date)
      ORDER BY date ASC
      LIMIT 30
    `, [projectId]);

    res.json({
      stats: statsResult.rows[0],
      team_performance: performanceResult.rows,
      timeline: timelineResult.rows
    });
  } catch (err) {
    next(err);
  }
});

// Get team statistics
router.get('/:projectId/team-stats', async (req, res, next) => {
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
      SELECT 
        COUNT(DISTINCT pm.user_id) as total_members,
        SUM(CASE WHEN pm.role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN pm.role = 'member' THEN 1 ELSE 0 END) as member_count
      FROM project_members pm
      WHERE pm.project_id = $1
    `, [projectId]);

    res.json({ team_stats: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Export tasks as CSV
router.get('/:projectId/export/csv', async (req, res, next) => {
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

    const tasksResult = await query(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        u.name as assigned_to,
        t.created_at
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = $1
      ORDER BY t.created_at DESC
    `, [projectId]);

    // Create CSV
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Assigned To', 'Created At'];
    const rows = tasksResult.rows.map(task => [
      task.id,
      `"${task.title}"`,
      `"${task.description || ''}"`,
      task.status,
      task.priority,
      task.due_date || '',
      task.assigned_to || '',
      task.created_at
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="tasks_export_${projectId}.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

export default router;
