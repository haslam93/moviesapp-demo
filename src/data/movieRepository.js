import { getDb } from '../db/sqlite.js';

const mapGenres = (genres) => {
  if (Array.isArray(genres)) {
    return genres.join(', ');
  }
  if (typeof genres === 'string') {
    return genres;
  }
  return null;
};

const toImdbUrl = (imdbId) => {
  if (!imdbId) {
    return null;
  }
  return `https://www.imdb.com/title/${imdbId}`;
};

const resolveCategoryId = (db, name, label) => {
  const normalizedLabel = label ?? name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const insertCategory = db.prepare(`
    INSERT INTO categories (name, label)
    VALUES (?, ?)
    ON CONFLICT(name) DO UPDATE SET label = excluded.label;
  `);
  insertCategory.run(name, normalizedLabel);
  const selectCategory = db.prepare('SELECT id FROM categories WHERE name = ? LIMIT 1;');
  const category = selectCategory.get(name);
  return category?.id;
};

export const ensureCategories = (categories) => {
  const db = getDb();
  const insertCategory = db.prepare(`
    INSERT INTO categories (name, label)
    VALUES (@name, @label)
    ON CONFLICT(name) DO UPDATE SET label = excluded.label;
  `);
  const insertMany = db.transaction((rows) => {
    rows.forEach((row) => insertCategory.run(row));
  });
  insertMany(categories);
};

export const storeMoviesForCategory = ({ categoryName, categoryLabel, movies }) => {
  const db = getDb();
  const categoryId = resolveCategoryId(db, categoryName, categoryLabel);
  if (!categoryId) {
    throw new Error(`Failed to resolve category id for ${categoryName}`);
  }

  const upsertMovie = db.prepare(`
    INSERT INTO movies (
      external_id,
      category_id,
      title,
      description,
      poster_url,
      imdb_url,
      year,
      rating,
      runtime_minutes,
      genres
    ) VALUES (
      @external_id,
      @category_id,
      @title,
      @description,
      @poster_url,
      @imdb_url,
      @year,
      @rating,
      @runtime_minutes,
      @genres
    )
    ON CONFLICT(external_id, category_id) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      poster_url = excluded.poster_url,
      imdb_url = excluded.imdb_url,
      year = excluded.year,
      rating = excluded.rating,
      runtime_minutes = excluded.runtime_minutes,
      genres = excluded.genres;
  `);

  const toRow = (movie) => ({
    external_id: String(movie.id ?? movie.imdbId ?? movie.title),
    category_id: categoryId,
    title: movie.title,
    description: movie.plot ?? movie.overview ?? movie.description ?? movie.shortDescription ?? null,
    poster_url: movie.posterURL ?? movie.posterUrl ?? movie.poster ?? null,
    imdb_url: toImdbUrl(movie.imdbId ?? movie.imdbID),
    year: Number.parseInt(movie.year ?? movie.releaseDate, 10) || null,
    rating: movie.imdbRating ? Number.parseFloat(movie.imdbRating) : null,
    runtime_minutes: movie.runtime ? Number.parseInt(movie.runtime, 10) : null,
    genres: mapGenres(movie.genres ?? movie.genre)
  });

  const transaction = db.transaction((items) => {
    items.forEach((item) => upsertMovie.run(toRow(item)));
  });

  transaction(movies ?? []);
};

export const findMovies = ({ category, searchTerm, limit = 24, offset = 0 } = {}) => {
  const db = getDb();
  const filters = [];
  const params = {};

  if (category) {
    filters.push('c.name = @category');
    params.category = category;
  }

  if (searchTerm) {
    filters.push('(LOWER(m.title) LIKE @query OR LOWER(m.genres) LIKE @query)');
    params.query = `%${searchTerm.toLowerCase()}%`;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const stmt = db.prepare(`
    SELECT m.id,
           m.external_id as externalId,
           m.title,
           m.description,
           m.poster_url as posterUrl,
           m.imdb_url as imdbUrl,
           m.year,
           m.rating,
           m.runtime_minutes as runtimeMinutes,
           m.genres,
           c.name as category,
           c.label as categoryLabel
    FROM movies m
    JOIN categories c ON c.id = m.category_id
    ${whereClause}
    ORDER BY m.updated_at DESC
    LIMIT @limit OFFSET @offset;
  `);

  return stmt.all({ ...params, limit, offset });
};

export const countMovies = ({ category, searchTerm } = {}) => {
  const db = getDb();
  const filters = [];
  const params = {};

  if (category) {
    filters.push('c.name = @category');
    params.category = category;
  }
  if (searchTerm) {
    filters.push('(LOWER(m.title) LIKE @query OR LOWER(m.genres) LIKE @query)');
    params.query = `%${searchTerm.toLowerCase()}%`;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const stmt = db.prepare(`
    SELECT COUNT(1) as total
    FROM movies m
    JOIN categories c ON c.id = m.category_id
    ${whereClause};
  `);

  const result = stmt.get(params);
  return result?.total ?? 0;
};

export const findMovieById = (id) => {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT m.id,
           m.external_id as externalId,
           m.title,
           m.description,
           m.poster_url as posterUrl,
           m.imdb_url as imdbUrl,
           m.year,
           m.rating,
           m.runtime_minutes as runtimeMinutes,
           m.genres,
           c.name as category,
           c.label as categoryLabel
    FROM movies m
    JOIN categories c ON c.id = m.category_id
    WHERE m.id = @id
    LIMIT 1;
  `);
  return stmt.get({ id });
};

export const listCategories = () => {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT name, label FROM categories ORDER BY label ASC;
  `);
  return stmt.all();
};

export const clearAllData = () => {
  const db = getDb();
  db.exec('DELETE FROM movies;');
  db.exec('DELETE FROM sqlite_sequence WHERE name IN (\'movies\', \'categories\');');
};
