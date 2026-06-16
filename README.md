# Grace Community Church — Church Management System

A complete MERN stack church management system built for a single church deployment (not multi-tenant SaaS).

## Tech Stack

- **Frontend:** React 18 (functional components + hooks), React Router 6, Tailwind CSS, Recharts, React Hot Toast, Vite, PWA (vite-plugin-pwa)
- **Backend:** Node.js, Express.js (ES Modules), MongoDB + Mongoose, JWT Authentication, bcrypt
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize, input validation

## Project Structure

```
church-app/
├── server/                  # Express API (ES Modules)
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/mpesaService.js
│   ├── app.js
│   └── server.js
├── client/                  # React + Vite frontend (PWA enabled)
│   ├── public/
│   │   ├── icons/            (PWA icons, 72px–512px)
│   │   ├── favicon.svg / favicon.ico
│   │   └── offline.html
│   └── src/
│       ├── components/{common,admin,public}
│       ├── context/ (AuthContext, SettingsContext)
│       ├── layouts/ (PublicLayout, AdminLayout)
│       ├── pages/{public,admin}
│       ├── routes/ProtectedRoute.jsx
│       └── services/api.js
└── package.json (root, runs both concurrently)
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Install dependencies
```bash
npm run install-all
```
This installs root, server, and client dependencies.

### 2. Configure environment variables
Copy `server/.env.example` to `server/.env` and fill in:
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — a long random string
- `MPESA_*` — your Safaricom Daraja API credentials (sandbox or production)

A working `.env` with development defaults is already included for local MongoDB at `mongodb://localhost:27017/church_management`.

### 3. Run in development
```bash
npm run dev
```
This starts the API on `http://localhost:5000` and the React app on `http://localhost:5173` (Vite proxies `/api` to the backend).

### 4. Default accounts (auto-seeded on first run)
| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Admin  | admin@church.com   | Admin@1234   |
| Pastor | pastor@church.com  | Pastor@1234  |

**Change these passwords immediately after first login** via the admin panel (`Settings` is admin-only; password change is via `PUT /api/auth/password`, can be wired into a profile page).

## Key Features

### Public Website
- Modern hero section with gradient overlay, CTAs for "Become a Member" and "Give via M-Pesa"
- About, Vision/Mission, Service Times, Pastor's message
- Events & Announcements page (driven by the Notifications system)
- Fully responsive, mobile-first

### Member Registration (Public)
- Multi-step form: Personal Info → Emergency Contact → Ministry Interest
- Stores to MongoDB, shows success screen

### M-Pesa Giving
- Dynamic donation categories (admin-managed — see Settings)
- STK Push initiation via Daraja API (`POST /api/payments/stkpush`)
- Callback endpoint (`POST /api/payments/callback`) updates payment status
- Live status polling on the frontend after submission
- **Note:** Without real Daraja credentials, the donation is still recorded as "Pending" and the UI gracefully informs the user — no crash.

### Admin Portal (`/admin/login`)
- JWT auth, role-based access (admin / pastor / staff)
- **Dashboard:** stat cards (members, total/monthly donations, pending/successful payments), pie chart (donations by category), bar chart (monthly trend)
- **Members:** search, view, edit, soft-delete, full profile with donation history
- **Donations:** search/filter by category, status, date range; CSV export
- **Notifications:** admin/pastor can create, edit, publish/unpublish, delete announcements — shown on the public Events page and homepage banner
- **Reports:** printable donation & membership reports with charts
- **Settings (admin only):**
  - Church info, contact, social links, M-Pesa paybill
  - Service times (add/remove)
  - **Dynamic donation categories** — add or remove categories used on the public Give page
  - **Dynamic ministries** — add or remove ministries shown on the registration form
- **Users (admin only):** create additional admin/pastor/staff accounts

### Progressive Web App (PWA)
- Installable on mobile/desktop (manifest + service worker via vite-plugin-pwa)
- Offline caching for settings and notifications (stale-while-revalidate / network-first)
- Install prompt banner + offline indicator banner
- App shortcuts to "Give via M-Pesa" and "Become a Member"

## Notification / Announcement System
Pastors and admins can post announcements (general, event, project, prayer, urgent) with priority levels. Published notifications appear:
- In a scrolling banner on the homepage
- As cards on the public Events & Announcements page
- Support expiry dates, action links, and view counts

## M-Pesa Daraja Integration Notes
To go live with real M-Pesa payments:
1. Register an app on the [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Get your Consumer Key, Consumer Secret, Passkey, and Shortcode
3. Set `MPESA_ENV=production` and fill in all `MPESA_*` vars in `server/.env`
4. Set `MPESA_CALLBACK_URL` to a publicly accessible HTTPS URL (use ngrok for testing)

## Security Checklist (implemented)
- [x] Passwords hashed with bcrypt (12 rounds)
- [x] JWT-based authentication with expiry
- [x] Role-based route protection (admin/pastor/staff)
- [x] Helmet HTTP headers
- [x] express-rate-limit (200 req / 15 min per IP on `/api`)
- [x] express-mongo-sanitize (NoSQL injection protection)
- [x] Input validation on registration & donation endpoints
- [x] CORS restricted to client origin

## Building for Production
```bash
npm run build      # builds the client into client/dist
```
Serve `client/dist` via your preferred static host / reverse proxy, and run `server/server.js` with `NODE_ENV=production` behind a process manager (PM2) and HTTPS.
