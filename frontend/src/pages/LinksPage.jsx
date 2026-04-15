import { useState, useEffect } from 'react';
import { getAllLinks } from '../services/api';

/**
 * Links page — Local and wider community link cards.
 */
export default function LinksPage() {
  const [links, setLinks] = useState({ local: [], wider: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLinks()
      .then((data) => {
        setLinks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <header>
          <div className="container">
            <h1>Quick Links</h1>
            <p className="subtitle">Connect with us and explore more</p>
          </div>
        </header>
        <main className="container">
          <div className="loading">Loading links...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <header>
        <div className="container">
          <h1>Quick Links</h1>
          <p className="subtitle">Connect with us and explore more</p>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h2 className="section-title">Local Community Links</h2>
          <div className="feature-grid">
            {links.local.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="feature-card">
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="hero">
          <h2 className="section-title">Wider Community Resources</h2>
          <div className="feature-grid">
            {links.wider.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="feature-card">
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
