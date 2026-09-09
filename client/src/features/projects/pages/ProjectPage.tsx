import PageHeader from "../../../components/common/PageHeader";

function ProjectPage() {
    const handleClick = () => {
    console.log("handle create task click")
  }
  return (
    <section className="project-page">
      <div className="project-header">
        <PageHeader
          title="Projects"
          description="Manage your projects and keep your work organized."
          action={
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClick}>
              Create Project
            </button>
          }
        />
      </div>
      <div className="projects-list">
        <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Tasks</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}>No projects yet.</td>
              </tr>
            </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProjectPage;
