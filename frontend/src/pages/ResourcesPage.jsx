import { useState, useEffect } from 'react';
import { getSpiritualResources, getAcademicResources, getSpiritualQuestions } from '../services/api';

/**
 * Resources page — Academic/Spiritual tabs with gospel chapter cards.
 * Includes localStorage-based read tracking for chapters.
 */
export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('academic');
  const [spiritualData, setSpiritualData] = useState([]);
  const [spiritualQuestions, setSpiritualQuestions] = useState([]);
  const [academicData, setAcademicData] = useState([]);
  const [readChapters, setReadChapters] = useState({});

  useEffect(() => {
    getSpiritualResources().then(setSpiritualData).catch(console.error);
    getSpiritualQuestions().then(setSpiritualQuestions).catch(console.error);
    getAcademicResources().then(setAcademicData).catch(console.error);

    // Load read tracking from localStorage
    const stored = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('read_')) {
        stored[key] = true;
      }
    }
    setReadChapters(stored);
  }, []);

  const markAsRead = (bookTitle, chapterLabel) => {
    const key = `read_${bookTitle}_${chapterLabel}`;
    localStorage.setItem(key, 'true');
    setReadChapters(prev => ({ ...prev, [key]: true }));
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  const isRead = (bookTitle, chapterLabel) => {
    return readChapters[`read_${bookTitle}_${chapterLabel}`] || false;
  };

  return (
    <>
      <header>
        <div className="container">
          <h1>Resources</h1>
          <p className="subtitle">Academic and Spiritual Materials</p>
        </div>
      </header>

      <main id="main" className="container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            Academic Support
          </button>
          <button
            className={`tab-btn ${activeTab === 'spiritual' ? 'active' : ''}`}
            onClick={() => setActiveTab('spiritual')}
          >
            Spiritual Resources
          </button>
        </div>

        {/* Academic Tab */}
        {activeTab === 'academic' && (
          <div className="tab-content active">
            <section className="hero secondary-hero">
              <p>Academic subject notes, old exams, and tutorials curated by our senior members to support your university journey.</p>
              <div className="feature-grid academic-grid">
                {academicData.map((item) => (
                  <div key={item.id} className="feature-card">
                    <i>{item.icon}</i>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="status-badge">{item.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Spiritual Tab */}
        {activeTab === 'spiritual' && (
          <div className="tab-content active">
            <section className="hero secondary-hero">
              <p>A collection of spiritual resources, including Gospel summaries and Orthodox Tewahedo teachings.</p>
              <div className="gospel-grid">
                {spiritualData.map((gospel) => (
                  <div key={gospel.id} className={`gospel-card ${!gospel.available ? 'unavailable' : ''}`}>
                    <div className="card-header">
                      <i>📖</i>
                      <h3>{gospel.title}</h3>
                    </div>
                    <p className="gospel-description">{gospel.description}</p>
                    {gospel.available ? (
                      <div className="chapter-list">
                        {gospel.chapters.map((ch) => (
                          <a
                            key={ch.number}
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={isRead(gospel.title, ch.label) ? 'read' : ''}
                            onClick={() => markAsRead(gospel.title, ch.label)}
                          >
                            {ch.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="availability">Not available yet</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="spiritual-qa-section" style={{ marginTop: '4rem' }}>
                <h2 className="section-title">Spiritual questions asked and their answers</h2>
                <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '2rem' }}>
                  Select a book to explore questions and answers
                </p>
                <div className="qa-books-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                  gap: '1rem',
                  marginTop: '2rem'
                }}>
                  {spiritualQuestions.map((book) => (
                    <button
                      key={book.id}
                      className={`qa-book-btn ${book.available ? 'available' : 'coming-soon'}`}
                      disabled={!book.available}
                      style={{
                        padding: '1.2rem',
                        borderRadius: '12px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: book.available ? 'pointer' : 'not-allowed',
                        opacity: book.available ? 1 : 0.6,
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      <span className="book-title" style={{ fontWeight: '700', fontSize: '1.1rem' }}>{book.title}</span>
                      <span className="book-english" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{book.english}</span>
                      {!book.available && (
                        <span className="badge" style={{ 
                          position: 'absolute', 
                          top: '5px', 
                          right: '5px', 
                          fontSize: '0.6rem', 
                          background: 'var(--primary)', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          color: '#fff'
                        }}>Soon</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
