-- =====================================================
-- Kanban Task Board: Initial Database Migration
-- =====================================================

-- 1. Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL
        CHECK (length(trim(title)) > 0),

    status TEXT NOT NULL DEFAULT 'todo'
        CHECK (status IN (
            'todo',
            'in_progress',
            'in_review',
            'done'
        )),

    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Optional task details
    description TEXT,

    priority TEXT NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high')),

    due_date DATE,

    -- Frontend appearance and drag-and-drop ordering
    color TEXT NOT NULL DEFAULT 'blue',
    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0)
);

-- 2. Create index for user-specific task queries
CREATE INDEX idx_tasks_user_id
ON public.tasks(user_id);

-- 3. Create index for ordered Kanban columns
CREATE INDEX idx_tasks_user_status_position
ON public.tasks(user_id, status, position);

-- =====================================================
-- Row Level Security
-- =====================================================

-- 4. Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 5. SELECT: Users can only read their own tasks
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id
);

-- 6. INSERT: Users can only create their own tasks
CREATE POLICY "Users can create their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
    (SELECT auth.uid()) = user_id
);

-- 7. UPDATE: Users can only update their own tasks
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
    (SELECT auth.uid()) = user_id
)
WITH CHECK (
    (SELECT auth.uid()) = user_id
);

-- 8. DELETE: Users can only delete their own tasks
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (
    (SELECT auth.uid()) = user_id
);
