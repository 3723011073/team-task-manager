# GitHub Setup Instructions

## 1. Install Git

### Windows
- Download from https://git-scm.com/download/win
- Run installer with default settings

### Mac
```bash
brew install git
```

### Linux
```bash
sudo apt-get install git
```

## 2. Configure Git Locally

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 3. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `team-task-manager`
3. Description: "Team Task Manager - Full Stack Project Management Application"
4. Choose "Public" (for job applications, showcasing)
5. Do NOT initialize with README (we have one)
6. Click "Create repository"

## 4. Push Code to GitHub

In your project root directory:

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Team Task Manager application

- Full-stack web application for project management
- Features: Authentication, Projects, Tasks, Dashboard
- Tech: React, Node.js, Express, PostgreSQL
- Ready for deployment"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## 5. Update README with Links

Edit README.md and add this section:

```markdown
## 🔗 Links

- **GitHub Repository**: https://github.com/YOUR_USERNAME/team-task-manager
- **Live Application**: https://your-frontend-url.vercel.app
- **Demo Video**: [Link to YouTube/Drive]

## 🚀 Getting Started

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for local setup instructions.
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment on Railway.
```

## 6. Create Releases

After deploying, create a GitHub release:

1. Go to your repository
2. Click "Releases" on the right
3. Click "Create a new release"
4. Tag version: `v1.0.0`
5. Release title: "Team Task Manager v1.0.0 - Initial Release"
6. Description:
```markdown
# Team Task Manager v1.0.0

Initial release of the Team Task Manager application.

## Features
- ✅ User authentication with server-side session tokens
- ✅ Project management
- ✅ Task creation and tracking
- ✅ Role-based access control
- ✅ Team collaboration
- ✅ Dashboard with statistics

## Deployment
- Backend: Railway (https://your-backend-url.railway.app)
- Frontend: Vercel (https://your-frontend-url.vercel.app)
- Database: PostgreSQL

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: Server-side session tokens

## Documentation
- [Setup Guide](SETUP_GUIDE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)

## Demo
[Watch demo on YouTube](your-youtube-link)
```

7. Click "Publish release"

## 7. Add GitHub Topics

1. Go to repository settings
2. Scroll to "Code repository settings"
3. In "Topics" add: `full-stack`, `react`, `nodejs`, `project-management`, `task-management`, `postgresql`

## 8. Update GitHub Profile

Add link to this project on your GitHub profile:
1. Edit profile bio
2. Add: "Check out my Team Task Manager project! 👇"
3. Pin the repository to your profile

## Repository Best Practices

### .gitignore (already created)
The project already has .gitignore to exclude:
- node_modules/
- .env files
- build artifacts
- IDE settings

### Commit Messages

Format for clean history:
```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Dependencies, config

Examples:
```bash
git commit -m "feat: add task priority levels"
git commit -m "fix: correct CORS headers in API"
git commit -m "docs: add deployment guide"
```

## 9. Branching Strategy (Optional for Jobs)

```bash
# Create feature branch
git checkout -b feature/task-comments

# Make changes
git add .
git commit -m "feat: add task comments"

# Push to GitHub
git push origin feature/task-comments

# Create Pull Request on GitHub
# Then merge to main
```

## 10. GitHub Actions (Optional CI/CD)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install backend dependencies
        run: cd backend && npm install
      - name: Install frontend dependencies
        run: cd frontend && npm install
      - name: Lint frontend
        run: cd frontend && npm run build
```

## Repository Statistics You'll Have

After setup:
- Commits: ~1-5 (depending on your approach)
- Files: ~50+
- Languages: JavaScript (primary)
- Stars: Track yourself
- Forks: May be forked by others

## For Job Interviews

**What to mention**:
- Full-stack application showing end-to-end capability
- Proper authentication and authorization
- Database design and relationships
- API design following REST principles
- Professional UI with Tailwind CSS
- Deployment knowledge (Railway)
- Version control (Git/GitHub)

**Repository URL** to share:
```
https://github.com/YOUR_USERNAME/team-task-manager
```

---

**Remember**: Keep repository clean, documentation clear, and code well-commented!
