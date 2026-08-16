import "./dashboard.css";

function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <h1>Dashboard</h1>
        <p>Here's an overview of your tasks</p>
      </div>

      <div className="dashboard-stats">
        <div>
          <span>Total tasks</span>
          <strong>12</strong>
        </div>
        <div>
          <span>In progress</span>
          <strong>6</strong>
        </div>
        <div>
          <span>Completed</span>
          <strong>5</strong>
        </div>
        <div>
          <span>Overdue</span>
          <strong>1</strong>
        </div>
      </div>
      <section className="recent-tasks">
       <h2>Recent Tasks</h2>
        <div>
            <span>Finish authentication flow</span>
            <span>In Progress</span>
        </div>
        <div>
            <span>Build dashboard</span>
            <span>In Progress</span>
        </div>
        <div>
            <span>Set up CI/CD</span>
            <span>Completed</span>
        </div>
      </section>
    </section>
  )
}

export default DashboardPage;