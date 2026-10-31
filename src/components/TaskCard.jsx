import { useEffect, useRef, useState } from 'react';

function TaskCard({ task, onMoveTask, onEditTask, onDeleteTask }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return undefined;
    function closeOnOutsideClick(event) { if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false); }
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [menuOpen]);
  return <article className="task-card" draggable onDragStart={(event) => { event.dataTransfer.setData('taskId', task.id); event.dataTransfer.effectAllowed = 'move'; }}><div className="task-card-top"><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span><div className="card-menu-wrap" ref={menuRef}><button className="more-button" aria-label={`More options for ${task.title}`} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>•••</button>{menuOpen && <div className="card-menu"><button onClick={() => { setMenuOpen(false); onEditTask(task); }}>Edit task</button><button className="danger-action" onClick={() => { setMenuOpen(false); onDeleteTask(task.id); }}>Delete task</button></div>}</div></div><h3>{task.title}</h3><p>{task.description}</p><div className="task-meta"><span>◷ {task.due}</span><span className="assignee">{task.title.charCodeAt(0) % 2 ? 'A' : 'D'}</span></div><div className="task-hover-actions"><button onClick={() => onMoveTask(task.id, 'todo')}>To Do</button><button onClick={() => onMoveTask(task.id, 'in_progress')}>Doing</button><button onClick={() => onMoveTask(task.id, 'in_review')}>Review</button><button onClick={() => onMoveTask(task.id, 'done')}>Done</button></div></article>;
}

export default TaskCard;
