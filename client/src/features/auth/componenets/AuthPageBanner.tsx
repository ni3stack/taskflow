import { taskPreviewData as previewTasks } from "../../../data/taskPreview.data";
import TaskPreview from "../../marketing/components/TaskPreview";

export function AuthPageBanner() {
  return (
    <section
      className="auth-page__banner"
      aria-label="auth-banner-heading"
    >
      <div className="auth-page_banner-content">
        <p className="auth-page__eyebrow">
          A clear view of your day.
        </p>
        <h2 id="auth-banner-heading" className="auth-page__title">
          Your tasks today.
          <br />
          Your team tomorrow.
        </h2>
        <p className="auth-page__description">
          Organize your personal tasks for free. Bring projects and people
          together with a paid workspace.
        </p>
      </div>
      <TaskPreview tasks={previewTasks.slice(0,3)} />
    </section>
  )
}