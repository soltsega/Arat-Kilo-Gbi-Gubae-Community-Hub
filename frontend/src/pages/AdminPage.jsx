import { useState, useEffect } from 'react';

/**
 * Admin Dashboard — Protected view for contact submissions.
 * Requires a "Secret Token" (password) to fetch data from /api/admin/submissions.
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
          <div className="coming-soon-card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <span className="coming-soon-icon">🔐</span>
            <h2 className="coming-soon-title">Authentication Required</h2>
            <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Enter Secret Admin Token" 
                  className="input-group"
                  style={{ width: '100%', marginBottom: '1rem', padding: '1rem', borderRadius: '12px' }}
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="cta-placeholder" style={{ border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                Verify Access
              </button>
            </form>
            {error && <p style={{ color: '#ff4d4d', marginTop: '1rem' }}>{error}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Admin Dashboard</h1>
            <p className="subtitle">Total Submissions: {submissions.length}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
        </div>
      </header>

      <main className="container">
        <div className="coming-soon-card" style={{ padding: '2rem', textAlign: 'left', maxWidth: 'none' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading submissions...</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-light)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Subject</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{s.name}</td>
                      <td style={{ padding: '12px', color: 'var(--primary-light)' }}>{s.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          background: 'rgba(193, 155, 74, 0.2)', 
                          fontSize: '0.8rem',
                          color: 'var(--primary)'
                        }}>
                          {s.subject || 'General'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', maxWidth: '300px' }}>
                        <div style={{ 
                          maxHeight: '60px', 
                          overflowY: 'auto', 
                          fontSize: '0.9rem',
                          lineHeight: '1.4'
                        }}>
                          {s.message}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                        No submissions found.
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
