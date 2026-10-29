# VedaCare — AI Agent for Healthcare Assistant

Scaffold for the full spec, with **working auth** and a **fully built Health Dashboard**
(cards, animated vitals rings, weekly trend charts, dark/light mode, medicine reminder list,
upcoming appointment). Everything else in the original spec (AI chatbot, hospitals map,
medicine CRUD, SOS, profile, health records, multilingual UI) is stubbed with clear
extension points — see "What's next" below.

## Stack in this scaffold
- **Backend**: Node + Express + Mongoose (MongoDB Atlas) + JWT + bcrypt
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion + Recharts + React Router

## Getting started

### 1. Backend
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET at minimum
npm install
npm run dev                # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

Sign up for an account in the UI, and you'll land on the dashboard. Vitals/activity data
comes from a mock endpoint (`GET /api/dashboard/snapshot`) — swap it for a real
`HealthRecords`/vitals collection once you have a data source (wearable, manual entry, etc).

## What's implemented
- **Auth**: signup (with strong-password, email, phone validation + bcrypt hashing),
  login (JWT), logout, forgot-password (OTP generated & logged server-side — wire up
  `nodemailer` with your SMTP_* env vars to actually send it), reset-password.
- **Protected routes**: `middleware/authMiddleware.js` (`protect`, `authorize` for roles).
- **User model**: covers profile fields from the spec (age, gender, blood group, medical
  history, allergies, address, emergency contact, preferred language, photo) plus role
  (`elderly` / `caregiver` / `admin`).
- **Dashboard**: health cards (heart rate, BP, oxygen, temperature), animated vitals rings
  for steps/water/sleep, medicine reminder list, upcoming appointment, weekly trend charts,
  dark/light theme toggle, glassmorphic cards, responsive layout.

## What's next (stub points already left in the code)
- `POST /api/chat` — wire up Gemini using `GEMINI_API_KEY` / `GEMINI_MODEL` in `backend/.env`.
  Suggested shape: a `chatController.js` that calls the Gemini API, persists to an
  `AIConversations` collection, and always returns a "not a substitute for a doctor"
  disclaimer alongside the reply.
- `GET /api/nearby-hospitals` — Google Places Nearby Search from the user's geolocation,
  using `VITE_GOOGLE_MAPS_API_KEY` on the frontend for the map + `GOOGLE_MAPS_API_KEY` on
  the backend if you proxy Places requests server-side (recommended, keeps the key off the client for that call).
- `Medicine` CRUD routes (`POST/GET/PUT/DELETE /api/medicine`) — model + routes matching
  the `dashboardRoutes.js` pattern already in the repo.
- **Emergency SOS** — an endpoint that logs to `EmergencyLogs`, notifies the caregiver
  (email/SMS), and shares live location.
- **Multilingual UI** — `react-i18next` is a good fit; `preferredLanguage` is already a
  User field to seed the initial locale.
- **Health Records upload** — `multer` is already a backend dependency; add a route that
  stores files (local disk for dev, S3/Cloud storage for production) and a `HealthRecords`
  model referencing the user.

## Notes
- No real API keys are included — `.env.example` files in both `backend/` and `frontend/`
  list every placeholder you need to fill in (MongoDB Atlas URI, JWT secret, Gemini key,
  Google Maps key, SMTP credentials).
- Frontend build passes (`npm run build`, verified while producing this scaffold).
- Backend files are syntax-checked but need your real MongoDB URI to run end-to-end locally.
