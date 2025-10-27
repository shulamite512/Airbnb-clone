# Codebase Context Map

## Project Overview
This is a full-stack application that appears to be an Airbnb-like property rental platform. The project is structured with separate frontend and backend components.

## Backend Structure (`backend1/`)

### Core Files
- `server.js` - Main server entry point
- `db.js` - Database configuration and connection
- `db_schema.sql` - Database schema definitions

### API Routes (`backend1/routes/`)
- `auth.js` - Authentication endpoints
- `booking.js` - Booking management
- `gallery.js` - Image gallery handling
- `owner.js` - Property owner operations
- `property.js` - Property listing management
- `traveler.js` - Traveler/user management
- `upload.js` - File upload handling

### Middleware (`backend1/middleware/`)
- `authMiddleware.js` - Authentication middleware

### File Storage
- `uploads/` - Directory for uploaded files

## Frontend Structure (`frontend/airbnb-ui/`)

### Core Configuration
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint rules
- `package.json` - Frontend dependencies

### Source Files (`src/`)

#### Core Application Files
- `main.jsx` - Application entry point
- `App.jsx` - Root component
- `App.css` - Global styles
- `index.css` - Global styles

#### Components (`components/`)
- `NavBar.jsx` - Navigation bar component
- `PropertyCard.jsx` - Property display component
- `SearchPill.jsx` - Search interface component

#### Pages (`pages/`)
- `AuthPage.jsx` - Authentication page
- `FavoritesPage.jsx` - User favorites
- `HomePage.jsx` - Main landing page
- `PropertyPage.jsx` - Individual property view
- `ServicesPage.jsx` - Services listing
- `TripsPage.jsx` - User trips management

#### Services (`services/`)
- `ServiceCard.jsx` - Service display component
- `services.data.js` - Services data/configuration
- `ServicesFilters.jsx` - Services filtering component
- `ServicesHero.jsx` - Services hero section

#### API Integration
- `lib/api.js` - API integration and requests

#### Assets
- `assets/` - Static assets storage
- `public/` - Public assets directory

## Additional Components
- `ai_agent.py` - AI integration component

## Technology Stack
- Frontend: React with Vite
- Styling: Tailwind CSS
- Backend: Node.js
- Database: SQL (specific type determined by db_schema.sql)
- Build Tools: Vite, PostCSS
- Linting: ESLint

## Key Features
1. User Authentication
2. Property Listings
3. Booking Management
4. Service Offerings
5. Image Gallery
6. User Favorites
7. Trip Management
8. File Upload Capabilities