import { Router } from 'express';
import {
  fetchFeatured,
  getMovie,
  listCategories,
  listMovies,
  refreshCategory,
  updateFavorite
} from '../controllers/movieController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/categories', asyncHandler(listCategories));
router.get('/featured', asyncHandler(fetchFeatured));
router.get('/', asyncHandler(listMovies));
router.get('/:id', asyncHandler(getMovie));
router.post('/categories/:category/sync', asyncHandler(refreshCategory));
router.post('/:id/favorite', asyncHandler(updateFavorite));

export default router;
