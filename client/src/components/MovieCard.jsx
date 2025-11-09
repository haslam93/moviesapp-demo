import PropTypes from 'prop-types';
import { resolveCategoryTheme } from '../theme/categoryThemes.js';
import './MovieCard.css';

const fallbackPoster = 'https://via.placeholder.com/300x450.png?text=Cinema+Demo';

export const MovieCard = ({ id, title, posterUrl, year, rating, genres, imdbUrl, category, isFavorite, onToggleFavorite }) => {
  const normalizedRating = typeof rating === 'number' ? rating : Number.parseFloat(rating);
  const theme = resolveCategoryTheme(category);

  const cardStyle = {
    '--card-gradient': theme.cardBackground,
    '--card-border': theme.cardBorder,
    '--card-shadow': theme.glow,
    '--card-accent': theme.accent,
    '--card-accent-soft': theme.accentSoft,
    '--card-muted': theme.muted
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(id, !isFavorite);
    }
  };

  return (
    <article className="movie-card" aria-label={title} style={cardStyle}>
      <div className="movie-card__poster">
        <img src={posterUrl || fallbackPoster} alt={`${title} poster`} loading="lazy" />
        <button
          className={`movie-card__favorite ${isFavorite ? 'is-favorite' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
        {Number.isFinite(normalizedRating) ? (
          <span className="movie-card__rating">⭐ {normalizedRating.toFixed(1)}</span>
        ) : null}
      </div>
      <div className="movie-card__content">
        <h3 className="movie-card__title">{title}</h3>
        <p className="movie-card__meta">
          {year ? <span>{year}</span> : null}
          {genres ? <span>{genres}</span> : null}
        </p>
        {imdbUrl ? (
          <a className="movie-card__link" href={imdbUrl} target="_blank" rel="noreferrer">
            View details
          </a>
        ) : null}
      </div>
    </article>
  );
};

MovieCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  posterUrl: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  genres: PropTypes.string,
  imdbUrl: PropTypes.string,
  category: PropTypes.string,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func
};

MovieCard.defaultProps = {
  category: '',
  isFavorite: false
};

export default MovieCard;
