import { useEffect, useRef, useState } from 'react';
import { getDueDateState } from '../lib/tasks';

function TaskCard({ task, onMoveTask, onEditTask, onDeleteTask, onDragStartTask, onDragEndTask }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return undefined;
    function closeOnOutsideClick(event) { if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false); }
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [menuOpen]);
  function startDragging(event) { const taskId = String(task.id); const bounds = event.currentTarget.getBoundingClientRect(); setIsDragging(true); onDragStartTask(task.id); event.dataTransfer.setData('text/plain', taskId); event.dataTransfer.setData('taskId', taskId); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setDragImage(event.currentTarget, event.clientX - bounds.left, event.clientY - bounds.top); }
  function finishDragging() { setIsDragging(false); onDragEndTask(); }
  const dueState = getDueDateState(task.dueDate, task.status);
  return <article className={`task-card ${isDragging ? 'is-dragging' : ''}`} draggable onDragStart={startDragging} onDragEnd={finishDragging}><div className="task-card-top"><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span><div className="card-menu-wrap" ref={menuRef}><button className="more-button" aria-label={`More options for ${task.title}`} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>•••</button>{menuOpen && <div className="card-menu"><button onClick={() => { setMenuOpen(false); onEditTask(task); }}>Edit task</button><button className="danger-action" onClick={() => { setMenuOpen(false); onDeleteTask(task.id); }}>Delete task</button></div>}</div></div><h3>{task.title}</h3><p>{task.description}</p><div className="task-meta"><span className={`due-date due-${dueState}`}>◷ {task.due}</span></div><div className="task-hover-actions"><button onClick={() => onMoveTask(task.id, 'todo')}>To Do</button><button onClick={() => onMoveTask(task.id, 'in_progress')}>Doing</button><button onClick={() => onMoveTask(task.id, 'in_review')}>Review</button><button onClick={() => onMoveTask(task.id, 'done')}>Done</button></div></article>;
}

export default TaskCard;
