<div align="center">
  <img src="assets/img/banner.svg" alt="Arat Kilo Gibi Gubae Banner" width="100%">

  <br>

  <img src="assets/img/separator.svg" alt="Separator" width="100%">

  <p><i>The current web hub for Bible study, resources, leaderboard access, and community connections.</i></p>

  [![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://arat-kilo-gibi-gubae-community-hub.vercel.app/index.html)
  [![Frontend](https://img.shields.io/badge/Frontend-Static_Website-064e3b?style=for-the-badge)](https://arat-kilo-gibi-gubae-community-hub.vercel.app/index.html)
  [![Theme](https://img.shields.io/badge/Theme-Deep_Green_%26_Gold-c19b4a?style=for-the-badge)](https://arat-kilo-gibi-gubae-community-hub.vercel.app/index.html)
</div>

<img src="assets/img/separator.svg" alt="Separator" width="100%">

## Project Overview

This repository contains the current multi-page website for **Arat Kilo Gibi Gubae**.

It is a static front-end site built with **HTML, CSS, and vanilla JavaScript** and focused on Bible study, community communication, quiz results, learning resources, and Orthodox calendar support.

### Live Website

- [Open the deployed site](https://arat-kilo-gibi-gubae-community-hub.vercel.app/index.html)

<img src="assets/img/separator.svg" alt="Separator" width="100%">

## What The Website Currently Does

### Home
- Introduces the community and the purpose of the site.
- Links users into the main sections of the platform.
- Highlights gallery content and general community navigation.

### Results Page
- Displays cumulative Bible study leaderboard views.
- Uses tabbed navigation to switch between leaderboard datasets.
- Loads leaderboard data dynamically from CSV files referenced in the page.
- Shows:
  - podium/top champions
  - searchable ranking table
  - weighted scoring summary
- Uses shared client-side logic from [`assets/js/script.js`](./assets/js/script.js).

### Resources Page
- Splits content into:
  - academic support
  - spiritual resources
- Includes academic placeholders such as subject notes and old exams.
- Links directly to Gospel study materials hosted on Google Docs.
- Tracks chapter/resource links as "read" in the browser using `localStorage`.

### Links Page
- Collects important community and church-related links.
- Includes local community Telegram channels and related external resources.
- Serves as the quick outbound navigation hub for the wider network.

### Gallery Page
- Displays community images from the local `assets/img` folder.
- Uses the shared visual system and gallery interactions already present in the site.

### Courses Page
- Currently acts as a "Coming Soon" page.
- Presents future courses and certifications as planned features, not active functionality.

### Bahre Hasab Page
- Provides a client-side Ethiopian Orthodox calendar calculator.
- Calculates fixed and movable feasts/fasts for a selected Ethiopian year.
- Uses [`assets/js/bahre-hasab.js`](./assets/js/bahre-hasab.js) for the calendar logic and rendering.

### Contact Page
- Shows direct contact options and a feedback form.
- Supports:
  - name and email input
  - subject selection
  - improvement and feature feedback
  - experience rating
  - additional comments
- Sends submissions to a configured Google Apps Script endpoint.
- Includes improved inline status messaging and accessibility-focused form updates.

### Shared Footer
- A shared footer now appears across all pages.
- Includes:
  - brand summary
  - quick links
  - Telegram/location contact links
  - YouTube channel links for related Gibi Gubae communities

<img src="assets/img/separator.svg" alt="Separator" width="100%">

## Current Front-End Stack

| Layer | Current Implementation |
| :--- | :--- |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Shared Assets | [`assets/css/style.css`](./assets/css/style.css), [`assets/js/script.js`](./assets/js/script.js), [`assets/js/bahre-hasab.js`](./assets/js/bahre-hasab.js) |
| Typography | Google Fonts |
| Media | Local assets in [`assets/img`](./assets/img) |
| Deployment Style | Static website |

<img src="assets/img/separator.svg" alt="Separator" width="100%">

## Repository Structure

```text
.
|-- assets/
|   |-- css/
|   |   `-- style.css
|   |-- img/
|   `-- js/
|       |-- bahre-hasab.js
|       `-- script.js
|-- bahre-hasab.html
|-- contact Us.html
|-- courses.html
|-- gallery.html
|-- index.html
|-- links.html
|-- resources.html
|-- results.html
`-- README.md
```

<img src="assets/img/separator.svg" alt="Separator" width="100%">

## Data And Integration Notes

### Leaderboards
- The results page expects CSV leaderboard files under `data/processed/...`.
- The shared script fetches those files in the browser at runtime.

### Contact Form
- The contact form depends on a Google Apps Script URL configured directly in [`contact Us.html`](./contact%20Us.html).
- Feedback submissions are connected through a Google Apps Script workflow.

### Manifest / PWA
- The site includes browser/app-style metadata and PWA-oriented page setup.

<img src="assets/img/separator.svg" alt="Separator" width="100%">

## Python Files In The Repo

The repository also includes Python dependencies in [`requirements.txt`](./requirements.txt) and references to scripts in `.gitignore`, but the checked-in website itself is currently a **static front-end experience**.

Based on the files available in this repo right now:
- the active website is powered primarily by static HTML/CSS/JS
- Python is not required to view the site pages locally
- some data preparation or support scripts may exist outside the currently visible checked-in files

<img src="assets/img/separator.svg" alt="Separator" width="100%">

## Running The Site Locally

Because this is a static site, the simplest way to run it is with a local static server.

Example with Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

<img src="assets/img/separator.svg" alt="Separator" width="100%">

<div align="center">
  <p><b>Maintained for Arat Kilo Gibi Gubae</b></p>
  <p><i>Website hub for study, results, resources, and community links.</i></p>

  <p>
    <a href="https://arat-kilo-gibi-gubae-community-hub.vercel.app/index.html">Live Site</a>
  </p>
</div>
