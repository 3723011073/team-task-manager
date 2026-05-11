import React, { useState } from 'react';
import { tasksAPI } from '../api';
import { Calendar, Edit2, Trash2, Check } from 'lucide-react';

export function TaskCard({ task, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      await tasksAPI.update(task.id, { status: newStatus });
      onUpdated();
    } catch (err) {
      console.error('Failed to update task status');
      setNewStatus(task.status);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(task.id);
        onUpdated();
      } catch (err) {
        console.error('Failed to delete task');
      }
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'done': 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 transition"
          title="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {task.due_date && (
          <div className={`flex gap-1 items-center text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
            <Calendar size={14} />
            {new Date(task.due_date).toLocaleDateString()}
            {isOverdue && ' (OVERDUE)'}
          </div>
        )}

        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          onBlur={newStatus !== task.status ? handleStatusChange : undefined}
          disabled={loading}
          className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer border-0 ${statusColors[newStatus] || statusColors.todo}`}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {task.priority && (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            task.priority === 'high' ? 'bg-red-100 text-red-800' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
        )}
      </div>
    </div>
  );
}
