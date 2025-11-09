# Cinemademoapp

Cinemademoapp is a demo-ready, multi-layer movie explorer built with an Express API, a React (Vite) frontend, and a local SQLite catalog. It hydrates its catalog from the [SampleAPIs Movies collection](https://api.sampleapis.com/movies) so you can showcase an end-to-end architecture without API keys.

## Highlights

- **Layered Node.js backend** – Express routing layer, controller/service/data separation, and a SQLite persistence layer powered by `better-sqlite3`.
- **External data ingestion** – Fetches curated genres from SampleAPIs and persists them locally for fast browsing.
- **React cinematic UI** – Vite + React 19 app with featured spotlights, search, filters, and responsive movie grids with thumbnails.
- **Zero-config demo** – No third-party API keys required. Everything runs locally with two `npm run dev` commands.

## Project structure

```
.
├── src/                 # Express application
│   ├── config/          # Environment configuration and category metadata
│   ├── controllers/     # HTTP controllers
│   ├── services/        # Business logic and orchestration
│   ├── data/            # SQLite data-access helpers
│   ├── clients/         # External movie API client
│   ├── routes/          # Express routers
│   ├── middleware/      # Shared middleware
│   └── index.js         # Server bootstrap
├── client/              # Vite + React frontend
└── data/                # SQLite database file (auto-created)
```

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### Backend (Express API)

```powershell
cd "c:\Users\hammadaslam\OneDrive - Microsoft\Demos\GH Copilot\Cineplex\sampleapp"
npm install
npm run dev
```

The API boots on `http://localhost:4000`. Key endpoints:

- `GET /api/movies` – Paginated movie catalog (`category`, `search`, `page`, `pageSize` query params)
- `GET /api/movies/categories` – Available genres
- `GET /api/movies/featured` – Spotlight selections
- `POST /api/movies/categories/:category/sync` – Force-refresh a category from the external API

### Frontend (React UI)

```powershell
cd "c:\Users\hammadaslam\OneDrive - Microsoft\Demos\GH Copilot\Cineplex\sampleapp\client"
npm install
npm run dev
```

The Vite dev server starts on `http://localhost:5173` with a proxy to the backend (`/api`). The UI automatically discovers the API via `VITE_API_BASE_URL` (default `http://localhost:4000/api`). Override in a `.env` file if you change ports:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

### Build for production

```powershell
# Backend
npm run start

# Frontend
cd client
npm run build
npm run preview
```

## Customisation notes

- External movie data is sourced from `https://api.sampleapis.com/movies/<category>`; update `src/config/categories.js` to tweak genres.
- The database lives at `data/cinemademoapp.db`. Delete the file to reset the catalog.
- Adjust API defaults (port, timeouts, etc.) via environment variables documented in `src/config/index.js`.

## Next steps

- Add automated tests (service + React component coverage).
- Bundle the frontend with the backend for simplified deployment.
- Schedule periodic background refreshes for the catalog.
