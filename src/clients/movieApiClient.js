import axios from 'axios';
import { config } from '../config/index.js';

const api = axios.create({
  baseURL: config.externalApi.baseUrl,
  timeout: config.server.requestTimeoutMs
});

export const fetchMoviesByCategory = async (category) => {
  const response = await api.get(`/${category}`);
  if (!Array.isArray(response.data)) {
    throw new Error(`Unexpected response format from external API for category ${category}`);
  }
  return response.data;
};

export const fetchFeaturedMovies = async (categories) => {
  const chunks = await Promise.allSettled(categories.map((category) => fetchMoviesByCategory(category.name)));
  return chunks.flatMap((result, index) => {
    if (result.status !== 'fulfilled') {
      return [];
    }
    const category = categories[index];
    return (result.value ?? []).slice(0, 5).map((movie) => ({
      ...movie,
      spotlightCategory: category?.name
    }));
  });
};

export default {
  fetchMoviesByCategory,
  fetchFeaturedMovies
};
