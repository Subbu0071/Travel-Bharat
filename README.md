# TravelBharat

TravelBharat is a full-stack tourism discovery platform for exploring India state by state. It now includes a React frontend, Express backend APIs, JWT-protected admin actions, MongoDB-ready models, searchable destination data, state/city/category filters, and destination detail routes.

## Current Architecture

- `client/` - React + Vite frontend
- `server/` - Node.js + Express API
- `server/src/models/` - MongoDB/Mongoose data models
- `server/src/store/` - MongoDB store plus in-memory demo fallback
- `PRD.md` - project requirements documentation

The app runs without MongoDB for demos. If `MONGO_URI` is provided, the backend seeds MongoDB and uses it as the database.

## Run Locally

Install dependencies:

```powershell
npm install
npm run install:all
```

Start backend and frontend together:

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:5174
```

Backend health check:

```text
http://127.0.0.1:5000/api/health
```

## Demo Admin

```text
Email: admin@travelbharat.local
Password: TravelBharat@123
```

Change these values before production deployment using environment variables.

## Environment Variables

Copy `server/.env.example` to `server/.env`.

```text
PORT=5000
CLIENT_ORIGIN=http://127.0.0.1:5174
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@travelbharat.local
ADMIN_PASSWORD=TravelBharat@123
MONGO_URI=mongodb+srv://...
```

## Implemented Features

- State-wise and city-wise destination discovery
- Search and filters by state, city, and category
- Destination detail pages with gallery, best time, timings/fees, map link, and nearby attractions
- Admin login with JWT authentication
- Protected add/edit/delete destination API routes
- Admin record search, record counters, verified/featured flags, and image previews
- Local demo image upload via browser preview data URLs
- MongoDB-ready destination and admin models
- Responsive UI for mobile, tablet, and desktop

## Next Prize-Level Enhancements

- Cloudinary image upload
- Map-based exploration with Leaflet or Google Maps
- Itinerary planner
- Hindi and regional language support
- Production deployment on Vercel + Render/Railway + MongoDB Atlas
