import { supabase } from './supabase';

const priorityToDatabase = { High: 'high', Medium: 'normal', Low: 'low' };
const priorityFromDatabase = { high: 'High', normal: 'Medium', low: 'Low' };

function toPostgresDate(value) {
  if (!value || value === 'No date') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(`${value} ${new Date().getFullYear()}`);
  if (Number.isNaN(parsed.getTime())) return null;

  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
}

function fromPostgresDate(value) {
  if (!value) return 'No date';
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? 'No date' : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(parsed);
}

export function taskFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    priority: priorityFromDatabase[row.priority] || 'Medium',
    due: fromPostgresDate(row.due_date),
    dueDate: row.due_date || null,
    status: row.status,
    color: row.color || 'blue',
    position: row.position,
  };
}

function parseDateOnly(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getDueDateState(dueDate, status) {
  if (!dueDate || status === 'done') return 'normal';
  const due = parseDateOnly(dueDate);
  if (!due) return 'normal';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilDue = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 2) return 'soon';
  return 'normal';
}

function taskPayload(task, userId, position) {
  return {
    title: task.title.trim(),
    description: task.description?.trim() || null,
    priority: priorityToDatabase[task.priority] || 'normal',
    due_date: toPostgresDate(task.due),
    status: task.status,
    color: task.color || 'blue',
    position,
    user_id: userId,
  };
}

export async function fetchTasks(userId) {
  const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId).order('status').order('position');
  if (error) throw error;
  return data.map(taskFromRow);
}

export async function createTask(task, userId, position) {
  const { data, error } = await supabase.from('tasks').insert(taskPayload(task, userId, position)).select().single();
  if (error) throw error;
  return taskFromRow(data);
}

export async function updateTask(task, userId, position = task.position || 0) {
  const { data, error } = await supabase.from('tasks').update(taskPayload(task, userId, position)).eq('id', task.id).eq('user_id', userId).select().single();
  if (error) throw error;
  return taskFromRow(data);
}

export async function removeTask(taskId, userId) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', userId);
  if (error) throw error;
}
