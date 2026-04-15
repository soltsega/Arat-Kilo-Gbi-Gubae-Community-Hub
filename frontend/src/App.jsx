import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import BackgroundBlur from './components/Layout/BackgroundBlur';

// Pages
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import ResourcesPage from './pages/ResourcesPage';
import GalleryPage from './pages/GalleryPage';
import LinksPage from './pages/LinksPage';
import CoursesPage from './pages/CoursesPage';
import BahreHasabPage from './pages/BahreHasabPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <BackgroundBlur />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/bahre-hasab" element={<BahreHasabPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}
