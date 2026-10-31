import { useEffect, useMemo, useState } from 'react';
import Board from './components/Board.jsx';
import './App.css';

const STORAGE_KEY = 'flowboard-priority-projects';
const seedTasks = [
  { id: 1, title: 'Create login page', description: 'Build a simple, welcoming sign-in experience.', priority: 'High', due: 'Aug 15', status: 'todo', color: 'coral' },
  { id: 2, title: 'Define project scope', description: 'Align on goals, milestones, and what success looks like.', priority: 'Medium', due: 'Aug 16', status: 'todo', color: 'mint' },
  { id: 3, title: 'Design task cards', description: 'Explore the information hierarchy for each card.', priority: 'High', due: 'Aug 18', status: 'todo', color: 'violet' },
  { id: 4, title: 'Build board layout', description: 'Turn the wireframe into a flexible responsive layout.', priority: 'High', due: 'Aug 20', status: 'in_progress', color: 'blue' },
  { id: 5, title: 'Set up Supabase', description: 'Create the tasks table and add row-level security.', priority: 'Medium', due: 'Aug 22', status: 'in_progress', color: 'orange' },
  { id: 6, title: 'Connect empty states', description: 'Make each status feel useful even before it has cards.', priority: 'Low', due: 'Aug 24', status: 'in_review', color: 'pink' },
  { id: 7, title: 'Initialize GitHub', description: 'Create the repository and add the first project notes.', priority: 'Low', due: 'Aug 12', status: 'done', color: 'green' },
  { id: 8, title: 'Choose visual direction', description: 'Lock the colors, type scale, and spacing system.', priority: 'Medium', due: 'Aug 14', status: 'done', color: 'yellow' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');

  function loadBoard() { setIsLoading(true); setLoadError(''); window.setTimeout(() => { try { const saved = window.localStorage.getItem(STORAGE_KEY); setTasks(saved ? JSON.parse(saved) : seedTasks); } catch { setLoadError('We could not load this board from your browser. Your local data may be unavailable.'); } finally { setIsLoading(false); } }, 420); }
  useEffect(() => { const timer = window.setTimeout(loadBoard, 0); return () => window.clearTimeout(timer); }, []);
  function persistTasks(nextTasks) { setTasks(nextTasks); setIsSaving(true); setSaveError(''); window.setTimeout(() => { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks)); } catch { setSaveError('Your changes are visible, but could not be saved locally.'); } finally { setIsSaving(false); } }, 280); }
  function moveTask(taskId, status) { persistTasks(tasks.map((task) => task.id === taskId ? { ...task, status } : task)); }
  function deleteTask(taskId) { persistTasks(tasks.filter((task) => task.id !== taskId)); }
  function openAdd(status = 'todo') { setEditingTask(null); setNewTaskStatus(status); setIsModalOpen(true); }
  function openEdit(task) { setEditingTask(task); setNewTaskStatus(task.status); setIsModalOpen(true); }
  function submitTask(event) { event.preventDefault(); const form = new FormData(event.currentTarget); const title = form.get('title').trim(); if (!title) return; const details = { title, description: form.get('description').trim() || 'A new task ready to be picked up.', priority: form.get('priority'), due: form.get('due') || 'No date', status: newTaskStatus }; if (editingTask) persistTasks(tasks.map((task) => task.id === editingTask.id ? { ...task, ...details } : task)); else persistTasks([...tasks, { id: Date.now(), ...details, color: ['coral', 'blue', 'mint', 'violet'][tasks.length % 4] }]); setIsModalOpen(false); setEditingTask(null); }

  const visibleTasks = useMemo(() => tasks.filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase()) && (priority === 'All' || task.priority === priority)), [tasks, search, priority]);
  const hasFilters = Boolean(search || priority !== 'All');
  if (isLoading) return <div className="loading-screen" role="status" aria-live="polite"><div className="loading-brand"><span className="brand-mark">◆</span> Flowboard</div><div className="loading-copy"><span className="spinner" /><strong>Loading your workspace</strong><span>Fetching your latest tasks...</span></div><div className="skeleton-board"><div /><div /><div /><div /></div></div>;
  if (loadError) return <div className="state-screen" role="alert"><div className="state-icon error-icon">!</div><div className="state-label">BOARD LOAD ERROR</div><h1>Couldn’t open this board</h1><p>{loadError}</p><button className="primary-button" onClick={loadBoard}>Try again</button><span className="state-hint">If this keeps happening, refresh the page or check your browser storage.</span></div>;

  return <div className="app-shell"><main className="workspace"><section className="page-heading"><div><div className="eyebrow">PRODUCT TEAM BOARD</div><h1>Priority Projects</h1><p className="subtitle">A shared view of what the team is shaping next.</p></div><button className="primary-button" onClick={() => openAdd()}><span>+</span> Add task</button></section>{saveError && <div className="save-alert" role="alert"><span>!</span>{saveError}<button onClick={() => setSaveError('')}>Dismiss</button></div>}<section className="toolbar" aria-label="Board tools"><label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." /></label><div className="toolbar-right"><span className={`sync-state ${isSaving ? 'is-saving' : 'is-saved'}`} role="status" aria-live="polite">{isSaving ? <><span className="mini-spinner" /> Saving changes...</> : <><span className="saved-dot" /> Saved just now</>}</span><span className="task-count">{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}</span><select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Filter by priority"><option>All</option><option>High</option><option>Medium</option><option>Low</option></select><button className="filter-button">☷ Filter</button></div></section><Board tasks={visibleTasks} onMoveTask={moveTask} onAddTask={openAdd} onEditTask={openEdit} onDeleteTask={deleteTask} hasFilters={hasFilters} onClearFilters={() => { setSearch(''); setPriority('All'); }} /></main>{isModalOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsModalOpen(false)}><form className="task-form" onSubmit={submitTask}><div className="modal-header"><div><div className="eyebrow">{editingTask ? 'EDIT TASK' : 'NEW TASK'}</div><h2>{editingTask ? 'Edit task' : 'Add a task'}</h2></div><button type="button" className="close-button" onClick={() => { setIsModalOpen(false); setEditingTask(null); }}>×</button></div><label>Task title<input name="title" autoFocus defaultValue={editingTask?.title || ''} placeholder="e.g. Prepare launch checklist" required /></label><label>Description<textarea name="description" rows="3" defaultValue={editingTask?.description || ''} placeholder="What needs to be done?" /></label><div className="form-grid"><label>Priority<select name="priority" defaultValue={editingTask?.priority || 'Medium'}><option>High</option><option>Medium</option><option>Low</option></select></label><label>Due date<input name="due" defaultValue={editingTask?.due || ''} placeholder="Aug 28" /></label></div><label>Status<select value={newTaskStatus} onChange={(event) => setNewTaskStatus(event.target.value)}><option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="in_review">In Review</option><option value="done">Done</option></select></label><button className="primary-button form-submit" type="submit">{editingTask ? 'Save changes' : 'Create task'}</button></form></div>}</div>;
}

export default App;
