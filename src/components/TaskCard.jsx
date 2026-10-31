function TaskCard({ title, priority }) {
  return (
    <div className="task-card">
      <h3>{title}</h3>
      <span>{priority}</span>
    </div>
  );
}

export default TaskCard;