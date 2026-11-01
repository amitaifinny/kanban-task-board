
# Flowboard

A modern, responsive Kanban task management application built with React and Supabase.

Flowboard helps users organize their work, manage priorities, and track progress through an interactive task board.

**Live Demo:** [Flowboard](https://flowboard-gamma-pied.vercel.app/)

## Features

- Create, edit, and delete tasks
- Drag and drop tasks between workflow columns
- Four workflow stages: To Do, In Progress, In Review, and Done
- Task priorities and due dates
- Search and priority filtering
- Visual indicators for upcoming and overdue tasks
- Board statistics for total, completed, and overdue tasks
- Automatic guest authentication
- Persistent task storage with user-specific access
- Responsive design for desktop and mobile
- Loading states and error handling

## Tech Stack

- **Frontend:** React, JavaScript, Vite
- **Styling:** CSS
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth (anonymous sign-in)
- **Hosting:** Vercel
- **Version Control:** Git and GitHub

## Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/amitaifinny/kanban-task-board.git
   cd kanban-board-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. Configure Supabase:
   - Enable anonymous sign-ins under Authentication.
   - Run the SQL scripts in `supabase/migrations/` using the Supabase SQL Editor.
   - Ensure the `tasks` table is accessible through the Data API to authenticated users.
   - Verify that Row Level Security (RLS) is enabled and ownership policies are configured.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL provided by Vite.

## Security

Flowboard uses Supabase anonymous authentication to create guest sessions automatically.

Each task is associated with the guest user's unique ID. PostgreSQL Row Level Security policies restrict access so users can only view and modify their own tasks.

## Development

Run the linter:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Future Improvements

- Permanent user accounts and cross-device access
- Team collaboration and task assignments
- Custom labels and task comments
- Additional automated testing
