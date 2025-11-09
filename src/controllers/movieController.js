import {
  getCategories,
  getFeatured,
  getMovieById,
  getMovies,
  syncCategoryFromApi,
  toggleFavorite
} from '../services/movieService.js';
import { badRequest, notFound } from '../utils/httpError.js';

export const listCategories = async (req, res) => {
  const categories = getCategories();
  res.json({ categories });
};

export const listMovies = async (req, res) => {
  const { category, search, page, pageSize, favorites } = req.query;
  const pageNumber = page ? Number.parseInt(page, 10) : 1;
  const sizeNumber = pageSize ? Number.parseInt(pageSize, 10) : 24;
  const favoritesOnly = favorites === 'true';
  const result = await getMovies({
    category: category ?? undefined,
    searchTerm: search ?? undefined,
    page: Number.isNaN(pageNumber) ? 1 : pageNumber,
    pageSize: Number.isNaN(sizeNumber) ? 24 : sizeNumber,
    favoritesOnly
  });
  res.json(result);
};

export const fetchFeatured = async (req, res) => {
  const items = await getFeatured();
  res.json({ items });
};

export const getMovie = async (req, res) => {
  const { id } = req.params;
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    throw badRequest('Movie id must be a number');
  }
  const movie = getMovieById(numericId);
  if (!movie) {
    throw notFound(`Movie with id ${numericId} not found`);
  }
  res.json(movie);
};

export const refreshCategory = async (req, res) => {
  const { category } = req.params;
  if (!category) {
    throw badRequest('Category is required');
  }
  const imported = await syncCategoryFromApi(category);
  res.json({ message: `Category ${category} synced`, imported });
};

export const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { isFavorite } = req.body;
  
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    throw badRequest('Movie id must be a number');
  }
  
  if (typeof isFavorite !== 'boolean') {
    throw badRequest('isFavorite must be a boolean');
  }
  
  const movie = getMovieById(numericId);
  if (!movie) {
    throw notFound(`Movie with id ${numericId} not found`);
  }
  
  const result = toggleFavorite(numericId, isFavorite);
  res.json(result);
};
