import PropTypes from 'prop-types';
import './CategoryFilter.css';

export const CategoryFilter = ({ categories, selected, onSelect }) => (
  <div className="category-filter" role="tablist" aria-label="Movie categories">
    {categories.map((category) => {
      const isActive = (selected ?? '') === category.name;
      const pillStyle = {
        '--pill-active-gradient': category.theme?.gradient,
        '--pill-shadow': category.theme?.glow,
        '--pill-text': category.theme?.onAccent,
        '--pill-hover-border': category.theme?.accentSoft,
        '--pill-icon-tint': category.theme?.accent
      };

      return (
        <button
          key={category.name || 'all'}
          type="button"
          className={`category-filter__pill ${isActive ? 'is-active' : ''}`}
          onClick={() => onSelect(category.name)}
          style={pillStyle}
        >
          <span className="category-filter__icon" aria-hidden="true">
            {category.icon ?? '🎬'}
          </span>
          <span className="category-filter__label">{category.label}</span>
        </button>
      );
    })}
  </div>
);

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      theme: PropTypes.shape({
        gradient: PropTypes.string,
        glow: PropTypes.string,
        onAccent: PropTypes.string,
        accentSoft: PropTypes.string
      })
    })
  ).isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};

CategoryFilter.defaultProps = {
  selected: ''
};

export default CategoryFilter;
