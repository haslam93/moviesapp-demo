import PropTypes from 'prop-types';
import './Pagination.css';

export const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const goTo = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    onChange(nextPage);
  };

  return (
    <nav className="pagination" aria-label="Movie result pages">
      <button type="button" onClick={() => goTo(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button type="button" onClick={() => goTo(page + 1)} disabled={page === totalPages}>
        Next
      </button>
    </nav>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Pagination;
