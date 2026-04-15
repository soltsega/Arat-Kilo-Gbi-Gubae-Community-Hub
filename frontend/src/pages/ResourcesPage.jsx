import { useState, useEffect } from 'react';
import { getSpiritualResources, getAcademicResources } from '../services/api';

/**
 * Resources page — Academic/Spiritual tabs with gospel chapter cards.
 * Includes localStorage-based read tracking for chapters.
 */
export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('academic');
  const [spiritualData, setSpiritualData] = useState([]);
  const [academicData, setAcademicData] = useState([]);
  const [readChapters, setReadChapters] = useState({});

  useEffect(() => {
    getSpiritualResources().then(setSpiritualData).catch(console.error);
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
            </section>
          </div>
        )}
      </main>
    </>
  );
}
