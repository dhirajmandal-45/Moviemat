# MOVIEMAT — Customer site + Admin panel (one project)

React 18 + Vite + Tailwind + React Router + Axios + Recharts + Lucide + Framer Motion + react-hot-toast.

## Run
    npm install
    npm run dev

## One login, two experiences
Open `/login`. The account's role decides where you land:

| Account | Email | Password | Lands on |
|---|---|---|---|
| Admin | admin@moviemat.com | admin123 | `/admin` (admin panel) |
| Customer | aman@example.com | password123 | `/` (customer site) |

New sign-ups (`/signup`) are always customers. `/admin/*` is blocked for non-admins (they are sent to the home page).
Admins can still browse the customer site ("View customer site" in the sidebar), and see an "Admin panel" link in the profile menu.

## Shared data
Customer site and admin panel use the **same** store (`src/services/mockServer.js`, saved in localStorage):
- Add/edit a movie in admin → it appears on the customer site.
- Schedule a show in admin → customers can book it.
- Customer books seats → shows in admin Bookings and the Dashboard revenue.
- Admin cancels a booking → seats are released for others.
- Admin blocks a customer → that customer can no longer log in.

## Connecting a real Spring Boot backend
In `.env` set `VITE_USE_MOCK=false` and `VITE_API_BASE_URL=http://localhost:8080`.
Endpoints expected:

    POST /api/auth/login | /api/auth/signup  -> { token, user:{...,role:'ADMIN'|'CUSTOMER'} }     GET /api/users/me
    GET  /api/movies?status&q  /api/movies/{id}  /api/movies/{id}/reviews  /api/cities  /api/theatres?city
    GET  /api/shows?city&movieId&date  (theatres with shows[])   /api/shows/{id}   /api/shows/{id}/seats
    POST /api/bookings   GET /api/bookings
    Admin (role ADMIN):  GET /api/admin/stats
      /api/admin/movies, /theatres, /shows (GET/POST, PUT for movies+theatres, DELETE)
      GET /api/admin/bookings?q&status   PUT /api/admin/bookings/{id}
      GET /api/admin/users?q             PUT /api/admin/users/{id}

## Structure
    src/
      components/  shared/ (Loading, RouteGuards)  site/ (Navbar, MovieCard, Seat, ...)  admin/ (DataTable, Modal, ...)
      layouts/     SiteLayout, AdminLayout, Sidebar, Topbar
      pages/       site/ (Home ... Profile, Login, Signup)   admin/ (Dashboard, Movies, Theatres, Shows, Bookings, Users)
      services/    *Api.js, http.js, mockServer.js, mockData.js
      context/     AuthContext, BookingContext, UIContext


## Real Spring Boot API

This frontend is configured to use the MovieMat Spring Boot backend by default:

- API base: `http://localhost:8080`
- Mock API: disabled (`VITE_USE_MOCK=false`)
- JWT: stored in `localStorage` as `mm_token` and sent as `Authorization: Bearer <token>`

Start the Spring Boot backend first, then run this frontend with `npm install` and `npm run dev`.

The customer flow is wired to the real auth, movie, city/theatre, show, seat, and booking endpoints. Admin movie/theatre/booking/user requests are also mapped to the backend contracts currently available. Admin show creation still needs the backend screen-list endpoint wired to the UI because the real create-show contract requires a `screenId`.
