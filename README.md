# HomeEase

HomeEase is a trusted household services booking platform. Day 1 establishes a React/Vite frontend and an Express/Mongoose backend for the Customer, Service Provider, and Admin roles that will be added in later iterations.

## Project structure

- `Frontend/` - React frontend, built with Vite.
  - `src/components/`, `pages/`, `layouts/` - reusable UI, page views, and page shells.
  - `src/services/` - Axios API client and API calls.
  - `src/routes/`, `context/`, `hooks/`, `utils/`, `assets/` - routing, shared state, reusable hooks, helpers, and static assets.
- `Backend/` - Node.js and Express backend.
  - `config/db.js` - Mongoose connection setup.
  - `controllers/`, `routes/` - HTTP request handling and route definitions.
  - `middleware/` - request middleware (ready for future authentication and validation).
  - `models/` - Mongoose models (to be added with domain features).
  - `utils/` - backend helpers.
  - `uploads/` - local upload staging area; uploaded files are ignored by Git.
- `Backend/server.js` - Express application setup and server entry point.
- `Backend/.env.example` - required backend environment variable template.

## Run locally

1. Copy `Backend/.env.example` to `Backend/.env` and set `MONGODB_URI` to your MongoDB Atlas connection string.
2. Optionally copy `Frontend/.env.example` to `Frontend/.env` if the API is not running at the default URL.
3. Start the backend:

   ```bash
   cd Backend
   npm run dev
   ```

4. In a second terminal, start the frontend:

   ```bash
   cd Frontend
   npm run dev
   ```

The frontend runs at `http://localhost:5173`, the API runs at `http://localhost:5000`, and the health endpoint is `http://localhost:5000/api/health`.
