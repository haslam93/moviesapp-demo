import PropTypes from 'prop-types';
import MovieCard from './MovieCard.jsx';
import './FeaturedRow.css';

export const FeaturedRow = ({ items }) => (
  <section className="featured-row" aria-label="Featured movies">
    <header className="featured-row__header">
      <h2>Spotlight</h2>
      <p>Hand-picked highlights from across the catalog.</p>
    </header>
    <div className="featured-row__list">
      {items.map((movie) => {
        const imdbUrl = movie.imdbUrl ?? (movie.imdbId ? `https://www.imdb.com/title/${movie.imdbId}` : undefined);
        return (
          <MovieCard
            key={`${movie.id ?? movie.imdbId}-${movie.spotlightCategory ?? movie.category}`}
            title={movie.title}
            posterUrl={movie.posterURL ?? movie.posterUrl ?? movie.poster}
            year={movie.year}
            rating={movie.imdbRating}
            genres={Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
            imdbUrl={imdbUrl}
            category={movie.spotlightCategory ?? movie.category}
          />
        );
      })}
    </div>
  </section>
);

FeaturedRow.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object)
};

FeaturedRow.defaultProps = {
  items: []
};

export default FeaturedRow;
