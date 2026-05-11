# Team Task Manager

A production-ready full-stack web application for team collaboration, project management, and task tracking with advanced features including role-based access control, analytics, search, and collaboration tools.

## 🌟 Core Features

### Authentication ✅
- Secure signup/login with server-side session tokens
- Password hashing with Node's crypto (scrypt)
- Protected routes and session expiration
- Auto-login after signup (session token stored by frontend)

### Project Management ✅
- Create and manage projects
- Add team members with roles (Admin/Member)
- Project statistics and progress tracking
- Activity logs for all project changes

### Task Management ✅
- Create, assign, and track tasks
- Task status: Todo, In Progress, Done
- Priority levels: Low, Medium, High
- Due date tracking with overdue alerts
- Task comments for team collaboration

### Dashboard ✅
- Real-time statistics cards (Total, Completed, Pending, Overdue)
- My assigned tasks table with filtering
- Project overview and quick access
- One-click project and task creation

### Role-Based Access Control ✅
- **Admin**: Full project control, member management, task deletion
- **Member**: Create tasks, update assignments, view projects
- Middleware-based permission validation
- Frontend permission display

### Advanced Features ✨
- **Task Comments**: Team discussions directly on tasks
- **Search & Filter**: Full-text search across projects
- **Analytics Dashboard**: Team performance metrics and project timeline
- **CSV Export**: Export tasks for reporting and analysis
- **Activity Logs**: Track all task changes and updates
- **Real-time Updates**: Instant reflection of changes

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
-- **Authentication**: Server-side session tokens (stored in `sessions` table)
- **Deployment**: Railway

## 📋 Prerequisites

- Node.js (v16+)
- PostgreSQL database
- npm or yarn

## 🚀 Installation & Setup

### 1. Database Setup

Create a PostgreSQL database:
```bash
createdb team_task_manager
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/team_task_manager
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Run the backend:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Run the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📖 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `POST /api/projects/:projectId/members` - Add team member
- `GET /api/projects/:projectId/stats` - Get project statistics

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/project/:projectId` - Get project tasks
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task
- `GET /api/tasks/dashboard/my-tasks` - Get user's assigned tasks

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users` - Get all users

## 🎯 Usage

1. **Sign Up**: Create a new account
2. **Create Project**: Create a new project from the dashboard
3. **Add Members**: Invite team members to the project
4. **Create Tasks**: Create tasks within projects
5. **Assign Tasks**: Assign tasks to team members
6. **Track Progress**: Update task status and monitor dashboard

## 🚢 Deployment on Railway

### Prerequisites
- GitHub account with repository pushed
- Railway account (https://railway.app)

### Steps

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git branch -M main
git push -u origin main
```

2. **Deploy Backend**:
   - Go to railway.app and create a new project
   - Connect your GitHub repository
   - Create a PostgreSQL add-on
   - Set environment variables:
      - `DATABASE_URL` (auto-set by Railway)
      - `FRONTEND_URL` (your deployed frontend URL)
   - Deploy the backend service

3. **Deploy Frontend**:
   - Create another Railway service for the frontend
   - Add environment variable:
     - `VITE_API_URL=https://your-backend-url.railway.app/api`
   - Deploy the frontend service

4. **Environment Variables**:

   Backend (.env):
   ```
   DATABASE_URL=<provided by Railway>
   FRONTEND_URL=<your frontend railway URL>
   NODE_ENV=production
   PORT=3000
   ```

   Frontend (.env.local):
   ```
   VITE_API_URL=https://your-backend-railway-url/api
   ```

## 📝 Project Structure

```
team-task-manager/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ProjectPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CreateProjectModal.jsx
│   │   │   ├── CreateTaskModal.jsx
│   │   │   ├── AddMemberModal.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── AuthContext.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 Security Features

- Password hashing with Node's crypto (`scrypt`)
- Server-side session-token authentication
- Protected API routes
- Role-based access control
- CORS configuration

## 🤝 Team Roles

- **Admin**: Can create tasks, manage members, delete tasks, update project
- **Member**: Can create and update assigned tasks, view project details

## 📊 Dashboard Features

- Quick stats (total tasks, completed, overdue)
- Project overview
- Assigned tasks list
- Task filtering by status
- Priority and due date tracking

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### API Connection Issues
- Verify backend is running on correct port
- Check CORS configuration
- Verify FRONTEND_URL in backend .env

### Authentication Issues
- Clear localStorage and login again
- Verify backend is running and sessions table exists
- Check token expiration

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Created for educational purposes and job application.

---

**Ready to deploy? Start with the Backend and Frontend setup, test locally, then deploy to Railway!**
