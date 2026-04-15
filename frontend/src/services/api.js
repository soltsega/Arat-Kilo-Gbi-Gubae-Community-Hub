/**
 * API service layer for communicating with the FastAPI backend.
 */

const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling.
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============ Leaderboard API ============

export async function getLeaderboardTabs() {
  return apiFetch('/leaderboard/tabs');
}

export async function getLeaderboard(book) {
  return apiFetch(`/leaderboard/${book}`);
}

// ============ Contact API ============

export async function submitContactForm(formData) {
  return apiFetch('/contact/', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

// ============ Resources API ============

export async function getSpiritualResources() {
  return apiFetch('/resources/spiritual');
}

export async function getAcademicResources() {
  return apiFetch('/resources/academic');
}

// ============ Links API ============

export async function getAllLinks() {
  return apiFetch('/links/all');
}

// ============ Health Check ============

export async function healthCheck() {
  return apiFetch('/health');
}
