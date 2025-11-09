const defaultApiBase = `${window.location.origin.replace(/\/$/, '')}/api`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? defaultApiBase;

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body?.message ?? 'Request failed');
    error.status = response.status;
    error.payload = body;
    throw error;
  }

  return response.json();
};

export const fetchCategories = () => requestJson('/movies/categories');

export const fetchFeaturedMovies = () => requestJson('/movies/featured');

export const fetchMovies = ({ category, search, page, pageSize } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  if (page) params.set('page', page);
  if (pageSize) params.set('pageSize', pageSize);
  const query = params.toString();
  return requestJson(`/movies${query ? `?${query}` : ''}`);
};

export default {
  fetchCategories,
  fetchFeaturedMovies,
  fetchMovies
};
