import { fetchFeaturedMovies, fetchMoviesByCategory } from '../clients/movieApiClient.js';
import { movieCategories } from '../config/categories.js';
import { config } from '../config/index.js';
import {
  addFavorite,
  countFavorites,
  countMovies,
  ensureCategories,
  findFavorites,
  findMovieById,
  findMovies,
  isFavorite,
  listCategories,
  removeFavorite,
  storeMoviesForCategory
} from '../data/movieRepository.js';

const resolveCategoryMeta = (categoryName) =>
  movieCategories.find((category) => category.name === categoryName) ?? {
    name: categoryName,
    label: categoryName
  };

export const seedReferenceData = () => {
  ensureCategories(movieCategories);
};

export const syncCategoryFromApi = async (categoryName) => {
  const categoryMeta = resolveCategoryMeta(categoryName);
  const movies = await fetchMoviesByCategory(categoryMeta.name);
  storeMoviesForCategory({
    categoryName: categoryMeta.name,
    categoryLabel: categoryMeta.label,
    movies
  });
  return movies.length;
};

export const warmUpCatalog = async () => {
  seedReferenceData();
  const currentCount = countMovies();
  if (currentCount > 0) {
    return { seeded: false, count: currentCount };
  }
  const defaultCategories = [config.externalApi.defaultCategory, 'action-adventure', 'comedy']
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);

  const results = await Promise.allSettled(defaultCategories.map((category) => syncCategoryFromApi(category)));
  const totalImported = results
    .filter((result) => result.status === 'fulfilled')
    .reduce((acc, result) => acc + (result.value ?? 0), 0);
  const finalCount = countMovies();
  return { seeded: true, count: finalCount, imported: totalImported };
};

export const getMovies = async ({ category, searchTerm, page = 1, pageSize = 24, favoritesOnly = false } = {}) => {
  const safePage = Math.max(1, page);
  const limit = pageSize;
  const offset = (safePage - 1) * limit;
  
  if (favoritesOnly) {
    const total = countFavorites();
    const items = findFavorites({ limit, offset });
    return {
      items,
      total,
      page: safePage,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit))
    };
  }

  const total = countMovies({ category, searchTerm });

  if (total === 0) {
    await syncCategoryFromApi(category ?? config.externalApi.defaultCategory);
    return getMovies({ category, searchTerm, page, pageSize });
  }

  const items = findMovies({ category, searchTerm, limit, offset });
  const itemsWithFavorites = items.map((item) => ({
    ...item,
    isFavorite: isFavorite(item.id)
  }));
  
  return {
    items: itemsWithFavorites,
    total,
    page: safePage,
    pageSize: limit,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
};

export const getMovieById = (id) => findMovieById(id);

export const getCategories = () => listCategories();

export const getFeatured = async () => {
  const items = await fetchFeaturedMovies(movieCategories.slice(0, 5));
  return items.slice(0, 12);
};

export const toggleFavorite = (movieId, shouldFavorite) => {
  if (shouldFavorite) {
    addFavorite(movieId);
  } else {
    removeFavorite(movieId);
  }
  return { success: true, isFavorite: shouldFavorite };
};
