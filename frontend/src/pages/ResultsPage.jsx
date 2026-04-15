import { useState, useEffect, useCallback, useRef } from 'react';
import { getLeaderboard, getLeaderboardTabs } from '../services/api';

/**
 * Results page — Tab navigation, podium, search, and leaderboard table.
 * Full replica of the original results.html functionality.
 */
export default function ResultsPage() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('romans_corinthians_cumulative');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealedRemarks, setRevealedRemarks] = useState(new Set());
  const [championRevealed, setChampionRevealed] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Load tabs on mount
  useEffect(() => {
    getLeaderboardTabs()
      .then(setTabs)
      .catch(() => {
        // Fallback tabs if API fails
        setTabs([
          { key: 'romans_corinthians_cumulative', label: 'ሮሜ - ፪ኛ ቆሮንቶስ', icon: 'Saint_Paul.png' },
          { key: '2corinthians', label: '፪ኛ ቆሮንቶስ', icon: 'Saint_Paul.png' },
          { key: '1corinthians', label: '፩ኛ ቆሮንቶስ', icon: 'Saint_Paul.png' },
          { key: 'romans', label: 'ወደ ሮሜ ሰዎች', icon: 'Saint_Paul.png' },
          { key: 'acts', label: 'ግብረ ሐዋርያት', icon: 'Acts.png' },
          { key: 'cumulative', label: 'አጠቃላይ - የ፬ቱ ወንጌላት', icon: 'All_Gospels.png' },
          { key: 'john', label: 'የቅዱስ ዮሐንስ ወንጌል', icon: 'Saint_John.png' },
          { key: 'luke', label: 'የቅዱስ ሉቃስ ወንጌል', icon: 'Saint_luke.png' },
          { key: 'mark', label: 'የቅዱስ ማርቆስ ወንጌል', icon: 'Saint_Mark.png' },
        ]);
      });
  }, []);

  // Fetch leaderboard data when tab changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setSearchTerm('');
    setChampionRevealed(false);
    setRevealedRemarks(new Set());

    getLeaderboard(activeTab)
      .then((result) => {
        setData(result.data);
        setFilteredData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [activeTab]);

  // Debounced search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      if (!value.trim()) {
        setFilteredData(data);
      } else {
        const term = value.toLowerCase();
        setFilteredData(data.filter(u => u.Username && u.Username.toLowerCase().includes(term)));
      }
    }, 300);
  }, [data]);

  const topThree = filteredData.slice(0, 3);

  // Podium visual order: 2nd, 1st, 3rd
  const podiumOrder = [topThree[1], topThree[0], topThree[2]];
  const podiumClasses = ['second', 'first', 'third'];
  const podiumIcons = ['🥈', '🥇', '🥉'];

  const toggleRemark = (rank) => {
    setRevealedRemarks(prev => {
      const next = new Set(prev);
      if (next.has(rank)) {
        next.delete(rank);
      } else {
        next.clear();
        next.add(rank);
      }
      return next;
    });
  };

  // Firework celebration on champion reveal
  const celebrateReveal = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
      const popper = document.createElement('div');
      popper.className = 'popper';
      popper.textContent = '🎉';
      popper.style.left = centerX + 'px';
      popper.style.top = centerY + 'px';
      popper.style.setProperty('--px', (Math.random() - 0.5) * 400 + 'px');
      popper.style.setProperty('--py', (Math.random() - 0.5) * 400 + 'px');
      popper.style.setProperty('--pr', Math.random() * 360 + 'deg');
      document.body.appendChild(popper);
      setTimeout(() => popper.remove(), 1000);
    }

    // Launch rocket
    const container = document.createElement('div');
    container.className = 'rocket-container';
    document.body.appendChild(container);
    const colors = ['#fbbf24', '#f8fafc', '#10b981', '#c19b4a'];
    const rocket = document.createElement('div');
    rocket.className = 'rocket';
    rocket.style.left = Math.random() * 80 + 10 + '%';
    rocket.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(rocket);

    setTimeout(() => {
      const rRect = rocket.getBoundingClientRect();
      for (let j = 0; j < 20; j++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = (rRect.left + window.scrollX) + 'px';
        particle.style.top = (rRect.top + window.scrollY) + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        particle.style.animation = 'explode 1s ease-out forwards';
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
      }
      rocket.remove();
    }, 1400);

    setTimeout(() => container.remove(), 8000);
  };

  const handlePodiumReveal = (e, index) => {
    const cls = podiumClasses[index];
    if (cls === 'first' && activeTab === 'cumulative' && !championRevealed) {
      setChampionRevealed(true);
      celebrateReveal(e);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <h1>Bible Study - 4 kilo Gibi Gubae</h1>
          <h1>Cumulative Leaderboards</h1>
          <p className="subtitle">Official Quiz Bot Rankings</p>
        </div>
      </header>

      <main id="main" className="container">
        {/* Tab Navigation */}
        <section className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-icon">
                <img src={`/data/${tab.icon}`} alt={tab.label} />
              </span>
              {tab.label}
            </button>
          ))}
        </section>

        {/* Podium Section */}
        <section id="podium" className="podium-container">
          {loading ? (
            <div className="loading">Loading top champions...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            podiumOrder.map((user, index) => {
              if (!user) return null;
              const isFirst = podiumClasses[index] === 'first';
              const isCumulative = activeTab === 'cumulative';
              const isHidden = isFirst && isCumulative && !championRevealed;

              return (
                <div
                  key={user.Rank}
                  className={`podium-card ${podiumClasses[index]} ${isHidden ? 'champion-hidden first-celebrate' : ''} ${championRevealed && isFirst ? 'revealed' : ''}`}
                  onClick={(e) => handlePodiumReveal(e, index)}
                  onMouseEnter={(e) => handlePodiumReveal(e, index)}
                >
                  <span className="rank-icon">{podiumIcons[index]}</span>
                  <div className="user-name-wrapper">
                    <h3>{user.Username}</h3>
                  </div>
                  <div className="score">{parseFloat(user.Final_Score).toFixed(1)}</div>
                  <div className="label">Points</div>
                  <div className="stats-mini">
                    {user.Quizzes_Participated} Quizzes | {parseFloat(user.Avg_Points).toFixed(1)} Acc
                  </div>
                  <div className="blessing-overlay">
                    <div className="blessing-content">
                      <span className="sparkle">✨</span>
                      <p className="blessing-text">
                        እግዚአብሔር ያክብራችሁ፤ በእድሜ በጸጋ ይጠብቃችሁ፤ በቤቱ ያጽናችሁ🥰 <br />
                        <small>መልካሙን ሥራችሁን አይተው በሰማያት ያለውን አባታችሁን እንዲያከብሩ ብርሃናችሁ እንዲሁ በሰው ፊት ይብራ። <br /> ማቴዎስ 5፥16</small>
                      </p>
                      <span className="sparkle">✨</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Search & Info */}
        <section className="controls">
          <div className="search-box">
            <input
              type="text"
              id="searchInput"
              placeholder="Search your username..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="stats-info">
            <p>Weightage: 50% Participation | 25% Accuracy | 25% Speed</p>
          </div>
        </section>

        {/* Leaderboard Table */}
        <section className="table-container glass">
          <table id="leaderboardTable">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th className="hide-mobile">Quizzes</th>
                <th className="hide-mobile">Avg Accuracy</th>
                <th className="hide-mobile">Avg Time (s)</th>
                <th>Final Score</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody id="tableBody">
              {loading ? (
                <tr><td colSpan="7"><div className="loading">Loading leaderboard data...</div></td></tr>
              ) : error ? (
                <tr><td colSpan="7" className="error">Unable to load data. Please check data source.</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-dim)'}}>No results found</td></tr>
              ) : (
                filteredData.map((user) => (
                  <tr key={user.Rank} className="rank-row">
                    <td className="rank-cell">#{user.Rank}</td>
                    <td className="user-cell">{user.Username}</td>
                    <td className="hide-mobile">{user.Quizzes_Participated}</td>
                    <td className="hide-mobile">{parseFloat(user.Avg_Points || 0).toFixed(2)}</td>
                    <td className="hide-mobile">{parseFloat(user.Avg_Time || 0).toFixed(1)}s</td>
                    <td className="score-cell">{parseFloat(user.Final_Score || 0).toFixed(2)}</td>
                    <td
                      className={`remark-cell ${revealedRemarks.has(user.Rank) ? 'revealed' : ''}`}
                      onClick={() => toggleRemark(user.Rank)}
                    >
                      <span className="click-hint">Click to see...</span>
                      <span className="remark-text">{user.Remark || ''}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
