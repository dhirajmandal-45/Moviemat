# MovieMat frontend (React + Vite)

1. Start the backend (see the backend README) so it listens on http://localhost:8080.
2. `npm install`
3. `npm run dev`  -> http://localhost:5173

`.env` controls the API address (`VITE_API_BASE_URL`). Keep `VITE_USE_MOCK=false` to use the real backend.

Logins created by the backend seed:
* Admin: admin@moviemat.com / admin123
* Customer: aman@example.com / password123

Admin flow: Cities are pre-loaded -> add a Theatre (screens + seats are created automatically) -> add a Movie -> Schedule a show.
