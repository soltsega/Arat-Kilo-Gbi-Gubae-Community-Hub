import { Link } from 'react-router-dom';

/**
 * Courses page — "Coming Soon" with floating animation.
 */
export default function CoursesPage() {
  return (
    <>
      <header>
        <div className="container">
          <h1>Courses &amp; Certifications</h1>
          <p className="subtitle">ኮርሶች እና ሰርተፊኬቶች</p>
        </div>
      </header>

      <main className="container">
        <section className="coming-soon-section">
          <div className="coming-soon-card">
            <span className="coming-soon-icon">📚</span>
            <h2 className="coming-soon-title">በቅርቡ ጠብቁን</h2>
            <p className="coming-soon-text">Coming Soon!</p>
            <p className="coming-soon-sub">
              We are preparing exciting courses and certification programs for our community.
              Deepen your spiritual knowledge and academic skills with us.
            </p>
            <Link to="/contact" className="cta-placeholder">
              Stay Updated <span>✨</span>
            </Link>
            <div className="sparkle-row">✦ ✦ ✦</div>
          </div>
        </section>
      </main>
    </>
  );
}
