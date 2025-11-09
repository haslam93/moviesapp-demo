import PropTypes from 'prop-types';
import './SearchBar.css';

export const SearchBar = ({ value, onChange, placeholder }) => (
  <label className="search-bar" htmlFor="movie-search">
    <span className="search-bar__icon" aria-hidden="true">🔍</span>
    <input
      id="movie-search"
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </label>
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

SearchBar.defaultProps = {
  placeholder: 'Search for your next movie night'
};

export default SearchBar;
