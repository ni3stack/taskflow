import PageHeader from "../../../components/common/PageHeader";

function TasksPage() {
  const handleClick = () => {
    console.log("handle create task click")
  }
  return (
    <section className="task-page">
      <div className="task-header">
        <PageHeader
          title="Tasks"
          description="Your tasks will appear here"
          action={
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClick}>
              Create Tasks
            </button>
          }
        />
      </div>
      <div className="tasks-list">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>No tasks yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TasksPage;
