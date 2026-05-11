import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI, usersAPI } from '../api';
import { ArrowLeft, Plus, Settings, Users, BarChart3 } from 'lucide-react';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { TaskCard } from '../components/TaskCard';
import { AddMemberModal } from '../components/AddMemberModal';

export function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectRes, tasksRes, statsRes] = await Promise.all([
          projectsAPI.getOne(projectId),
          tasksAPI.getProjectTasks(projectId),
          projectsAPI.getStats(projectId)
        ]);

        setProject(projectRes.data.project);
        setTasks(tasksRes.data.tasks || []);
        setStats(statsRes.data.stats);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleTaskCreated = () => {
    setShowCreateTask(false);
    tasksAPI.getProjectTasks(projectId).then(res => {
      setTasks(res.data.tasks || []);
    }).catch(console.error);
  };

  const handleTaskUpdated = () => {
    tasksAPI.getProjectTasks(projectId).then(res => {
      setTasks(res.data.tasks || []);
    }).catch(console.error);
  };

  const handleMemberAdded = () => {
    setShowAddMember(false);
    projectsAPI.getOne(projectId).then(res => {
      setProject(res.data.project);
    }).catch(console.error);
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600">{project.description || 'No description'}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddMember(true)}
                className="flex gap-2 items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Users size={20} />
                Add Member
              </button>
              <button
                onClick={() => setShowCreateTask(true)}
                className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Plus size={20} />
                New Task
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_tasks || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">To Do</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todo_count || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.in_progress_count || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue_count || 0}</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          {['all', 'todo', 'in_progress', 'done'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tasks */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No tasks in this project</p>
            <button
              onClick={() => setShowCreateTask(true)}
              className="inline-flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={20} />
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdated={handleTaskUpdated}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateTask && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowCreateTask(false)}
          onCreated={handleTaskCreated}
        />
      )}

      {showAddMember && (
        <AddMemberModal
          projectId={projectId}
          onClose={() => setShowAddMember(false)}
          onAdded={handleMemberAdded}
        />
      )}
    </div>
  );
}
