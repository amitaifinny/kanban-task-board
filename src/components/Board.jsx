import Column from './Column';

const tasks = [
  { id: 1, title: 'Create login page', priority: 'High', status: 'todo' },
  { id: 2, title: 'Design task cards', priority: 'Medium', status: 'todo' },
  { id: 3, title: 'Set up Supabase', priority: 'High', status: 'in_progress' },
  { id: 4, title: 'Initialize GitHub', priority: 'Low', status: 'done' },
];

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

function Board() {
  return (
    <div className="board">
      {columns.map((column) => (
        <Column
          key={column.id}
          title={column.title}
          tasks={tasks.filter((task) => task.status === column.id)}
        />
      ))}
    </div>
  );
}

export default Board;