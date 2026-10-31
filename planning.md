
# Kanban Task Board — Project Planning

## 1. Project Overview

**Goal:** Build a responsive, full-stack Kanban task management application.

**Estimated Time:** 6–12 hours

### Tech Stack
- Frontend: React + JavaScript (Vite)
- Styling: CSS
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Drag and Drop: dnd-kit
- Version Control: Git + GitHub
- Deployment: TBD

## 2. MVP Features

### Required
- [ ] User authentication (sign up, login, logout)
- [ ] Display tasks in Kanban columns
- [ ] Create tasks
- [ ] Edit tasks
- [ ] Delete tasks
- [ ] Drag and drop tasks between columns
- [ ] Save changes to Supabase
- [ ] Restrict tasks to their owners

### Bonus
- [ ] Mobile-friendly responsive design
- [ ] Task priorities
- [ ] Due dates
- [ ] Search and filtering

## 3. UI Design

**Inspiration:** Linear and Asana

### Layout
- Header with app name and user controls
- Three Kanban columns:
  - To Do
  - In Progress
  - Done
- Task cards
- Create/edit task modal

### Design Goals
- Clean, modern appearance
- Intuitive interactions
- Consistent colors and spacing
- Responsive layout

### Wireframe
Location: `docs/wireframe.png`

## 4. Database Design

### Tasks Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Task owner |
| title | TEXT | Task title |
| description | TEXT | Task details |
| status | TEXT | todo, in_progress, done |
| priority | TEXT | Optional priority |
| position | INTEGER | Ordering within column |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

### Security
- Enable Row Level Security (RLS)
- Users can only access their own tasks
- Never expose secret or service-role keys

## 5. Application Architecture

### React Components
- App
- Auth
- Board
- Column
- TaskCard
- TaskForm

### Data Flow
1. User logs in through Supabase Auth.
2. App fetches tasks from Supabase.
3. React displays tasks in columns.
4. User creates, edits, deletes, or moves tasks.
5. Changes are saved to Supabase.
6. UI reflects the updated data.

## 6. Development Plan

### Phase 1 — Setup
- [ ] Initialize React with Vite
- [ ] Install dependencies
- [ ] Configure Supabase
- [ ] Create project structure

### Phase 2 — Database & Authentication
- [ ] Create tasks table
- [ ] Configure RLS policies
- [ ] Implement authentication
- [ ] Test database connection

### Phase 3 — Core Functionality
- [ ] Build Kanban board layout
- [ ] Display tasks
- [ ] Create tasks
- [ ] Edit tasks
- [ ] Delete tasks
- [ ] Connect CRUD operations to Supabase

### Phase 4 — Drag and Drop
- [ ] Implement drag-and-drop functionality
- [ ] Update task status after moving
- [ ] Save task positions
- [ ] Verify changes persist after refresh

### Phase 5 — Polish
- [ ] Improve visual design
- [ ] Add responsive styling
- [ ] Add loading and error states
- [ ] Test application
- [ ] Fix bugs
- [ ] Update README

## 7. Testing Checklist

- [ ] Sign up works
- [ ] Login works
- [ ] Logout works
- [ ] Tasks can be created
- [ ] Tasks can be edited
- [ ] Tasks can be deleted
- [ ] Tasks can be dragged between columns
- [ ] Changes persist after refresh
- [ ] Users cannot access other users' tasks
- [ ] Mobile layout works
- [ ] No console errors

## 8. Technical Decisions

| Decision | Reason |
|----------|--------|
| React + JavaScript | Learn React using familiar JavaScript |
| Supabase | Managed database and authentication |
| No separate backend API | Reduce complexity |
| CSS | Familiar styling technology |

## 9. Development Notes

### Challenges
-

### Solutions
-

### Lessons Learned
-

## 10. Future Improvements

- [ ] Multiple boards
- [ ] Task labels
- [ ] Collaboration
- [ ] Real-time updates
- [ ] Dark mode
- [ ] Improved mobile interactions
