# 💾 Team Task Manager - Database Schema Reference

Complete database design with relationships, constraints, and explanations.

---

## 🏗️ Database Architecture

### Schema Overview
```
┌─────────────────────────────────────────────────────────┐
│                    USERS TABLE                           │
│  - Stores all user accounts                             │
│  - Password hashed with Node's crypto (scrypt)          │
│  - Role-based access control                            │
└─────────────────────────────────────────────────────────┘
            │
            ├──→ PROJECTS (1:M)
            │    - Projects owned by users
            │
            ├──→ PROJECT_MEMBERS (1:M)
            │    - Team membership
            │
            ├──→ TASKS (1:M)
            │    - Created by user
            │    - Assigned to user
            │
            └──→ TASK_COMMENTS (1:M)
                 - Comments by user
```

---

## 📊 Table Definitions

### 1. USERS Table
Stores user account information

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email (used for login) |
| password | VARCHAR(255) | NOT NULL | Hashed password (crypto.scrypt) |
| name | VARCHAR(255) | NOT NULL | User's full name |
| role | VARCHAR(50) | DEFAULT 'member' | admin or member |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
```sql
CREATE INDEX idx_users_email ON users(email);
```

---

### 2. PROJECTS Table
Stores project information

```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique project ID |
| name | VARCHAR(255) | NOT NULL | Project name |
| description | TEXT | nullable | Project description |
| owner_id | INTEGER | FK → users.id | Project creator |
| status | VARCHAR(50) | DEFAULT 'active' | active, archived, closed |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Foreign Key:**
- `owner_id` → `users.id` (ON DELETE CASCADE)

**Indexes:**
```sql
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
```

---

### 3. PROJECT_MEMBERS Table
Manages team membership

```sql
CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);
```

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique record ID |
| project_id | INTEGER | FK → projects.id | Project reference |
| user_id | INTEGER | FK → users.id | User reference |
| role | VARCHAR(50) | DEFAULT 'member' | admin or member |
| joined_at | TIMESTAMP | DEFAULT NOW() | Join date |

**Unique Constraint:**
```sql
UNIQUE(project_id, user_id)
-- Prevents duplicate memberships
```

**Foreign Keys:**
- `project_id` → `projects.id` (ON DELETE CASCADE)
- `user_id` → `users.id` (ON DELETE CASCADE)

**Indexes:**
```sql
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
```

---

### 4. TASKS Table
Stores task information

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    due_date DATE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique task ID |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | nullable | Task details |
| project_id | INTEGER | FK → projects.id | Parent project |
| assigned_to | INTEGER | FK → users.id, nullable | Assigned user |
| status | VARCHAR(50) | DEFAULT 'todo' | todo, in_progress, done |
| priority | VARCHAR(50) | DEFAULT 'medium' | low, medium, high |
| due_date | DATE | nullable | Task deadline |
| created_by | INTEGER | FK → users.id | Task creator |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Foreign Keys:**
- `project_id` → `projects.id` (ON DELETE CASCADE)
- `assigned_to` → `users.id` (ON DELETE SET NULL)
- `created_by` → `users.id`

**Indexes:**
```sql
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

---

### 5. TASK_COMMENTS Table
Stores task discussion threads

```sql
CREATE TABLE task_comments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique comment ID |
| task_id | INTEGER | FK → tasks.id | Task reference |
| user_id | INTEGER | FK → users.id | Comment author |
| comment | TEXT | NOT NULL | Comment content |
| created_at | TIMESTAMP | DEFAULT NOW() | Comment timestamp |

**Foreign Keys:**
- `task_id` → `tasks.id` (ON DELETE CASCADE)
- `user_id` → `users.id`

**Indexes:**
```sql
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);
```

---

## 🔗 Relationships

### One-to-Many (1:M) Relationships

**Users → Projects**
```
One user can own many projects
SELECT * FROM projects WHERE owner_id = 1;
```

**Users → Tasks (assigned)**
```
One user can have many tasks assigned
SELECT * FROM tasks WHERE assigned_to = 1;
```

**Users → Tasks (created)**
```
One user can create many tasks
SELECT * FROM tasks WHERE created_by = 1;
```

**Projects → Tasks**
```
One project can have many tasks
SELECT * FROM tasks WHERE project_id = 1;
```

**Tasks → Comments**
```
One task can have many comments
SELECT * FROM task_comments WHERE task_id = 1;
```

### Many-to-Many (M:M) Relationships

**Users ↔ Projects (through PROJECT_MEMBERS)**
```
One user can be member of many projects
One project can have many users as members

SELECT * FROM project_members WHERE user_id = 1;
SELECT * FROM project_members WHERE project_id = 1;
```

---

## 🔍 Example Queries

### Get User's Projects
```sql
SELECT p.* FROM projects p
JOIN project_members pm ON p.id = pm.project_id
WHERE pm.user_id = 1;
```

### Get Project Team Members
```sql
SELECT u.id, u.name, u.email, pm.role
FROM users u
JOIN project_members pm ON u.id = pm.user_id
WHERE pm.project_id = 1;
```

### Get Tasks for a Project
```sql
SELECT t.*, u.name as assigned_to_name
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.project_id = 1;
```

### Get User's Assigned Tasks
```sql
SELECT t.*, p.name as project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
WHERE t.assigned_to = 1;
```

### Get Task Statistics
```sql
SELECT 
    COUNT(*) as total_tasks,
    SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
    SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
    SUM(CASE WHEN due_date < CURRENT_DATE AND status != 'done' THEN 1 ELSE 0 END) as overdue
FROM tasks
WHERE project_id = 1;
```

### Get Team Performance
```sql
SELECT 
    u.name,
    COUNT(t.id) as total_assigned,
    SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(t.id), 0) * 100, 2) as completion_rate
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to AND t.project_id = 1
JOIN project_members pm ON u.id = pm.user_id AND pm.project_id = 1
GROUP BY u.id, u.name;
```

### Search Tasks
```sql
SELECT * FROM tasks
WHERE project_id = 1
AND (title ILIKE '%search_term%' OR description ILIKE '%search_term%')
AND status = 'todo'
ORDER BY due_date ASC;
```

### Get Task Comments with Authors
```sql
SELECT tc.*, u.name, u.email
FROM task_comments tc
JOIN users u ON tc.user_id = u.id
WHERE tc.task_id = 1
ORDER BY tc.created_at DESC;
```

---

## 🔐 Integrity Constraints

### Primary Keys
- Every table has unique `id` field
- Ensures record uniqueness

### Foreign Keys
- Maintain referential integrity
- ON DELETE CASCADE: Auto-delete related records
- ON DELETE SET NULL: Clear reference on delete

### Unique Constraints
- `users.email` - No duplicate emails
- `project_members(project_id, user_id)` - No duplicate memberships

### NOT NULL Constraints
- Ensure critical fields always have values
- title, description, priority required

---

## 📈 Performance Optimization

### Indexes Created
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Project queries
CREATE INDEX idx_projects_owner_id ON projects(owner_id);

-- Team membership queries
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- Task queries
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Comment queries
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);
```

### Why These Indexes?
- **email**: Fast user lookup for login
- **owner_id**: Get projects owned by user
- **project_members.project_id**: List team members
- **project_members.user_id**: Get user's projects
- **tasks.project_id**: Get project tasks
- **tasks.assigned_to**: Get user's tasks
- **tasks.status**: Filter by status
- **tasks.due_date**: Sort by deadline
- **task_comments**: Get task discussions

---

## 🗑️ Cascade Behaviors

### ON DELETE CASCADE
When a parent record is deleted, all child records are deleted:

```
Delete user → Delete all projects owned by user
           → Delete all tasks created by user
           → Delete user's memberships
           → Delete user's comments

Delete project → Delete all tasks in project
              → Delete all team memberships
              → Delete all comments on tasks

Delete task → Delete all comments on task
```

### ON DELETE SET NULL
When a parent is deleted, set reference to NULL:

```
Delete assigned user → Set task.assigned_to = NULL
                    (Task remains, but unassigned)
```

---

## 🔄 Data Flow Example

### Complete Task Lifecycle
```
1. Create User A
   → user.id = 1

2. Create Project
   → project.id = 1, owner_id = 1

3. Add User B to Project
   → project_members: (project_id=1, user_id=2, role='member')

4. Create Task in Project
   → task.id = 1, project_id = 1, created_by = 1, assigned_to = 2

5. Add Comment to Task
   → task_comment.id = 1, task_id = 1, user_id = 2

6. Update Task Status
   → task.status = 'done', task.updated_at = NOW()

7. Query Task with All Data
   SELECT t.*, u.name assigned_to_name, c.name created_by_name,
          COUNT(tc.id) as comment_count
   FROM tasks t
   LEFT JOIN users u ON t.assigned_to = u.id
   LEFT JOIN users c ON t.created_by = c.id
   LEFT JOIN task_comments tc ON t.id = tc.task_id
   WHERE t.id = 1
   GROUP BY t.id;
```

---

## ✅ Database Initialization

The database is automatically initialized when the backend starts:

```javascript
// File: backend/db.js
export async function initializeDatabase() {
    // Creates all tables if they don't exist
    // Creates all indexes
    // Tests connection
}
```

**When running backend:**
```bash
npm run dev
# Output:
# ✓ Database connected: 2024-05-11 10:30:45.123
# ✓ Database tables initialized
# ✓ Server running on port 5000
```

---

## 🚀 Scaling Considerations

### Current Design Handles
- ✅ Thousands of users
- ✅ Hundreds of projects
- ✅ Millions of tasks
- ✅ Complex queries with joins

### Future Optimizations
- Partitioning by date for old tasks
- Archive old projects
- Read replicas for analytics
- Caching layer (Redis)
- Full-text search index on tasks

---

## 📚 Related Files

- **Backend DB**: `/backend/db.js`
- **Authentication**: `/backend/middleware/auth.js`
- **Project Routes**: `/backend/routes/projects.js`
- **Task Routes**: `/backend/routes/tasks.js`
- **Analytics Routes**: `/backend/routes/analytics.js`

---

**Next:** Check [04_API_REFERENCE.md](04_API_REFERENCE.md) for API endpoints!
