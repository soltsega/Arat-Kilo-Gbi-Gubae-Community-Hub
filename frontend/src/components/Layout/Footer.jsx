import { Link } from 'react-router-dom';

/**
 * 4-column footer matching the original site's design.
 * Brand info, quick links, contact, and YouTube channels.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-column">
            <p className="footer-brand">
              <i className="fas fa-church"></i> Arat Kilo Gibi Gubae
            </p>
            <p className="footer-description">
              Bible study, resources, results, and community updates in one place.
            </p>
            <p className="footer-note">
              Built to support study, participation, and clear community communication.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/results">Results</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/links">Links</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/admin" style={{ opacity: 0.5, fontSize: '0.8rem' }}>Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h3>Contact</h3>
            <ul className="footer-contact">
              <li>
                <a href="https://t.me/gubaeze4k" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-telegram-plane"></i> Telegram Channel
                </a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/uQji4xtGEvLBAoFf6" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-map-marker-alt"></i> Arat Kilo, Addis Ababa
                </a>
              </li>
            </ul>
          </div>

          {/* YouTube Channels */}
          <div className="footer-column">
            <h3>YouTube Channels</h3>
            <ul className="footer-media">
              <li>
                <a href="https://www.youtube.com/@4kilogibigubae" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i> 4 kilo Gibi Gubae
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@5kilogbigubae" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i> 5 kilo Gibi Gubae
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@6Kilogbigubae" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i> 6 kilo Gibi Gubae
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@%E1%89%85%E1%8B%B1%E1%88%B5%E1%8C%B4%E1%8C%A5%E1%88%AE%E1%88%B5%E1%8C%8D%E1%89%A2%E1%8C%89%E1%89%A3%E1%8A%A4kidusp" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i> Kidus Petros Gibi Gubae
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Bible Study | Arat Kilo Gibi Gubae</p>
        </div>
      </div>
    </footer>
  );
}
