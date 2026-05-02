# Anti-Gravity Student Platform

A modern, full-stack Reddit-style web application exclusive for university students featuring a unique "Anti-Gravity" feed sorting algorithm, multi-language support mockups, and a beautiful "liquid glass" UI.

## Tech Stack
- Frontend: Next.js 14, React, Tailwind CSS, Lucide Icons
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: Google Identity Services + backend Google token verification
- Custom Algorithm: Anti-Gravity exponential decay ranking

## Local Setup

### 1. Database
Run MongoDB locally on `mongodb://127.0.0.1:27017`, or point `backend/.env` to MongoDB Atlas.

### 2. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

### 4. Local URLs
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/api/health`

If `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is empty, the login button falls back to demo login locally. Mock login is disabled in production.

## Production Deploy

### Recommended structure
- Deploy `frontend/` as one Vercel project
- Deploy `backend/` as a second Vercel project
- Set `NEXT_PUBLIC_API_URL` in the frontend to your backend Vercel URL plus `/api`

### Required production services and APIs
- MongoDB Atlas for `MONGO_URI`
- Google Cloud OAuth Web Client for `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- A strong random `JWT_SECRET`

### Backend Vercel environment variables
- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `FRONTEND_URL`

### Frontend Vercel environment variables
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### Google OAuth setup
In Google Cloud Console, create a Web application OAuth client and add:
- Authorized JavaScript origin: your frontend domain
- Authorized redirect URI: not required for the current Google Identity Services button flow

### Vercel notes
- `backend/vercel.json` rewrites all requests to the serverless Express handler
- The frontend now reads its API base URL from `NEXT_PUBLIC_API_URL` instead of hardcoded localhost
- Socket.io is not currently wired for Vercel realtime usage; the current live app flow works over standard HTTP APIs
