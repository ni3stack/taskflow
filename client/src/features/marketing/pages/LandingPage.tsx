export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-page__container">
        <section className="landing-page__hero" aria-labelledby="hero-heading">
          <div className="landing-page__hero-content">
            <h1 id="hero-heading" className="landing-page__hero-title">
              Your tasks today
              <br />
              Your team tomorrow.
            </h1>
            <p className="landing-page__hero-description">
              Organize your personal tasks for free. Bring projects and people
              together with a paid workspace.
            </p>
          </div>
          <div className="landing-page__features">
            <h2>Features</h2>
            <ul>
              <li>Task management</li>
              <li>Project planning</li>
              <li>Team collaboration</li>
            </ul>
        </div>
        </section>
        <div className="landing-page__task-reviews">
            <h2>What Our Users Say</h2>
            <p>"This is the best task management tool I've ever used!"</p>
        </div>
      </div>
    </div>
  );
}