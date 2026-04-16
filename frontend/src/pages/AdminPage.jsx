import { useState, useEffect } from 'react';

/**
 * Admin Dashboard — Protected view for contact submissions.
 * Optimized with dedicated CSS classes and professional layout.
 */
export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputToken, setInputToken] = useState('');

  const fetchSubmissions = async (activeToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/submissions', {
        headers: {
          'X-Admin-Token': activeToken
        }
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Invalid Token');
        throw new Error('Failed to fetch submissions');
      }

      const resData = await response.json();
      setSubmissions(resData.data);
      setIsAuthorized(true);
      localStorage.setItem('adminToken', activeToken);
    } catch (err) {
      setError(err.message);
      setIsAuthorized(false);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubmissions(token);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setToken(inputToken);
    fetchSubmissions(inputToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthorized(false);
    setSubmissions([]);
  };

  if (!isAuthorized) {
    return (
      <div className="admin-login-container">
        <header>
          <div className="container">
            <h1>Admin Access</h1>
            <p className="subtitle">Secure portal for community feedback</p>
          </div>
        </header>
        <main className="container">
          <div className="admin-card" style={{ maxWidth: '450px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="coming-soon-icon">🔐</span>
              <h2 className="coming-soon-title" style={{ fontSize: '2rem' }}>Authentication</h2>
              <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Enter your secret token to proceed</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Secret Admin Token" 
                  className="admin-token-input"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="cta-placeholder" style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                Verify Access
              </button>
            </form>
            {error && <p style={{ color: '#ff4d4d', marginTop: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header>
        <div className="container admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="subtitle">Managing {submissions.length} submissions</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>Logout</button>
        </div>
      </header>

      <main className="container">
        <div className="admin-table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <p>Fetching encrypted submissions...</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Requester</th>
                    <th>Email</th>
                    <th>Category</th>
                    <th>Message & Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id}>
                      <td style={{ color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: '600' }}>{s.name}</td>
                      <td style={{ color: 'var(--primary-light)' }}>{s.email}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          background: 'rgba(193, 155, 74, 0.15)', 
                          fontSize: '0.75rem',
                          color: 'var(--primary)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          {s.subject || 'General'}
                        </span>
                      </td>
                      <td>
                        <div className="message-preview">
                          {s.message || s.improvements || s.features || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No content</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📥</div>
                        No feedback submissions found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
