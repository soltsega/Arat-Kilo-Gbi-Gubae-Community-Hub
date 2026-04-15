# 📋 Arat Kilo Gibi Gubae — Future Improvements

This document tracks the planned enhancements for the fullstack migration of the community website. 

## 🔴 High Priority: Security & Essential Tools
- [ ] **Admin Dashboard**
    - Build a password-protected page at `/admin`.
    - Allow authorized users to view/manage contact form submissions.
    - Export messages to CSV/Excel for offline records.
- [ ] **Spam Mitigation**
    - Add a "Honeypot" field to the Contact Form to block basic bots.
    - Implement rate limiting on the `/api/contact` endpoint.
- [ ] **Data Integrity**
    - Add Pydantic validation to the contact form backend to ensure clean data.

## 🟡 Medium Priority: Performance & Features
- [ ] **Server-Side Caching**
    - Cache leaderboard JSON for 5-10 minutes to reduce file system I/O.
    - Use `FastAPI-cache` or a simple in-memory dictionary.
- [ ] **OpenGraph (OG) Meta Tags**
    - Add dynamic meta tags for social media previews (Telegram, WhatsApp).
    - Create a custom preview image for the site link.
- [ ] **Mobile Touch Optimization**
    - Improve the Bahre Hasab table scrolling on iOS/Android.
    - Ensure all buttons have minimum click targets of 44px.

## 🟢 Low Priority: UX Polish
- [ ] **Theme Switcher**
    - Add a toggle for manual Light/Dark mode switching.
- [ ] **Results Freshness**
    - Display "Last Updated" timestamps at the top of the Results tables.
- [ ] **PDF Export**
    - Add a "Download Results" button for students.

---
*Created: 2026-04-16*
