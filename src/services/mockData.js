// Seed data for the unified mock store (used only when VITE_USE_MOCK=true, persisted to localStorage).
export const MOVIES = [
  { id: 1, title: 'Midnight Express', status: 'now', rating: 8.4, language: 'Hindi', genre: 'Thriller', duration: '2h 18m', release: '2026-09-12', formats: ['2D', 'IMAX'], color: '#5b3df5', director: 'Ravi Malhotra', cast: ['Arjun Rao', 'Meera Kapoor', 'Kabir Sethi'], description: 'A night train, a missing passenger and six hours to find the truth before the last station.' },
  { id: 2, title: 'Neon Monsoon', status: 'now', rating: 7.9, language: 'Hindi', genre: 'Romance', duration: '2h 05m', release: '2026-09-05', formats: ['2D'], color: '#e0407b', director: 'Tara Bose', cast: ['Ishaan Verma', 'Anaya Sharma'], description: 'Two strangers keep meeting in the rain across one very wet Mumbai season.' },
  { id: 3, title: 'Steel Horizon', status: 'now', rating: 8.1, language: 'English', genre: 'Sci-Fi', duration: '2h 32m', release: '2026-09-19', formats: ['2D', '3D', 'IMAX', '4DX'], color: '#0f9d8a', director: 'Daniel Ford', cast: ['Kay Morgan', 'Leo Hart'], description: 'A crew of engineers races to rebuild a failing orbital city.' },
  { id: 4, title: 'Pink Lane Gang', status: 'now', rating: 7.2, language: 'Hindi', genre: 'Comedy', duration: '2h 01m', release: '2026-09-20', formats: ['2D'], color: '#f59e0b', director: 'Sunil Mehra', cast: ['Riya Jain', 'Pankaj Tiwari'], description: 'Four aunties, one heist, and a wedding that must not be ruined.' },
  { id: 5, title: 'Kaveri', status: 'now', rating: 8.7, language: 'Tamil', genre: 'Drama', duration: '2h 40m', release: '2026-09-10', formats: ['2D'], color: '#2563eb', director: 'Mani Selvan', cast: ['Karthik R', 'Divya S'], description: 'A river, a village and three generations who refuse to leave it.' },
  { id: 6, title: 'Dragon Drift', status: 'now', rating: 7.6, language: 'English', genre: 'Animation', duration: '1h 45m', release: '2026-09-14', formats: ['2D', '3D'], color: '#16a34a', director: 'Priya Nair', cast: ['Voice: Sam Lee', 'Voice: Ava Cruz'], description: 'A young rider and a stubborn dragon enter the sky race of the century.' },
  { id: 7, title: 'Iron Verdict', status: 'now', rating: 7.8, language: 'Telugu', genre: 'Action', duration: '2h 22m', release: '2026-09-18', formats: ['2D', 'IMAX'], color: '#dc2626', director: 'Srinivas Reddy', cast: ['Nikhil Varma', 'Sanjana K'], description: 'A retired judge picks up the fight the courts could not finish.' },
  { id: 8, title: 'Jaipur Junction', status: 'soon', rating: 0, language: 'Hindi', genre: 'Drama', duration: '2h 10m', release: '2026-10-09', formats: ['2D'], color: '#b45309', director: 'Aarti Singh', cast: ['Vikrant Shekhawat', 'Nisha Rathore'], description: 'A station master, a royal secret and one last train out of the old city.' },
  { id: 9, title: 'Echo Chamber', status: 'soon', rating: 0, language: 'English', genre: 'Thriller', duration: '1h 58m', release: '2026-10-16', formats: ['2D', 'IMAX'], color: '#475569', director: 'Mark Ellison', cast: ['Rosa Vale', 'Tom Baxter'], description: 'Every voice you hear online is one you cannot trust.' },
  { id: 10, title: 'Chai & Chaos', status: 'soon', rating: 0, language: 'Hindi', genre: 'Comedy', duration: '2h 00m', release: '2026-10-23', formats: ['2D'], color: '#c2410c', director: 'Neha Gupta', cast: ['Varun Anand', 'Sakshi Dutta'], description: 'A tea stall, a startup, and a very loud family.' },
  { id: 11, title: 'Silent Ragam', status: 'soon', rating: 0, language: 'Kannada', genre: 'Romance', duration: '2h 15m', release: '2026-11-01', formats: ['2D'], color: '#7c3aed', director: 'Lakshmi Rao', cast: ['Yash Gowda', 'Pooja H'], description: 'A musician who lost his hearing finds a melody only she can hear.' },
];
export const CITY_AREAS = {
  Jaipur: ['Vaishali Nagar', 'Malviya Nagar', 'C-Scheme', 'Mansarovar'], Delhi: ['Saket', 'Rajouri Garden', 'Vasant Kunj', 'Dwarka'],
  Mumbai: ['Andheri', 'Bandra', 'Powai', 'Juhu'], Bangalore: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout'],
  Hyderabad: ['Banjara Hills', 'Gachibowli', 'Kukatpally', 'Madhapur'], Chennai: ['T Nagar', 'Adyar', 'Velachery', 'Anna Nagar'],
  Kolkata: ['Salt Lake', 'Park Street', 'Behala', 'New Town'], Pune: ['Kothrud', 'Viman Nagar', 'Hinjewadi', 'Baner'],
  Ahmedabad: ['Satellite', 'Navrangpura', 'Bopal', 'Prahlad Nagar'], Chandigarh: ['Sector 17', 'Sector 35', 'Mohali', 'Panchkula'],
};
export const CITY_STATE = { Jaipur: 'Rajasthan', Delhi: 'Delhi', Mumbai: 'Maharashtra', Bangalore: 'Karnataka', Hyderabad: 'Telangana', Chennai: 'Tamil Nadu', Kolkata: 'West Bengal', Pune: 'Maharashtra', Ahmedabad: 'Gujarat', Chandigarh: 'Chandigarh' };
export const THEATRES = [
  { id: 't1', name: 'INOX', city: 'Jaipur', area: 'Vaishali Nagar', address: 'Vaishali Nagar, Jaipur', screens: 4, facilities: ['Dolby Atmos', 'Recliners', 'Food Court'] },
  { id: 't2', name: 'PVR Cinemas', city: 'Jaipur', area: 'Malviya Nagar', address: 'Malviya Nagar, Jaipur', screens: 6, facilities: ['4K Laser', 'Parking', 'M-Ticket'] },
  { id: 't3', name: 'Cinepolis', city: 'Delhi', area: 'Saket', address: 'Saket, Delhi', screens: 8, facilities: ['IMAX', 'Recliners', 'Wheelchair Access'] },
  { id: 't4', name: 'Miraj Cinemas', city: 'Mumbai', area: 'Andheri', address: 'Andheri, Mumbai', screens: 5, facilities: ['Dolby 7.1', 'Parking'] },
  { id: 't5', name: 'PVR Cinemas', city: 'Bangalore', area: 'Koramangala', address: 'Koramangala, Bangalore', screens: 7, facilities: ['4K Laser', 'Recliners'] },
  { id: 't6', name: 'Cinepolis', city: 'Hyderabad', area: 'Banjara Hills', address: 'Banjara Hills, Hyderabad', screens: 6, facilities: ['IMAX', 'Dolby Atmos'] },
  { id: 't7', name: 'INOX', city: 'Chennai', area: 'T Nagar', address: 'T Nagar, Chennai', screens: 5, facilities: ['Dolby Atmos', 'Parking'] },
  { id: 't8', name: 'PVR Cinemas', city: 'Kolkata', area: 'Salt Lake', address: 'Salt Lake, Kolkata', screens: 6, facilities: ['4K Laser', 'Food Court'] },
  { id: 't9', name: 'Cinepolis', city: 'Pune', area: 'Viman Nagar', address: 'Viman Nagar, Pune', screens: 5, facilities: ['Recliners', 'Parking'] },
  { id: 't10', name: 'INOX', city: 'Ahmedabad', area: 'Satellite', address: 'Satellite, Ahmedabad', screens: 4, facilities: ['Dolby 7.1', 'M-Ticket'] },
  { id: 't11', name: 'PVR Cinemas', city: 'Chandigarh', area: 'Sector 17', address: 'Sector 17, Chandigarh', screens: 5, facilities: ['4K Laser', 'Wheelchair Access'] },
];
const TIMES = ['10:00 AM', '01:15 PM', '04:30 PM', '07:45 PM', '10:30 PM'];
// Shows are generated relative to "today" so the booking flow always has live data to show, regardless of when this demo is run.
export function buildSeedShows() {
  const nowMovies = MOVIES.filter((m) => m.status === 'now');
  const shows = []; let n = 1;
  for (let day = 0; day < 7; day++) {
    const d = new Date(); d.setDate(d.getDate() + day); const date = d.toLocaleDateString('en-CA');
    THEATRES.forEach((th, ti) => {
      nowMovies.forEach((m, mi) => {
        // two showtimes per movie per theatre per day, staggered so theatres don't all look identical
        [TIMES[(mi + ti) % TIMES.length], TIMES[(mi + ti + 2) % TIMES.length]].forEach((time, k) => {
          shows.push({ id: `s${n++}`, movieId: m.id, theatreId: th.id, date, time, price: 180 + (ti % 5) * 15 + k * 20, screen: `Screen ${((mi + k) % th.screens) + 1}` });
        });
      });
    });
  }
  return shows;
}
const custNames = ['Aman Kapoor', 'Priya Sharma', 'Rohit Das', 'Sneha Iyer', 'Vikram Rathore', 'Isha Bhatt', 'Karan Mehta', 'Pooja Nair'];
export const USERS = [
  { id: 1, name: 'Admin User', email: 'admin@moviemat.com', phone: '9800000000', city: 'Jaipur', password: 'admin123', role: 'ADMIN', status: 'ACTIVE', joined: '2026-01-01' },
  ...custNames.map((n, i) => ({
    id: 101 + i, name: n, email: `${n.split(' ')[0].toLowerCase()}@example.com`, phone: `9${800000000 + i * 137}`,
    city: Object.keys(CITY_AREAS)[i % 10], password: 'password123', role: 'CUSTOMER', status: i === 3 ? 'BLOCKED' : 'ACTIVE', joined: `2026-0${(i % 6) + 1}-1${i}`,
  })),
];
export const REVIEWS = [
  { id: 1, user: 'Aman K.', rating: 5, text: 'Gripping from the first scene. Sound design in IMAX is superb.' },
  { id: 2, user: 'Priya S.', rating: 4, text: 'Great performances, slightly long second half.' },
  { id: 3, user: 'Rohit D.', rating: 4, text: 'Solid family watch. Worth booking the premium seats.' },
];
