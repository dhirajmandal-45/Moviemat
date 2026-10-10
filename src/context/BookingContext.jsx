import { createContext, useContext, useState } from 'react';
const Ctx = createContext(null);
export const useBooking = () => useContext(Ctx);
const read = (k, d) => { try { return JSON.parse(sessionStorage.getItem(k)) ?? d; } catch { return d; } };
export function BookingProvider({ children }) {
  const [city, setCityState] = useState(localStorage.getItem('mm_city') || 'Jaipur');
  const [language, setLanguage] = useState('All');
  const [draft, setDraftState] = useState(() => read('mm_draft', null)); // { showId, show, seats }
  const [confirmed, setConfirmed] = useState(() => read('mm_confirmed', null));
  const setCity = (c) => { localStorage.setItem('mm_city', c); setCityState(c); };
  const setDraft = (d) => { sessionStorage.setItem('mm_draft', JSON.stringify(d)); setDraftState(d); };
  const setBooking = (b) => { sessionStorage.setItem('mm_confirmed', JSON.stringify(b)); setConfirmed(b); };
  return <Ctx.Provider value={{ city, setCity, language, setLanguage, draft, setDraft, confirmed, setBooking }}>{children}</Ctx.Provider>;
}
