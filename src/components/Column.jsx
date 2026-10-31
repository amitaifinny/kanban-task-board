import TaskCard from './TaskCard';

function Column({ title, tasks }) {
  return (
    <section className="column">
      <h2>{title}</h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          priority={task.priority}
        />
      ))}
    </section>
  );
}

export default Column;