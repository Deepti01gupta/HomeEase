# HomeEase

HomeEase is a trusted household services booking platform. Day 1 establishes a React/Vite frontend and an Express/Mongoose backend for the Customer, Service Provider, and Admin roles that will be added in later iterations.

## Project structure

- `Frontend/` - React frontend, built with Vite and Tailwind CSS.
  - `src/pages/`
    - `LandingPage.jsx` - Landing page with hero, service categories, pro callout, and responsive layout.
    - `ProviderRegister.jsx` - Service Provider registration form with name, phone, skills, experience, and service areas.
    - `LoginPage.jsx` - Login page supporting Provider & Customer roles with 1-click demo login.
    - `ProviderDashboard.jsx` - Provider dashboard with job requests, live status toggling, and earnings metrics.
    - `ProviderProfile.jsx` - Dedicated profile view for editing provider details.
  - `src/components/`
    - `Navbar.jsx` - Responsive top navigation with mobile menu and provider shortcuts.
    - `Footer.jsx` - Dark branding footer.
    - `ProfileForm.jsx` - Reusable provider profile form with live skill & service area tag chips.
  - `src/services/api.js` - API service client connecting to the backend with offline/demo fallbacks.
- `Backend/` - Node.js and Express backend.
  - `config/db.js` - Mongoose connection setup (MongoDB Atlas).
  - `models/Provider.js` - Mongoose model for service providers.
  - `controllers/providerController.js` - Provider registration, login, profile updates, and dashboard stats.
  - `routes/providerRoutes.js` - Provider endpoints mounted at `/api/providers`.
  - `middleware/` - request middleware.
  - `server.js` - Express application setup.
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
