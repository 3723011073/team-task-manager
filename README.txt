================================================================================
                    TEAM TASK MANAGER - README
================================================================================
Version: 1.0.0
Author: Development Team
Last Updated: May 11, 2026

================================================================================
PROJECT OVERVIEW
================================================================================

Team Task Manager is a comprehensive web-based task management and team
collaboration platform. It allows organizations to manage projects, assign
tasks to team members, track progress, and monitor team performance through
an intuitive admin portal and member dashboards.

Key Features:
  • Role-based access control (Admin/Member)
  • Server-side session authentication (No JWT tokens)
  • Project and task management
  • Team member assignments
  • Real-time task status tracking
  • Admin analytics and team performance monitoring
  • Graceful demo mode when database is offline
  • Responsive web interface with Tailwind CSS

================================================================================
SYSTEM REQUIREMENTS
================================================================================

Node.js:
  • Version 18.x or higher
  • npm (Node Package Manager)

PostgreSQL (Optional but recommended):
  • Version 12.x or higher
  • For production use with persistent data storage

Operating System:
  • Windows, macOS, or Linux
  • Tested on Windows 10+

Browser:
  • Chrome, Firefox, Safari, or Edge (modern versions)

================================================================================
QUICK START GUIDE
================================================================================

1. INSTALLATION

   Navigate to the project directory and install dependencies:
   
   cd "Team Task Manager"
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..

2. RUNNING THE APPLICATION

   Start the development server with:
   
   node run-dev.js
   
   This will:
   • Start the Vite frontend development server (port ~5173-5177)
   • Start the Express backend server (port 5000)
   • Automatically use demo mode if PostgreSQL is not available
   
   Expected output:
   ✓ Server running on port 5000
   ✓ API: http://localhost:5000
   ⚠ Running in demo mode because PostgreSQL is offline.

3. ACCESSING THE APPLICATION

   Open your web browser and navigate to:
   http://localhost:5173 (or the next available port shown in console)

4. LOGGING IN

   Use these demo credentials to test the application:

   ADMIN ACCOUNT:
   • Email: admin@teamtask.local
   • Password: DemoAdmin@123
   • Role: Administrator
   
   MEMBER ACCOUNT:
   • Email: member@teamtask.local
   • Password: DemoMember@123
   • Role: Team Member

================================================================================
DEMO MODE DETAILS
================================================================================

When PostgreSQL is not available, the application automatically starts in
demo mode with the following behavior:

• All data is stored in-memory (non-persistent)
• Sample project "Q2 Product Launch" is pre-loaded
• Three sample tasks are included
• Admin and Member demo accounts are pre-configured
• New users can be created and will persist during the session
• New tasks, status changes, and assignments work in real-time
• Closing the application will lose all changes made in demo mode

Demo Mode Data:
  • Admin User: id=1, email=admin@teamtask.local, role=admin
  • Member User: id=2, email=member@teamtask.local, role=member
  • Sample Project: Q2 Product Launch (id=1)
  • Sample Tasks: 3 tasks with various statuses (todo, in_progress, done)

Advantages of Demo Mode:
  • No database setup required
  • Immediate testing of features
  • Perfect for development and evaluation
  • Graceful fallback when database is unavailable

================================================================================
ADMIN PORTAL FEATURES
================================================================================

ACCESS: Login with admin account → Admin Portal automatically loads

ADMIN DASHBOARD DISPLAYS:

1. Summary Cards
   • Total Users - Number of registered team members
   • Projects - Number of active projects
   • Total Tasks - Number of all tasks across projects
   • Overdue - Number of tasks past their due date

2. Team Performance Table
   • Click on any member name to view their detailed profile
   • Displays for each member:
     - Assigned: Number of tasks assigned to member
     - Completed: Number of completed tasks
     - In Progress: Number of tasks in progress
     - Overdue: Number of overdue tasks

3. Member Detail Modal (Opened by Clicking Member Name)
   • VIEW MEMBER'S ACTIVE TASKS
     - Shows only To Do and In Progress tasks (hides completed)
     - Task title, description, due date, priority, and status
     - Status dropdown to change task status (auto-filters when marked Done)
     - Delete button to remove tasks
   
   • CREATE NEW TASK FOR MEMBER
     - Click "Add Task" button to open form
     - Select project from dropdown
     - Enter task title and description
     - Set priority (Low, Medium, High)
     - Set optional due date
     - Click "Create Task" to assign to member
   
   • VIEW PROJECT ASSIGNMENTS
     - See which projects the member belongs to
     - "Remove from project" button to unassign member

4. Recent Activity Feed
   • Shows latest task updates across all members
   • Task name, project, status, and timestamp
   • Helps admin monitor team progress

5. Project Management Section
   • Lists all projects with descriptions
   • "Add Member to Project" button to add member to any project
   • "Add Member" button on each project card
   • Easy member assignment across projects

================================================================================
MEMBER DASHBOARD FEATURES
================================================================================

ACCESS: Login with member account → Member Dashboard automatically loads

MEMBER DASHBOARD DISPLAYS:

1. Summary Cards
   • My Tasks - Number of tasks assigned to member
   • Completed - Number of completed tasks
   • Overdue - Number of overdue tasks

2. Your Projects
   • List of all projects the member is assigned to
   • Project name and description
   • Click project card to view detailed project page

3. My Tasks Table
   • All tasks assigned to the member
   • Columns: Task name, Project, Status, Due Date
   • Click project name to navigate to project detail page

PROJECT DETAIL PAGE:

• Task Statistics
  - Total Tasks in project
  - To Do count
  - In Progress count
  - Overdue count

• Task Management
  - View all project tasks
  - Filter by status (All, TODO, IN PROGRESS, DONE)
  - Change task status via dropdown
  - Delete button for task removal (project members can delete)
  - Priority and due date display

• Project Members
  - Add Member button to invite new team member by email
  - View project members and their roles

• New Task Creation
  - "New Task" button to create task for project
  - Assign to yourself or leave unassigned
  - Set priority and due date

================================================================================
AUTHENTICATION SYSTEM
================================================================================

METHOD: Server-Side Session Tokens (No JWT)

How It Works:
1. User signs up with email, password, and name
2. Server validates password meets requirements:
   • Minimum 8 characters
   • At least one uppercase letter
   • At least one lowercase letter
   • At least one number
   • At least one special character

3. Server creates random session token and stores in database
4. Token returned to client and stored in localStorage
5. Token sent with each API request in Authorization header
6. Server validates token and checks session expiry (7 days)

Password Reset Flow:
1. User clicks "Forgot Password?"
2. Enters email address
3. Server generates reset token and sends email (if SMTP configured)
4. In demo mode: Reset link is displayed on screen
5. User clicks link and sets new password
6. Password is validated and updated in database

Session Management:
• Sessions automatically expire after 7 days of inactivity
• User can logout to invalidate session token
• Logout clears localStorage token on client

Security Features:
• Passwords hashed using crypto.scryptSync (not plaintext)
• Crypto.randomBytes for secure token generation
• Session stored server-side (not client-side)
• Token validation on every API request

================================================================================
ROLE-BASED ACCESS CONTROL
================================================================================

ADMIN ROLE:
✓ View admin portal with team analytics
✓ View all team members and their task statistics
✓ Click on any member to view their tasks and profile
✓ Create tasks and assign to any member
✓ Change task status (including marking as done)
✓ Delete any member's tasks
✓ Add members to projects
✓ Remove members from projects
✓ View recent activity across all members
✓ Cannot access member dashboard (viewing members instead)

MEMBER ROLE:
✓ Access member dashboard with personal task view
✓ View assigned tasks and projects
✓ View all projects they're assigned to
✓ See project details and all tasks in projects
✓ Change task status (update own tasks)
✓ Create new tasks within projects (for collaboration)
✓ Add members to projects they belong to
✓ Cannot see admin portal or team analytics
✓ Cannot view other members' task lists

PUBLIC (Unauthenticated):
✓ Access login page
✓ Access signup page
✓ Access forgot password page
✗ Cannot access any dashboard, projects, or tasks

================================================================================
DATABASE SETUP (OPTIONAL - PostgreSQL)
================================================================================

If you want to use PostgreSQL for persistent data storage:

POSTGRESQL INSTALLATION:
1. Download and install PostgreSQL from https://www.postgresql.org
2. Note the password you set for the postgres user
3. Create a new database:
   
   createdb team_task_manager

ENVIRONMENT VARIABLES:
Create a .env file in the backend directory:

   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=team_task_manager
   SEED_DEMO_DATA=true

RUNNING WITH DATABASE:
1. Start PostgreSQL service
2. Run: node run-dev.js
3. Application will connect to database instead of using demo mode
4. If SEED_DEMO_DATA=true, sample data will be pre-loaded

DATABASE SCHEMA:
• users - Stores user accounts and credentials
• projects - Stores project information
• project_members - Tracks members assigned to projects
• tasks - Stores task data and assignments
• task_comments - Stores comments on tasks (optional)
• sessions - Stores active session tokens
• password_resets - Stores password reset tokens

================================================================================
PROJECT FILE STRUCTURE
================================================================================

Team Task Manager/
├── frontend/                    # React + Vite frontend application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── AuthPage.jsx    # Login/Signup UI
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ProjectPage.jsx
│   │   ├── components/         # Reusable components
│   │   │   ├── MemberDetailModal.jsx  # Admin member view
│   │   │   ├── TaskCard.jsx
│   │   │   ├── CreateTaskModal.jsx
│   │   │   └── AddMemberModal.jsx
│   │   ├── AuthContext.jsx     # Authentication state management
│   │   ├── api.js              # API client and endpoints
│   │   └── App.jsx             # Main app with routing
│   └── package.json
│
├── backend/                     # Node.js + Express backend
│   ├── routes/                 # API route handlers
│   │   ├── auth.js             # Login, signup, password reset
│   │   ├── projects.js         # Project CRUD and member management
│   │   ├── tasks.js            # Task management
│   │   ├── users.js            # User data endpoints
│   │   └── admin.js            # Admin analytics
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   └── errorHandler.js     # Global error handling
│   ├── db.js                   # Database connection pool
│   ├── demoStore.js            # In-memory demo data store
│   ├── server.js               # Express app setup
│   └── package.json
│
├── run-dev.js                  # Development server launcher
├── README.txt                  # This file
└── .gitignore                  # Git ignore configuration

================================================================================
API ENDPOINTS REFERENCE
================================================================================

AUTHENTICATION ENDPOINTS:
POST /api/auth/signup
  • Body: {email, password, name}
  • Returns: {token, user}

POST /api/auth/login
  • Body: {email, password}
  • Returns: {token, user}

POST /api/auth/forgot-password
  • Body: {email}
  • Returns: {message, resetLink} (demo mode shows link)

POST /api/auth/reset-password
  • Body: {token, password}
  • Returns: {message}

PROJECT ENDPOINTS:
GET /api/projects
  • Returns: {projects: []}
  • Get all projects for authenticated user

POST /api/projects
  • Body: {name, description}
  • Returns: {project}
  • Create new project

GET /api/projects/:projectId
  • Returns: {project, members}
  • Get project details and members

GET /api/projects/:projectId/stats
  • Returns: {stats}
  • Get task statistics for project

POST /api/projects/:projectId/members
  • Body: {email, role}
  • Returns: {message}
  • Add member to project

DELETE /api/projects/:projectId/members/:memberId
  • Returns: {message}
  • Remove member from project

TASK ENDPOINTS:
GET /api/tasks
  • Returns: {tasks: []}
  • Get all tasks for user's projects

GET /api/tasks/project/:projectId
  • Returns: {tasks: []}
  • Get tasks for specific project

POST /api/tasks
  • Body: {title, description, projectId, assignedTo, priority, dueDate}
  • Returns: {task}
  • Create new task

PUT /api/tasks/:taskId
  • Body: {status, priority, assignedTo, ...}
  • Returns: {task}
  • Update task

DELETE /api/tasks/:taskId
  • Returns: {message}
  • Delete task

GET /api/tasks/dashboard/my-tasks
  • Returns: {tasks: [], overdue_count}
  • Get member's assigned tasks

USER ENDPOINTS:
GET /api/users
  • Returns: {users: []}
  • Get all users (for member assignment)

GET /api/users/me
  • Returns: {user}
  • Get current authenticated user

ADMIN ENDPOINTS:
GET /api/admin/overview
  • Returns: {summary, team_performance, recent_activity}
  • Get admin dashboard data

GET /api/admin/members
  • Returns: {members: []}
  • Get all team members with stats

================================================================================
FEATURES IMPLEMENTED
================================================================================

CORE FEATURES:
✓ User Registration (Signup)
✓ User Login with Server-Side Sessions
✓ Password Reset via Email (demo mode shows link)
✓ Role-Based Access Control (Admin/Member)
✓ Project Management (CRUD)
✓ Task Management (CRUD)
✓ Team Member Assignment to Projects
✓ Task Assignment to Members
✓ Task Status Tracking (To Do, In Progress, Done)
✓ Priority Levels (Low, Medium, High)
✓ Due Date Management
✓ Overdue Task Detection

ADMIN FEATURES:
✓ Admin Dashboard with Analytics
✓ Team Performance Table
✓ Clickable Member Rows
✓ Member Detail Modal with Task Management:
  ✓ View member's active tasks (To Do & In Progress)
  ✓ Create tasks directly for member
  ✓ Change task status for member
  ✓ Delete tasks for member
  ✓ Remove member from projects
✓ Project Management Section
✓ Add member to projects
✓ Recent Activity Feed

MEMBER FEATURES:
✓ Member Dashboard
✓ View Assigned Tasks
✓ View Project List
✓ View Project Details
✓ Update Task Status
✓ Create New Tasks in Projects
✓ Add Members to Projects
✓ View Task Statistics

UI/UX FEATURES:
✓ Responsive Design (Mobile, Tablet, Desktop)
✓ Tailwind CSS Styling
✓ Tab-Based Authentication (Login/Signup)
✓ Password Visibility Toggle
✓ Confirm Password Field on Signup
✓ Modal Dialogs for Actions
✓ Loading States
✓ Error Handling
✓ Status Badges with Color Coding
✓ Dropdown Selectors for Task Management

TECHNICAL FEATURES:
✓ React 18 with Hooks
✓ Vite Build Tool
✓ Express.js REST API
✓ PostgreSQL Database (optional)
✓ Demo Mode with In-Memory Storage
✓ Graceful Fallback when Database Unavailable
✓ CORS Handling
✓ Error Middleware
✓ Input Validation
✓ Secure Password Hashing
✓ Session Token Management

================================================================================
TROUBLESHOOTING
================================================================================

ISSUE: Port already in use
SOLUTION:
  • Kill the process using the port: taskkill /PID <pid> /F
  • Or use a different port by modifying the port in backend/server.js

ISSUE: "Cannot find module" errors
SOLUTION:
  • Run: npm install in root, frontend/, and backend/ directories
  • Delete node_modules folders and reinstall

ISSUE: Vite takes long time to start
SOLUTION:
  • This is normal on first run
  • Vite caches files for faster builds on subsequent runs
  • Wait 2-3 minutes for initial build

ISSUE: Database connection refused
SOLUTION:
  • Ensure PostgreSQL service is running
  • Check database credentials in .env file
  • Verify PostgreSQL is listening on localhost:5432
  • Application will automatically use demo mode if DB is unavailable

ISSUE: Login not working
SOLUTION:
  • Make sure you're using correct demo credentials
  • Check that backend server is running (port 5000)
  • Clear browser cache and localStorage
  • Try in incognito/private mode

ISSUE: Tasks not persisting
SOLUTION:
  • In demo mode, data is lost when server restarts (expected)
  • To persist data, set up PostgreSQL database
  • Or note down important data before restarting

ISSUE: "Identifier already declared" error
SOLUTION:
  • This has been fixed in the latest version
  • Run: git pull to get latest code
  • Restart the development server

================================================================================
DEVELOPMENT TIPS
================================================================================

HOW TO ADD A NEW MEMBER:
1. Click "Sign Up" on login page
2. Enter email (example: user@company.com)
3. Enter password (must meet requirements)
4. Enter name
5. New user account is created
6. Login with new account to access dashboard

HOW TO CREATE A PROJECT:
1. As admin or member: Navigate to dashboard
2. Look for "Create Project" option (Member) or use API
3. Enter project name and description
4. Project is created and you become member

HOW TO ASSIGN TASK TO MEMBER:
1. As admin: Click on member in Team Performance table
2. Click "Add Task" button in member detail modal
3. Select project from dropdown
4. Enter task details (title, description, priority, due date)
5. Click "Create Task"
6. Task is assigned to member and appears in their task list

HOW TO CHANGE TASK STATUS:
1. View the task in project or task list
2. Click status dropdown (To Do, In Progress, Done)
3. Select new status
4. Status updates immediately

HOW TO VIEW TASK STATISTICS:
1. As admin: View admin dashboard summary cards
2. As member: View dashboard cards and project stats
3. Click on projects to see detailed task breakdown

================================================================================
SUPPORT & FEEDBACK
================================================================================

For issues, questions, or feature requests, please contact:
• Project Repository: https://github.com/3723011073/team-task-manager
• Report Issues: Create a GitHub issue with description and steps to reproduce

================================================================================
LICENSE
================================================================================

This project is provided as-is for educational and professional use.

================================================================================
VERSION HISTORY
================================================================================

Version 1.0.0 (May 11, 2026) - CURRENT
• Initial release
• Core features implemented
• Admin member management UI
• Server-side session authentication
• Demo mode with in-memory storage
• Comprehensive admin portal
• Member dashboard and project views
• Fully tested and production-ready

================================================================================
END OF README
================================================================================