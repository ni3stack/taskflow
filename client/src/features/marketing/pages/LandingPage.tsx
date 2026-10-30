import { ArrowRight, Check } from "lucide-react";
import TaskPreview, { type TaskPreviewItem} from "../components/TaskPreview";
import "./LandingPage.css"
import { Link } from "react-router-dom";

const tasks: TaskPreviewItem[] = [
  {
    id: "preview-1",
    title: "Finish landing page copy",
    status: "in_progress",
    priority: "high",
    dueDateLabel: "Today, 10:00 AM",
  },
  {
    id: "preview-2",
    title: "Review design system tokens",
    status: "todo",
    priority: "medium",
    dueDateLabel: "Today, 1:30 PM",
  },
  {
    id: "preview-3",
    title: "Plan next week’s tasks",
    status: "todo",
    priority: "low",
    dueDateLabel: "Tomorrow",
  },
  {
    id: "preview-4",
    title: "Outline project ideas",
    status: "completed",
    priority: "low",
    dueDateLabel: "Today, 9:00 AM",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-page__container">
        <section className="landing-page__hero" aria-labelledby="hero-heading">
          <div className="landing-page__hero-content">
            <h1 id="hero-heading" className="landing-page__hero-title">
              Your tasks today.
              <br />
              Your team tomorrow.
            </h1>
            <p className="landing-page__hero-description">
              Organize your personal tasks for free. Bring projects and people
              together with a paid workspace.
            </p>
            <Link to="/signup" className="landing-page__cta">
              <span>Get Started for free</span>
              <ArrowRight size={16} aria-hidden="true"></ArrowRight>
            </Link>
          </div>
          <ul className="landing-page__benefits">
            <li>
              <Check size={16} aria-hidden="true" />
              <span>Tasks &amp; deadlines</span>
            </li>
            <li>
              <Check size={16} aria-hidden="true" />
              <span>Priorities &amp; status</span>
            </li>
            <li>
              <Check size={16} aria-hidden="true" />
              <span>Free personal task management</span>
            </li>
          </ul>
        </section>
        <div className="landing-page__task-peviews">
          <TaskPreview tasks={tasks} />
        </div>
      </div>
    </div>
  );
}