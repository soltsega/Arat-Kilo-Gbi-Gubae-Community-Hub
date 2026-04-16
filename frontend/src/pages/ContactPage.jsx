import { useState } from 'react';
import { submitContactForm } from '../services/api';

/**
 * Contact Us page — Contact info cards and feedback form.
 * Submits to FastAPI backend → SQLite.
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', improvements: '', features: '', experience: '', message: '',
    honeypot: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await submitContactForm(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', improvements: '', features: '', experience: '', message: '' });
    } catch (err) {
      // Show the actual error message from the backend if available
      const msg = err.message || 'We could not verify your submission.';
      setError(`Submission Failed: ${msg}. Please check your information and try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({ name: '', email: '', subject: '', improvements: '', features: '', experience: '', message: '', honeypot: '' });
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <header>
        <div className="container">
          <h1>Contact Us</h1>
          <p className="subtitle">We value your feedback and suggestions</p>
        </div>
      </header>

      <main className="container">
        <section className="hero secondary-hero">
          <p>Your feedback helps us improve and grow. Whether you have suggestions for new features, improvements to existing functionality, or general comments about your experience, we'd love to hear from you.</p>
        </section>

        {/* Contact Information */}
        <section className="contact-info-section">
          <h2>Get in Touch</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13 9-5 9 5"></path>
                </svg>
              </div>
              <div className="contact-content">
                <h3>Telegram</h3>
                <a href="https://t.me/gubaeze4k" target="_blank" rel="noopener noreferrer" className="contact-link">@gubaeze4k</a>
                <span className="contact-label">Community Channel</span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10 5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div className="contact-content">
                <h3>Location</h3>
                <a href="https://maps.app.goo.gl/uQji4xtGEvLBAoFf6" target="_blank" rel="noopener noreferrer" className="contact-link">
                  Arat Kilo, Addis Ababa
                </a>
                <span className="contact-label">Physical Location</span>
              </div>
            </div>
          </div>
        </section>

        {/* Review Form */}
        <section className="review-section">
          <h2>Share Your Feedback</h2>
          <div className="review-form-container">
            <form id="reviewForm" className="review-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" name="name" required placeholder="Enter your full name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" required placeholder="your.email@example.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              {/* Honeypot field - visually hidden to catch bots */}
              <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }} aria-hidden="true">
                <input 
                  type="text" 
                  name="honeypot" 
                  tabIndex="-1" 
                  autoComplete="off" 
                  value={formData.honeypot} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Website Feedback</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="suggestion">Improvement Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="improvements">Areas for Improvement</label>
                <textarea id="improvements" name="improvements" rows="3" placeholder="What aspects of the website could be improved?" value={formData.improvements} onChange={handleChange}></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="features">Suggested Features</label>
                <textarea id="features" name="features" rows="3" placeholder="What new features would you like to see?" value={formData.features} onChange={handleChange}></textarea>
              </div>

              <fieldset className="form-group experience-group">
                <legend>Overall Experience</legend>
                <div className="rating-container" role="radiogroup" aria-label="Overall Experience">
                  <div className="rating-options">
                    {['excellent', 'good', 'average', 'poor'].map((val) => (
                      <label key={val} className="rating-option">
                        <input type="radio" name="experience" value={val} checked={formData.experience === val} onChange={handleChange} />
                        <span className="rating-label">{val.charAt(0).toUpperCase() + val.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>

              <div className="form-group">
                <label htmlFor="message">Additional Comments</label>
                <textarea id="message" name="message" rows="4" placeholder="Any other thoughts, feedback, or messages..." value={formData.message} onChange={handleChange}></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={clearForm}>Clear Form</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>

              {error && (
                <div className="form-status is-error" role="status" aria-live="polite">{error}</div>
              )}
            </form>

            {success && (
              <div className="success-message" style={{ display: 'block' }}>
                <div className="success-content">
                  <div className="success-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3>Thank You!</h3>
                  <p>Your feedback has been submitted successfully. We appreciate your time and input.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
