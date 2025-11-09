import { useEffect, useMemo, useState } from 'react';
import {
  fetchCategories,
  fetchFeaturedMovies,
  fetchMovies
} from './api/movieApi.js';
import CategoryFilter from './components/CategoryFilter.jsx';
import FeaturedRow from './components/FeaturedRow.jsx';
import MovieGrid from './components/MovieGrid.jsx';
import Pagination from './components/Pagination.jsx';
import SearchBar from './components/SearchBar.jsx';
import { useDebouncedValue } from './hooks/useDebouncedValue.js';
import { categoryThemes, resolveCategoryTheme } from './theme/categoryThemes.js';
import './App.css';

const MOVIES_PER_PAGE = 24;

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [moviesResult, setMoviesResult] = useState({ items: [], totalPages: 1, total: 0, page: 1 });
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const themedCategories = useMemo(
    () =>
      categories.map((category) => {
        const theme = resolveCategoryTheme(category.name);
        return {
          ...category,
          icon: theme.icon,
          theme
        };
      }),
    [categories]
  );

  const filterOptions = useMemo(() => {
    const allTheme = categoryThemes.default;
    return [
      {
        name: '',
        label: 'All',
        icon: allTheme.icon,
        theme: allTheme
      },
      ...themedCategories
    ];
  }, [themedCategories]);

  const activeTheme = useMemo(
    () => resolveCategoryTheme(selectedCategory || undefined),
    [selectedCategory]
  );

  const themeStyle = useMemo(
    () => ({
      '--accent-gradient': activeTheme.gradient,
      '--accent-color': activeTheme.accent,
      '--accent-soft': activeTheme.accentSoft,
      '--surface-strong': activeTheme.surface,
      '--surface-card': activeTheme.cardBackground,
      '--surface-border': activeTheme.cardBorder,
      '--muted-foreground': activeTheme.muted,
      '--hero-background': activeTheme.heroBackground,
      '--hero-glow': activeTheme.glow,
      '--on-accent': activeTheme.onAccent,
      '--page-background': activeTheme.pageBackground,
      '--badge-color': activeTheme.badge,
      '--link-hover': activeTheme.linkHover,
      '--shadow-color': activeTheme.glow,
      '--pill-hover-border': activeTheme.cardBorder,
      '--pill-shadow': activeTheme.glow,
      '--pill-active-gradient': activeTheme.gradient,
      '--pill-text': activeTheme.onAccent
    }),
    [activeTheme]
  );

  useEffect(() => {
    if (activeTheme?.pageBackground) {
      document.body.style.setProperty('--page-background', activeTheme.pageBackground);
    }
  }, [activeTheme.pageBackground]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { categories: payload } = await fetchCategories();
        setCategories(payload);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { items } = await fetchFeaturedMovies();
        setFeatured(items);
      } catch (err) {
        console.error('Failed to load featured movies', err);
      }
    };
    loadFeatured();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    let ignore = false;

    const loadMovies = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchMovies({
          category: selectedCategory || undefined,
          search: debouncedSearch || undefined,
          page,
          pageSize: MOVIES_PER_PAGE
        });
        if (!ignore) {
          setMoviesResult({
            items: data.items ?? [],
            totalPages: data.totalPages ?? 1,
            total: data.total ?? 0,
            page: data.page ?? page,
            pageSize: data.pageSize ?? MOVIES_PER_PAGE
          });
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message ?? 'Could not load movies');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [selectedCategory, debouncedSearch, page]);

  const activeCategoryLabel = useMemo(() => {
    if (!selectedCategory) {
      return undefined;
    }
    return categories.find((category) => category.name === selectedCategory)?.label;
  }, [categories, selectedCategory]);

  const headerSubtitle = useMemo(() => {
    if (searchInput) {
      return `Results for "${searchInput}"`;
    }
    return activeCategoryLabel ? `${activeCategoryLabel} films` : 'Explore every genre';
  }, [activeCategoryLabel, searchInput]);

  const searchPlaceholder = useMemo(() => {
    if (searchInput) {
      return 'Refine your search';
    }
    if (activeCategoryLabel) {
      return `Search ${activeCategoryLabel.toLowerCase()} gems`;
    }
    return 'Search across the full catalog';
  }, [activeCategoryLabel, searchInput]);

  return (
    <div className="app-shell" style={themeStyle}>
      <header className="hero">
        <div className="hero__content">
          <span className="hero__badge" aria-hidden="true">
            <span className="hero__badge-icon">{activeTheme.icon}</span>
            Cinemademoapp
          </span>
          <h1>
            Movies that spark
            <span className="hero__accent"> conversation.</span>
          </h1>
          <p className="hero__subtitle">{headerSubtitle}</p>
        </div>
        <div className="hero__actions">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder={searchPlaceholder}
          />
          <span className="hero__actions-helper">Switch filters to change the vibe.</span>
        </div>
      </header>

      <CategoryFilter
        categories={filterOptions}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {featured.length ? <FeaturedRow items={featured} /> : null}

      <section className="movies-section" aria-live="polite">
        <header className="movies-section__header">
          <h2>
            Browse Catalog
            <span>{moviesResult.total} titles</span>
          </h2>
        </header>

        {error ? <div className="alert">{error}</div> : null}

        {loading ? (
          <div className="loader" role="status">
            <span className="loader__spinner" aria-hidden="true" />
            <span>Loading movies…</span>
          </div>
        ) : (
          <MovieGrid items={moviesResult.items} />
        )}

        <Pagination
          page={moviesResult.page ?? page}
          totalPages={moviesResult.totalPages}
          onChange={setPage}
        />
      </section>
    </div>
  );
}

export default App;
