import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Sticky navigation bar with logo, nav links, and mobile hamburger menu.
 * Exact replica of the original site's nav structure.
 */
export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/results', label: 'Results' },
    { path: '/resources', label: 'Resources' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/links', label: 'Links' },
    { path: '/courses', label: 'Courses' },
    { path: '/bahre-hasab', label: 'ባህረ ሐሳብ' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuOpen) setMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav>
      <div className="container">
        <Link to="/" className="logo-link">
          <img
            src="/assets/img/logo.png"
            alt="Logo"
            className="logo-img"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/50/c19b4a/ffffff?text=AK'; }}
          />
          <span className="brand-name">አራት ኪሎ ግቢ ጉባኤ</span>
        </Link>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={location.pathname === path ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {isMobile && (
          <button
            className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`}
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </div>
    </nav>
  );
}
