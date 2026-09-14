import { Link } from 'react-router-dom';

/**
 * Bible Study Curriculum Page
 * Displays 4 main study years as wide interactive cards.
 */
export default function BibleStudyPage() {
    const curriculumItems = [
        {
            id: 1,
            title: 'Year I',
            subtitle: 'New Testament',
            description: 'An in-depth study of the Gospels, Acts, and the Epistles, focusing on the life and teachings of Jesus Christ.',
            icon: '✝️',
            path: '/bible-study/year-1'
        },
        {
            id: 2,
            title: 'Year II',
            subtitle: 'Old Testament',
            description: 'Exploring the Pentateuch, Historical Books, and the Prophets to understand the foundations of our faith.',
            icon: '📜',
            path: '/bible-study/year-2'
        },
        {
            id: 3,
            title: 'Year III',
            subtitle: 'Old Testament',
            description: 'Continuing the journey through Wisdom Literature and the later Prophets of the Old Testament.',
            icon: '🏺',
            path: '/bible-study/year-3'
        },
        {
            id: 4,
            title: 'Year IV',
            subtitle: 'Patristics',
            description: 'Studying the life, works, and theology of the Holy Fathers and the history of the early Church.',
            icon: '⛪',
            path: '/bible-study/year-4'
        }
    ];

    return (
        <>
            <header>
                <div className="container">
                    <h1>Bible Study Curriculum</h1>
                    <p className="subtitle">Structured spiritual growth through the Holy Scriptures and Church tradition</p>
                </div>
            </header>

            <main id="main" className="container">
                <section className="curriculum-section">
                    <div className="curriculum-grid">
                        {curriculumItems.map((item) => (
                            <div key={item.id} className="curriculum-card feature-card wide">
                                <div className="card-icon">{item.icon}</div>
                                <div className="card-content">
                                    <div className="card-header-group">
                                        <span className="year-label">{item.title}</span>
                                        <h3 className="curriculum-title">{item.subtitle}</h3>
                                    </div>
                                    <p className="curriculum-desc">{item.description}</p>
                                    <Link to={item.path} className="btn-secondary">Explore Modules</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <style dangerouslySetInnerHTML={{
                    __html: `
          .curriculum-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-top: 3rem;
          }

          @media (min-width: 992px) {
            .curriculum-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .curriculum-card.wide {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 2rem;
            text-align: left;
            padding: 2.5rem;
            width: 100%;
            height: auto;
            min-height: 220px;
          }

          @media (max-width: 768px) {
            .curriculum-card.wide {
              flex-direction: column;
              text-align: center;
              padding: 2rem;
            }
          }

          .card-icon {
            font-size: 4rem;
            background: rgba(193, 155, 74, 0.1);
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            flex-shrink: 0;
            border: 1px solid rgba(193, 155, 74, 0.2);
          }

          .card-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .card-header-group {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .year-label {
            color: var(--primary);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 0.85rem;
          }

          .curriculum-title {
            font-size: 1.8rem;
            margin: 0;
            background: linear-gradient(90deg, #fff, var(--primary-light));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .curriculum-desc {
            color: var(--text-dim);
            line-height: 1.6;
            font-size: 1rem;
            margin-bottom: 0.5rem;
          }

          .btn-secondary {
            display: inline-block;
            padding: 0.8rem 1.5rem;
            background: rgba(193, 155, 74, 0.1);
            border: 1px solid var(--primary);
            color: var(--primary);
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            align-self: flex-start;
          }

          @media (max-width: 768px) {
            .btn-secondary {
              align-self: center;
            }
          }

          .btn-secondary:hover {
            background: var(--primary);
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(193, 155, 74, 0.3);
          }
        `}} />
            </main>
        </>
    );
}
