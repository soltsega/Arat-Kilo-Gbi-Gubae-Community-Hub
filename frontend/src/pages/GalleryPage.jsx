/**
 * Gallery page — Telegram CTA, gallery grid, and upcoming events.
 */
export default function GalleryPage() {
  return (
    <>
      <header>
        <div className="container">
          <h1>Gallery</h1>
          <p className="subtitle">Memorable Moments &amp; Community Highlights</p>
        </div>
      </header>

      <main className="container">
        <section className="hero secondary-hero">
          <p>Welcome to our community gallery! Here you'll find memorable moments from our quiz competitions, community events, and celebrations. Join our Telegram channel to stay updated with all our activities.</p>

          {/* Telegram Channel Section */}
          <div className="telegram-section">
            <div className="telegram-card">
              <div className="card-header">
                <h3>Join Our Telegram Channels</h3>
              </div>
              <p className="telegram-description">Stay connected with the Arat Kilo Gibi Gubae community! Get updates on quiz schedules, results, announcements, and participate in discussions.</p>
              <div className="telegram-buttons">
                <a href="https://t.me/gubaeze4k" target="_blank" rel="noopener noreferrer" className="telegram-btn">
                  <i>🔔</i> Main Channel
                </a>
                <a href="https://t.me/gallery_ze4k" target="_blank" rel="noopener noreferrer" className="telegram-btn secondary">
                  <i>🖼️</i> Gallery Channel
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="gallery-section">
          <h2>Community Moments</h2>
          <div className="gallery-grid">
            {[
              { title: 'Quiz Competitions', desc: 'Intense quiz battles and knowledge challenges' },
              { title: 'Award Ceremonies', desc: 'Celebrating our top performers and achievers' },
              { title: 'Community Events', desc: 'Gatherings, discussions, and fellowship moments' },
              { title: 'Study Sessions', desc: 'Collaborative learning and knowledge sharing' },
              { title: 'Spiritual Gatherings', desc: 'Prayer meetings and spiritual discussions' },
            ].map((item, index) => (
              <div key={index} className="gallery-item">
                <div className="gallery-card">
                  <div className="gallery-placeholder">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="upcoming-section">
          <h2>Upcoming Events</h2>
          <div className="events-grid">
            {[
              { icon: '📅', title: 'Weekly Quiz Challenge', date: 'Every Saturday', desc: 'Test your knowledge and compete with community members' },
              { icon: '🎯', title: 'Monthly Championship', date: 'Last Sunday of Month', desc: 'Grand quiz tournament with exciting prizes' },
              { icon: '📖', title: 'Bible Study Group', date: 'Sunday Evenings', desc: 'Deep dive into scripture and spiritual discussions' },
            ].map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-icon">{event.icon}</div>
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <p className="event-date">{event.date}</p>
                  <p className="event-description">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
