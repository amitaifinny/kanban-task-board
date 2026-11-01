import { useEffect, useMemo, useState } from 'react';
import Board from './components/Board.jsx';
import { getOrCreateGuest } from './lib/auth';
import { createTask, fetchTasks, removeTask, updateTask } from './lib/tasks';
import './App.css';

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

function App() {
  const [guest, setGuest] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
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
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  useEffect(() => {
    let active = true;
    async function initializeAuth() { try { const user = await getOrCreateGuest(); if (active) setGuest(user); } catch (error) { if (active) setAuthError(error.message || 'Unable to create a guest session.'); } finally { if (active) setAuthLoading(false); } }
    initializeAuth();
    return () => { active = false; };
  }, []);

  async function loadBoard(userId) { setIsLoading(true); setLoadError(''); try { setTasks(await fetchTasks(userId)); } catch (error) { setLoadError(error.message || 'We could not load your tasks from Supabase.'); } finally { setIsLoading(false); } }
  useEffect(() => { const timer = window.setTimeout(() => { if (guest) loadBoard(guest.id); }, 0); return () => window.clearTimeout(timer); }, [guest]);
  async function moveTask(taskId, status) { if (!guest) return; const previousTasks = tasks; const task = tasks.find((item) => item.id === taskId); if (!task || task.status === status) return; const position = tasks.filter((item) => item.status === status).length; const nextTask = { ...task, status, position }; setTasks(tasks.map((item) => item.id === taskId ? nextTask : item)); setIsSaving(true); setSaveError(''); try { const savedTask = await updateTask(nextTask, guest.id, position); setTasks((current) => current.map((item) => item.id === taskId ? savedTask : item)); } catch (error) { setTasks(previousTasks); setSaveError(error.message || 'This task could not be moved.'); } finally { setIsSaving(false); } }
  async function deleteTask(taskId) { if (!guest) return; const previousTasks = tasks; setTasks(tasks.filter((task) => task.id !== taskId)); setIsSaving(true); setSaveError(''); try { await removeTask(taskId, guest.id); } catch (error) { setTasks(previousTasks); setSaveError(error.message || 'This task could not be deleted.'); } finally { setIsSaving(false); } }
  function openAdd(status = 'todo') { setSaveError(''); setEditingTask(null); setNewTaskStatus(status); setIsModalOpen(true); }
  function openEdit(task) { setSaveError(''); setEditingTask(task); setNewTaskStatus(task.status); setIsModalOpen(true); }
  async function submitTask(event) { event.preventDefault(); if (!guest) return; const form = new FormData(event.currentTarget); const title = form.get('title').trim(); const description = form.get('description').trim(); if (!title) return; if (title.length > TITLE_MAX_LENGTH) { setSaveError(`Task titles must be ${TITLE_MAX_LENGTH} characters or fewer.`); return; } if (description.length > DESCRIPTION_MAX_LENGTH) { setSaveError(`Descriptions must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`); return; } const details = { title, description, priority: form.get('priority'), due: form.get('due') || 'No date', status: newTaskStatus, color: editingTask?.color || ['coral', 'blue', 'mint', 'violet'][tasks.length % 4] }; const position = editingTask?.position || tasks.filter((task) => task.status === newTaskStatus).length; setIsSaving(true); setSaveError(''); try { const savedTask = editingTask ? await updateTask({ ...editingTask, ...details }, guest.id, position) : await createTask(details, guest.id, position); setTasks((current) => editingTask ? current.map((task) => task.id === editingTask.id ? savedTask : task) : [...current, savedTask]); setIsModalOpen(false); setEditingTask(null); } catch (error) { setSaveError(error.message || 'Your task could not be saved.'); } finally { setIsSaving(false); } }

  const visibleTasks = useMemo(() => tasks.filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase()) && (priority === 'All' || task.priority === priority)), [tasks, search, priority]);
  const hasFilters = Boolean(search || priority !== 'All');
  if (authLoading) return <div className="state-screen" role="status"><h1>Setting up your workspace...</h1><p>Creating or restoring your guest session.</p></div>;
  if (authError) return <div className="state-screen" role="alert"><h1>Authentication failed</h1><p>{authError}</p></div>;
  if (!guest) return <div className="state-screen" role="alert"><h1>Unable to start guest session</h1><p>Please refresh and try again.</p></div>;
  if (isLoading) return <div className="loading-screen" role="status" aria-live="polite"><div className="loading-brand"><span className="brand-mark">◆</span> Flowboard</div><div className="loading-copy"><span className="spinner" /><strong>Loading your workspace</strong><span>Fetching your latest tasks...</span></div><div className="skeleton-board"><div /><div /><div /><div /></div></div>;
  if (loadError) return <div className="state-screen" role="alert"><div className="state-icon error-icon">!</div><div className="state-label">BOARD LOAD ERROR</div><h1>Couldn’t open this board</h1><p>{loadError}</p><button className="primary-button" onClick={() => loadBoard(guest.id)}>Try again</button></div>;

  return <div className="app-shell"><main className="workspace"><section className="page-heading"><div><div className="eyebrow">YOUR WORKSPACE</div><h1>My Board</h1><p className="subtitle">Organize your tasks and keep work moving.</p></div><button className="primary-button" onClick={() => openAdd()}><span>+</span> Add task</button></section>{saveError && <div className="save-alert" role="alert"><span>!</span>{saveError}<button onClick={() => setSaveError('')}>Dismiss</button></div>}<section className="toolbar" aria-label="Board tools"><label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." /></label><div className="toolbar-right"><span className={`sync-state ${isSaving ? 'is-saving' : 'is-saved'}`} role="status" aria-live="polite">{isSaving ? <><span className="mini-spinner" /> Saving changes...</> : <><span className="saved-dot" /> Saved just now</>}</span><span className="task-count">{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}</span><select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Filter by priority"><option>All</option><option>High</option><option>Medium</option><option>Low</option></select></div></section><Board tasks={visibleTasks} draggingTaskId={draggingTaskId} onDragStartTask={setDraggingTaskId} onDragEndTask={() => setDraggingTaskId(null)} onMoveTask={moveTask} onAddTask={openAdd} onEditTask={openEdit} onDeleteTask={deleteTask} hasFilters={hasFilters} onClearFilters={() => { setSearch(''); setPriority('All'); }} /></main>{isModalOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsModalOpen(false)}><form className="task-form" onSubmit={submitTask}><div className="modal-header"><div><div className="eyebrow">{editingTask ? 'EDIT TASK' : 'NEW TASK'}</div><h2>{editingTask ? 'Edit task' : 'Add a task'}</h2></div><button type="button" className="close-button" onClick={() => { setIsModalOpen(false); setEditingTask(null); }}>×</button></div>{saveError && <div className="form-error" role="alert">{saveError}</div>}<label>Task title<input name="title" autoFocus maxLength={TITLE_MAX_LENGTH} defaultValue={editingTask?.title || ''} placeholder="e.g. Prepare launch checklist" required /></label><label>Description<textarea name="description" rows="3" maxLength={DESCRIPTION_MAX_LENGTH} defaultValue={editingTask?.description || ''} placeholder="What needs to be done?" /></label><div className="form-grid"><label>Priority<select name="priority" defaultValue={editingTask?.priority || 'Medium'}><option>High</option><option>Medium</option><option>Low</option></select></label><label>Due date<input name="due" type="date" defaultValue={editingTask?.dueDate || ''} /></label></div><label>Status<select value={newTaskStatus} onChange={(event) => setNewTaskStatus(event.target.value)}><option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="in_review">In Review</option><option value="done">Done</option></select></label><button className="primary-button form-submit" type="submit">{isSaving ? 'Saving...' : editingTask ? 'Save changes' : 'Create task'}</button></form></div>}</div>;
}

export default App;
