# 📡 Team Task Manager - Complete API Reference

All available REST API endpoints with detailed documentation.

---

## 🔐 Authentication Endpoints

### POST /api/auth/signup
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "member"
  }
}
```

**Errors:**
- `400` - Email/password/name missing
- `409` - Email already registered

---

### POST /api/auth/login
Login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "member"
  }
}
```

**Errors:**
- `400` - Email/password missing
- `401` - Invalid credentials

---

## 👥 User Endpoints

All user endpoints require authentication: `Authorization: Bearer {token}`

### GET /api/users/me
Get current authenticated user

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "member",
    "created_at": "2024-05-11T10:00:00Z"
  }
}
```

---

### GET /api/users
Get all users (for project assignment)

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "member"
    },
    {
      "id": 2,
      "email": "jane@example.com",
      "name": "Jane Smith",
      "role": "member"
    }
  ]
}
```

---

## 📁 Project Endpoints

### POST /api/projects
Create a new project

**Request:**
```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of company website"
}
```

**Response:** `201 Created`
```json
{
  "message": "Project created",
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "owner_id": 1,
    "status": "active",
    "created_at": "2024-05-11T10:00:00Z"
  }
}
```

---

### GET /api/projects
Get all projects for current user

**Response:** `200 OK`
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Complete redesign...",
      "owner_id": 1,
      "status": "active",
      "created_at": "2024-05-11T10:00:00Z"
    }
  ]
}
```

---

### GET /api/projects/:projectId
Get project details with team members

**Response:** `200 OK`
```json
{
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "...",
    "owner_id": 1,
    "status": "active"
  },
  "members": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "member"
    }
  ]
}
```

**Errors:**
- `403` - Not a project member
- `404` - Project not found

---

### PUT /api/projects/:projectId
Update project (admin only)

**Request:**
```json
{
  "name": "Website Redesign v2",
  "description": "Updated description",
  "status": "active"
}
```

**Response:** `200 OK`
```json
{
  "message": "Project updated",
  "project": { /* updated project */ }
}
```

**Errors:**
- `403` - Not admin
- `404` - Project not found

---

### POST /api/projects/:projectId/members
Add team member to project (admin only)

**Request:**
```json
{
  "email": "newmember@example.com",
  "role": "member"
}
```

**Response:** `201 Created`
```json
{
  "message": "Member added to project",
  "member": {
    "id": 1,
    "project_id": 1,
    "user_id": 3,
    "role": "member",
    "joined_at": "2024-05-11T10:00:00Z"
  }
}
```

**Errors:**
- `403` - Not admin
- `404` - User not found

---

### GET /api/projects/:projectId/stats
Get project statistics

**Response:** `200 OK`
```json
{
  "stats": {
    "total_tasks": 25,
    "todo_count": 10,
    "in_progress_count": 8,
    "done_count": 7,
    "overdue_count": 1
  }
}
```

---

## 📝 Task Endpoints

### POST /api/tasks
Create a new task

**Request:**
```json
{
  "title": "Design homepage",
  "description": "Create mockups and wireframes",
  "projectId": 1,
  "assignedTo": 2,
  "priority": "high",
  "dueDate": "2024-05-20"
}
```

**Response:** `201 Created`
```json
{
  "message": "Task created",
  "task": {
    "id": 1,
    "title": "Design homepage",
    "description": "Create mockups...",
    "project_id": 1,
    "assigned_to": 2,
    "status": "todo",
    "priority": "high",
    "due_date": "2024-05-20",
    "created_by": 1,
    "created_at": "2024-05-11T10:00:00Z"
  }
}
```

**Errors:**
- `400` - Missing title or projectId
- `403` - Not a project member

---

### GET /api/tasks/project/:projectId
Get project tasks with filters

**Query Parameters:**
- `status` - Filter by status (todo/in_progress/done)
- `assignedTo` - Filter by user ID

**Example:** `GET /api/tasks/project/1?status=todo&assignedTo=2`

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design homepage",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2024-05-20",
      "assigned_to": 2,
      "created_at": "2024-05-11T10:00:00Z"
    }
  ]
}
```

---

### PUT /api/tasks/:taskId
Update task

**Request:**
```json
{
  "title": "Design homepage - updated",
  "status": "in_progress",
  "priority": "medium",
  "assignedTo": 3,
  "dueDate": "2024-05-22"
}
```

**Response:** `200 OK`
```json
{
  "message": "Task updated",
  "task": { /* updated task */ }
}
```

---

### DELETE /api/tasks/:taskId
Delete task (admin only)

**Response:** `200 OK`
```json
{
  "message": "Task deleted"
}
```

**Errors:**
- `403` - Not admin
- `404` - Task not found

---

### GET /api/tasks/dashboard/my-tasks
Get all tasks assigned to current user

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design homepage",
      "status": "in_progress",
      "project_name": "Website Redesign",
      "assigned_to_name": "John Doe",
      "due_date": "2024-05-20",
      "priority": "high"
    }
  ],
  "overdue_count": 1
}
```

---

## 💬 Advanced Task Features

### POST /api/tasks-advanced/:taskId/comments
Add comment to task

**Request:**
```json
{
  "comment": "Ready for review, please check the design"
}
```

**Response:** `201 Created`
```json
{
  "message": "Comment added",
  "comment": {
    "id": 1,
    "task_id": 1,
    "user_id": 1,
    "comment": "Ready for review...",
    "created_at": "2024-05-11T10:00:00Z"
  }
}
```

---

### GET /api/tasks-advanced/:taskId/comments
Get task comments

**Response:** `200 OK`
```json
{
  "comments": [
    {
      "id": 1,
      "task_id": 1,
      "user_id": 1,
      "user_name": "John Doe",
      "email": "john@example.com",
      "comment": "Ready for review...",
      "created_at": "2024-05-11T10:00:00Z"
    }
  ]
}
```

---

### GET /api/tasks-advanced/search/query
Search tasks with filters

**Query Parameters:**
- `q` - Search query (required)
- `projectId` - Filter by project
- `status` - Filter by status
- `priority` - Filter by priority

**Example:** `GET /api/tasks-advanced/search/query?q=design&status=todo&priority=high`

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design homepage",
      "status": "todo",
      "priority": "high",
      "description": "Create design mockups"
    }
  ]
}
```

---

### GET /api/tasks-advanced/project/:projectId/activity
Get recent activity in project

**Response:** `200 OK`
```json
{
  "activity": [
    {
      "id": 1,
      "title": "Design homepage",
      "status": "done",
      "updated_at": "2024-05-11T15:00:00Z",
      "updated_by_name": "Jane Smith"
    }
  ]
}
```

---

## 📊 Analytics Endpoints

### GET /api/analytics/:projectId/analytics
Get comprehensive project analytics

**Response:** `200 OK`
```json
{
  "stats": {
    "total_tasks": 25,
    "todo_count": 10,
    "in_progress_count": 8,
    "done_count": 7,
    "overdue_count": 1,
    "high_priority_count": 5,
    "completion_percentage": 28.0
  },
  "team_performance": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "total_assigned": 10,
      "completed": 7,
      "in_progress": 2,
      "todo": 1,
      "overdue": 0
    }
  ],
  "timeline": [
    {
      "date": "2024-05-15",
      "total": 5,
      "completed": 3
    }
  ]
}
```

---

### GET /api/analytics/:projectId/team-stats
Get team overview statistics

**Response:** `200 OK`
```json
{
  "team_stats": {
    "total_members": 5,
    "admin_count": 1,
    "member_count": 4
  }
}
```

---

### GET /api/analytics/:projectId/export/csv
Export project tasks as CSV

**Response:** `200 OK` (with CSV file download)
```csv
ID,Title,Description,Status,Priority,Due Date,Assigned To,Created At
1,Design homepage,Create mockups,in_progress,high,2024-05-20,John Doe,2024-05-11T10:00:00Z
2,Setup database,Configure PostgreSQL,done,medium,,Jane Smith,2024-05-10T09:00:00Z
```

---

## 🔑 Authentication

All endpoints (except /auth/*) require authentication:

```
Header: Authorization: Bearer {token}
```

Where `{token}` is the session token received from login/signup (send as `Authorization: Bearer {token}`).

---

## ⏱️ Status Codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (invalid token) |
| `403` | Forbidden (no permission) |
| `404` | Not Found |
| `409` | Conflict (duplicate email) |
| `500` | Server Error |

---

## 🧪 Testing with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123",
    "name":"Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123"
  }'
```

### Create Project (with token)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"My Project",
    "description":"Project description"
  }'
```

---

## 📚 API Workflow Example

### Complete Flow:
```
1. POST /api/auth/signup
   ↓ (get token)
   
2. POST /api/projects
   ↓ (create project)
   
3. GET /api/users
   ↓ (get users to add)
   
4. POST /api/projects/:id/members
   ↓ (add member)
   
5. POST /api/tasks
   ↓ (create task)
   
6. PUT /api/tasks/:id
   ↓ (update status)
   
7. GET /api/analytics/:projectId/analytics
   ↓ (view analytics)
   
8. GET /api/analytics/:projectId/export/csv
   ↓ (export data)
```

---

## 🚀 Next Steps

- Test all endpoints using the cURL examples
- Use Postman for easier API testing
- Build frontend components to call these endpoints
- Add more advanced features as needed

---

**Happy API-ing! 🎉**
