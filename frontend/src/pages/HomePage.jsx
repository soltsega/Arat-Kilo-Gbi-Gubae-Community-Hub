import { Link } from 'react-router-dom';

/**
 * Home page — Hero section, feature cards grid, and gallery preview.
 */
export default function HomePage() {
  const galleryImages = [
    { src: '/assets/img/gallery-1.jpg', alt: 'የህብረት ጉዞ' },
    { src: '/assets/img/gallery-2.jpg', alt: 'ጸሎትና ዝማሬ' },
    { src: '/assets/img/gallery-3.jpg', alt: 'የጋራ ትምህርት' },
    { src: '/assets/img/gallery-4.png', alt: 'ልዩ መርሐግብር' },
    { src: '/assets/img/gallery-5.png', alt: 'የጋራ ዝማሬ' },
    { src: '/assets/img/gallery-6.jpg', alt: 'የህብረት ጊዜ' },
    { src: '/assets/img/gallery-7.jpg', alt: 'ስነ-ጽሁፍ' },
  ];

  const verticalImages = [
    { src: '/assets/img/gallery-8.jpg', alt: 'የገዳም ጉብኝት', wide: true },
    { src: '/assets/img/gallery-9.jpg', alt: 'የአንድነት ጸሎት' },
    { src: '/assets/img/gallery-10.jpg', alt: 'የህብረት ፎቶ' },
    { src: '/assets/img/gallery-11.jpg', alt: 'ሥነ-ሥርዓተ ጸሎት' },
    { src: '/assets/img/gallery-12.jpg', alt: 'መንፈሳዊ ጉዞ' },
  ];

  return (
    <main id="main" className="container">
      <section className="hero">
        <h2>Welcome to Arat Kilo Gibi Gubae</h2>
        <p>
          Your portal for academic excellence and spiritual wisdom. Track your progress, find resources, and stay connected.
        </p>

        <div className="feature-grid">
          <Link to="/results" className="feature-card">
            <h3>Latest Results</h3>
            <p>Check the cumulative leaderboard and see who's leading the way in our latest quizzes.</p>
          </Link>
          <Link to="/resources" className="feature-card">
            <h3>Resources</h3>
            <p>Access spiritual guides, academic materials, and session notes from our recent gatherings.</p>
          </Link>
          <Link to="/links" className="feature-card">
            <h3>Quick Links</h3>
            <p>Social media channels, registration forms, and important community platforms.</p>
          </Link>
          <Link to="/courses" className="feature-card">
            <h3>Courses</h3>
            <p>Coming Soon! certification programs and spiritual growth courses.</p>
          </Link>
          <Link to="/bahre-hasab" className="feature-card">
            <h3>ባህረ ሐሳብ</h3>
            <p>Calculate Ethiopian Orthodox movable holidays and fasts for any year.</p>
          </Link>
        </div>

        {/* Gallery Preview Section */}
        <section className="gallery-preview">
          <div className="section-header">
            <h2>Memorable Moments</h2>
            <p>A glimpse into our vibrant community and spiritual gatherings.</p>
          </div>

          {/* Horizontal Scroll Gallery */}
          <div className="gallery-scroll">
            {galleryImages.map((img, index) => (
              <Link to="/gallery" className="gallery-item" key={index}>
                <img src={img.src} alt={img.alt} />
                <div className="gallery-overlay">
                  <span>{img.alt}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Vertical Gallery Grid */}
          <div className="gallery-vertical">
            <Link to="/gallery" className="gallery-item wide">
              <img src={verticalImages[0].src} alt={verticalImages[0].alt} />
              <div className="gallery-overlay">
                <span>የህብረት ጉዞ</span>
              </div>
            </Link>
            <div className="gallery-grid-mini">
              {verticalImages.slice(1).map((img, index) => (
                <Link to="/gallery" className="gallery-item" key={index}>
                  <img src={img.src} alt={img.alt} />
                  <div className="gallery-overlay">
                    <span>የህብረት ጉዞ</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="view-more">
            <Link to="/gallery" className="btn-primary">Explore Full Gallery</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
