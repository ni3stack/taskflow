import { ArrowRight, Check } from "lucide-react";
import TaskPreview from "../components/TaskPreview";
import "./LandingPage.css"
import { Link } from "react-router-dom";

import { taskPreviewData as tasks } from "../../../data/taskPreview.data";

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
            <div className="pt-4">
              <Link to="/signup" className="action action--primary">
                <span>Get Started for free</span>
                <ArrowRight size={16} aria-hidden="true"></ArrowRight>
            </Link>
            </div>
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