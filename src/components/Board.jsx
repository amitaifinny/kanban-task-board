import { getDueDateState } from '../lib/tasks';
import Column from './Column.jsx';

const columns = [{ id: 'todo', title: 'To Do', accent: 'coral' }, { id: 'in_progress', title: 'In Progress', accent: 'blue' }, { id: 'in_review', title: 'In Review', accent: 'violet' }, { id: 'done', title: 'Done', accent: 'green' }];

function Board({ tasks, draggingTaskId, onDragStartTask, onDragEndTask, onMoveTask, onAddTask, onEditTask, onDeleteTask, hasFilters, onClearFilters }) {
  const counts = columns.map((column) => tasks.filter((task) => task.status === column.id).length);
  const maxCount = Math.max(...counts, 1);
  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === 'done').length,
    overdue: tasks.filter((task) => getDueDateState(task.dueDate, task.status) === 'overdue').length,
  };
  return <><div className="board-stats" aria-label="Board summary"><div className="stat-card stat-card-total"><span>Total tasks</span><strong>{stats.total}</strong></div><div className="stat-card stat-card-completed"><span>Completed</span><strong>{stats.completed}</strong></div><div className="stat-card stat-card-alert"><span>Overdue</span><strong>{stats.overdue}</strong></div></div><div className="board">{columns.map((column, index) => <Column key={column.id} {...column} tasks={tasks.filter((task) => task.status === column.id)} progress={(counts[index] / maxCount) * 100} draggingTaskId={draggingTaskId} onDragStartTask={onDragStartTask} onDragEndTask={onDragEndTask} onMoveTask={onMoveTask} onAddTask={onAddTask} onEditTask={onEditTask} onDeleteTask={onDeleteTask} hasFilters={hasFilters} onClearFilters={onClearFilters} />)}</div></>;
}

export default Board;
