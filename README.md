# Airbnb Clone - Lab 1 Assignment

A full-stack Airbnb clone built with Node.js, Express.js, MySQL, and React.

## Features

### Traveler Features
- ✅ Signup/Login with secure password hashing (bcrypt)
- ✅ Session-based authentication
- ✅ Profile management (name, email, phone, about me, city, country, languages, gender)
- ✅ Profile picture upload
- ✅ Property search and browsing
- ✅ Property details view with booking
- ✅ Create booking requests (PENDING status)
- ✅ View bookings (Pending, Accepted, Cancelled)
- ✅ Cancel bookings
- ✅ Add/remove favorites
- ✅ Booking history

### Owner Features
- ✅ Signup/Login
- ✅ Profile management
- ✅ Add/edit properties
- ✅ Upload property photos
- ✅ View booking requests
- ✅ Accept bookings (changes status to ACCEPTED, blocks dates)
- ✅ Cancel bookings (changes status to CANCELLED, releases dates)
- ✅ Dashboard with pending requests and previous bookings

### General Features
- ✅ Responsive design (TailwindCSS)
- ✅ Pexels API integration for property images
- ✅ CORS configured
- ✅ RESTful API architecture
- ✅ MySQL database with proper relationships
- ✅ Error handling and validation

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1
- **Database**: MySQL (XAMPP)
- **Authentication**: express-session + bcryptjs
- **File Upload**: Multer
- **Image API**: Pexels API

### Frontend
- **Framework**: React 19.1
- **Routing**: React Router DOM 7.9
- **State Management**: Zustand 5.0
- **Styling**: TailwindCSS 4.1
- **HTTP Client**: Fetch API
- **Build Tool**: Vite 7.1

### AI Agent Service
- **Python**: 3.9 or higher
- **Framework**: FastAPI
- **AI**: LangChain + OpenAI
- **Search**: Tavily API
- **Features**: Day-by-day trip planning, restaurant recommendations, packing checklist

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **XAMPP** (for MySQL database)
- **Git**
- **OpenAI API Key** (for AI agent)
- **Tavily API Key** (for web search)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Lab1
```

### 2. Database Setup

1. **Start XAMPP**:
   - Open XAMPP Control Panel
   - Start Apache and MySQL

2. **Create Database**:
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `airbnb_clone`
   - Import the database schema:

```bash
# In phpMyAdmin, import the SQL file
# Or run from command line:
mysql -u root -p airbnb_clone < db_schema.sql
```

### 3. Backend Setup

```bash
cd backend1

# Install dependencies
npm install

# Start the backend server
node server.js
```

The backend will run on **http://localhost:3001**

### 4. Frontend Setup

```bash
cd airbnb-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:5175** (or similar port)

### 5. AI Agent Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your API keys:
# OPENAI_API_KEY=your_key_here
# TAVILY_API_KEY=your_key_here

# Start the AI agent service
python ai_agent.py
```

The AI agent will run on **http://localhost:8000**

**Get API Keys:**
- OpenAI: https://platform.openai.com/api-keys
- Tavily: https://tavily.com (free tier available)

## Project Structure

```
Lab1/
├── backend1/                 # Backend (Node.js + Express)
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── traveler.js      # Traveler-specific routes
│   │   ├── owner.js         # Owner-specific routes
│   │   ├── property.js      # Property routes
│   │   ├── booking.js       # Booking routes
│   │   ├── upload.js        # File upload routes
│   │   └── gallery.js       # Gallery routes
│   ├── services/
│   │   └── pexelsService.js # Pexels API integration
│   ├── uploads/             # Uploaded files
│   ├── server.js            # Main server file
│   └── package.json
│
├── airbnb-ui/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── NavBar.jsx   # Navigation bar
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Property listing
│   │   │   ├── AuthPage.jsx              # Login/Signup
│   │   │   ├── PropertyDetailPage.jsx    # Property details & booking
│   │   │   ├── FavoritesPage.jsx         # Favorites
│   │   │   ├── TripsPage.jsx             # Traveler bookings
│   │   │   ├── TravelerProfilePage.jsx   # Traveler profile
│   │   │   ├── OwnerDashboardPage.jsx    # Owner dashboard
│   │   │   ├── OwnerPropertiesPage.jsx   # Manage properties
│   │   │   └── ServicesPage.jsx          # Services marketplace
│   │   ├── lib/
│   │   │   └── api.js       # API client
│   │   ├── store/
│   │   │   └── authStore.js # Authentication state
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── db_schema.sql            # Database schema
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Traveler
- `GET /api/traveler/profile` - Get traveler profile
- `PUT /api/traveler/profile` - Update profile
- `GET /api/traveler/favorites` - Get favorites
- `POST /api/traveler/favorites/:propertyId` - Add favorite
- `DELETE /api/traveler/favorites/:propertyId` - Remove favorite
- `GET /api/traveler/history` - Get booking history

### Owner
- `GET /api/owner/profile` - Get owner profile
- `PUT /api/owner/profile` - Update profile
- `GET /api/owner/properties` - Get all properties
- `POST /api/owner/properties` - Create property
- `PUT /api/owner/properties/:id` - Update property
- `GET /api/owner/dashboard` - Get dashboard data

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/search` - Search properties
- `GET /api/properties/:id` - Get property details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/accept` - Accept booking (owner)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Upload
- `POST /api/upload/property/:id` - Upload property photo
- `POST /api/upload/profile` - Upload profile picture

## Usage Guide

### For Travelers

1. **Sign Up**:
   - Click "Log in" in the navbar
   - Switch to "Create a new account"
   - Select "Book places (Traveler)"
   - Fill in your details and sign up

2. **Browse Properties**:
   - View properties on the homepage
   - Click on any property to see details

3. **Make a Booking**:
   - On property details page, select dates and guests
   - Click "Reserve" to create a booking request
   - View your bookings in the "Trips" page

4. **Manage Profile**:
   - Click on your profile icon → "Profile"
   - Update your information and upload a profile picture

5. **Save Favorites**:
   - Click the heart icon on property details
   - View saved properties in "Favourites"

### For Owners

1. **Sign Up**:
   - Create an account with "List my property (Owner)"

2. **Add Property**:
   - Navigate to "Properties" in the navbar
   - Click "+ Add Property"
   - Fill in property details

3. **Manage Bookings**:
   - Go to "Dashboard"
   - View pending booking requests
   - Accept or decline each request

4. **View Properties**:
   - See all your listed properties in "Properties"

## Database Schema

### Users Table
- `id`, `name`, `email`, `password`, `user_type` (traveler/owner)
- `location`, `phone_number`, `about_me`, `city`, `country`
- `languages`, `gender`, `profile_picture`, `created_at`

### Properties Table
- `id`, `owner_id`, `property_name`, `property_type`, `location`
- `description`, `price_per_night`, `bedrooms`, `bathrooms`, `max_guests`
- `amenities`, `photos`, `availability_start`, `availability_end`
- `is_active`, `created_at`

### Bookings Table
- `id`, `property_id`, `traveler_id`, `owner_id`
- `start_date`, `end_date`, `number_of_guests`, `total_price`
- `status` (PENDING/ACCEPTED/CANCELLED), `created_at`

### Blocked Dates Table
- `id`, `property_id`, `booking_id`
- `start_date`, `end_date`

### Favorites Table
- `traveler_id`, `property_id`

## AI Agent Features

✅ **Implemented AI Travel Concierge**:

- **Chatbot UI**: Bottom-right corner button on homepage and dashboards
- **Trip Planning**: Day-by-day itinerary generation based on:
  - Booking context (dates, location, party type)
  - User preferences (budget, interests, mobility needs, dietary filters)
  - Live weather data and local events (via Tavily search)
- **Activity Recommendations**: Morning, afternoon, evening blocks with:
  - Title, address, price tier, duration
  - Accessibility tags (wheelchair-friendly, child-friendly)
- **Restaurant Recommendations**: Filtered by dietary preferences
- **Packing Checklist**: Weather-aware suggestions
- **Natural Language Queries**: Free-text questions about the trip

**To Use:**
1. Start the AI agent service: `python ai_agent.py`
2. Set up your API keys in `.env` (OpenAI + Tavily)
3. Click the chatbot button (🤖) on any page
4. Set your preferences and click "Generate Plan"

## Known Limitations

⚠️ **Remaining Tasks**:

1. **Advanced Search Filters UI** - Partially implemented:
   - Backend API supports location, date, and guest filters
   - Frontend filter UI needs to be added to HomePage search bar

2. **API Documentation** - Not included:
   - Swagger/Postman collection needs to be created

3. **AI Agent requires API keys**:
   - OpenAI API key (paid service)
   - Tavily API key (free tier available)

## Troubleshooting

### Backend won't start
- Ensure XAMPP MySQL is running
- Check if port 3001 is available
- Verify database `airbnb_clone` exists

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check if port 5173/5175 is available

### CORS errors
- Ensure backend is running on port 3001
- Check CORS configuration in `server.js`

### Database connection failed
- Verify XAMPP MySQL is running
- Check database credentials in `server.js`
- Ensure database `airbnb_clone` exists

## Contributors

- [Your Name]

## License

This project is for educational purposes as part of Lab 1 Assignment.

## Submission Checklist

- ✅ Backend (Node.js + Express + MySQL)
- ✅ Frontend (React + TailwindCSS + Vite)
- ✅ Authentication (session-based with bcrypt)
- ✅ Traveler features (profile, favorites, trips, booking)
- ✅ Owner features (dashboard, properties management, booking requests)
- ✅ Booking system (PENDING → ACCEPTED → CANCELLED states)
- ✅ Profile management (complete with country dropdown, profile picture upload)
- ✅ Responsive design (TailwindCSS)
- ✅ README with complete setup instructions
- ✅ **AI Agent Service** (Python + FastAPI + LangChain + Tavily)
  - ✅ Chatbot UI (bottom-right button)
  - ✅ Day-by-day trip planning
  - ✅ Restaurant recommendations
  - ✅ Packing checklist
  - ✅ Natural language queries
- ⚠️ API Documentation (Swagger/Postman) - **TODO**
- ⚠️ Advanced search filters UI on HomePage - **TODO** (backend ready)

## Next Steps

To fully complete the lab:

1. **Set up AI Agent API keys**:
   - Get OpenAI API key
   - Get Tavily API key
   - Add to `.env` file

2. **Test AI Agent**:
   - Run `python ai_agent.py`
   - Click chatbot button on homepage
   - Generate a trip plan

3. **Add API Documentation** (Swagger or Postman collection)

4. **Add search filters UI to HomePage**

5. **Create lab report with screenshots**

6. **Invite reviewers to GitHub repository**:
   - tanyayadavv5@gmail.com
   - smitsaurabh20@gmail.com
