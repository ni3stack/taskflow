import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CalendarDays,
  ListFilter,
  SquareCheck, 
  UsersRound 
} from "lucide-react";
import { Banner } from "@ni3stack/ui";
import TaskPreview from "../components/TaskPreview";
import { taskPreviewData as tasks } from "../../../data/taskPreview.data";
import "./FeaturesPage.css";

export default function FeaturesPage() {
  return (
    <div className="features-page">
      <div className="features-page__container">
        <header className="features-page__intro">
          <p className="features-page__eyebrow">Features</p>
          <h1 className="features-page__title">A clear plan for what's next.</h1>
          <p className="features-page__description">
            Organize your personal tasks for free.
            Bring projects and people together with a paid workspace.
          </p>
        </header>
        <div className="features-page__content">
          <div className="features-page__features">
            <div className="features-page__feature">
              <div className="features-page__feature-icon">
                <UsersRound size="16px" aria-hidden="true" />
              </div>
              <div className="features-page__feature-content">
                <h2 className="features-page__feature-title">Team Collaboration</h2>
                <p className="features-page__feature-description">
                  Collaborate with your team in real-time, share tasks, and stay
                  organized with ease.
                </p>
              </div>
            </div>
            <div className="features-page__feature">
              <div className="features-page__feature-icon">
                <CalendarDays size="16px" aria-hidden="true" />
              </div>
              <div className="features-page__feature-content">
                <h2 className="features-page__feature-title">Tasks & deadlines</h2>
                <p className="features-page__feature-description">
                  Give every task a clear deadline, so you know what needs your attention today.
                </p>
              </div>
            </div>
            <div className="features-page__feature">
              <div className="features-page__feature-icon">
                <ListFilter size="16px" aria-hidden="true" />
              </div>
              <div className="features-page__feature-content">
                <h2 className="features-page__feature-title">Priority & status </h2>
                <p className="features-page__feature-description">
                  Set priorities and keep track of what's to do, in progress, or done.
                </p>
              </div>
            </div>
            <div className="features-page__feature">
              <div className="features-page__feature-icon">
                <SquareCheck size="16px" aria-hidden="true" />
              </div>
              <div className="features-page__feature-content">
                <h2 className="features-page__feature-title">Free personal tasks management </h2>
                <p className="features-page__feature-description">
                  Keep your own tasks in one place. A simple way to organize your day, for free.
                </p>
              </div>
            </div>
            <Link to="/signup" className="action action--primary">
              <span>Get Started for free</span>
              <ArrowRight size={16} aria-hidden="true"></ArrowRight>
            </Link>
          </div>
          <div className="features-page__task-preview">
            <TaskPreview tasks={tasks} />
          </div>
        </div>
        <Banner variant="info" className="features-page__banner">
            <UsersRound 
              size={24}
              className="features-page__banner-icon"
            />
            <div className="features-page__banner-copy">
              <h2 className="features-page__banner-title">
                Your tasks today. Your team tomorrow.
              </h2>
              <p className="features-page__banner-description">
                Personal task management is free. For projects and people, choose a paid workspace.
              </p>
            </div>
            <Link to="/pricing" className="action action--secondary">
              <span>Explore Pricing</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
        </Banner>
      </div>
    </div>
  );
}
