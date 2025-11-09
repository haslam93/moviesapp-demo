import PropTypes from 'prop-types';
import MovieCard from './MovieCard.jsx';
import './MovieGrid.css';

export const MovieGrid = ({ items, emptyLabel }) => {
  if (!items.length) {
    return (
      <div className="movie-grid__empty">
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {items.map((movie) => (
        <MovieCard
          key={movie.id ?? movie.externalId ?? movie.title}
          title={movie.title}
          posterUrl={movie.posterUrl}
          year={movie.year}
          rating={movie.rating}
          genres={movie.genres}
          imdbUrl={movie.imdbUrl}
          category={movie.category}
        />
      ))}
    </div>
  );
};

MovieGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  emptyLabel: PropTypes.string
};

MovieGrid.defaultProps = {
  items: [],
  emptyLabel: 'No movies were found for your filters.'
};

export default MovieGrid;
