import { MapPin, Film } from 'lucide-react';
import ShowTimeButton from './ShowTimeButton';

/**
 * One theatre with its show times.
 * theatre = { id, name, area, address, city, facilities[], movieCount, shows[] }
 */
export default function TheatreCard({ theatre, onSelectShow }) {
  const place = [theatre.area, theatre.city].filter(Boolean).join(', ');

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{theatre.name}</h3>
          {place && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={14} />{place}
            </p>
          )}
          {theatre.address && theatre.address !== theatre.area && (
            <p className="mt-0.5 text-xs text-slate-400">{theatre.address}</p>
          )}
        </div>
        {theatre.movieCount > 0 && (
          <span className="pill flex items-center gap-1"><Film size={12} />{theatre.movieCount} movie{theatre.movieCount > 1 ? 's' : ''}</span>
        )}
      </div>

      {theatre.facilities?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {theatre.facilities.map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{f}</span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2.5">
        {(theatre.shows || []).length === 0
          ? <p className="text-sm text-slate-500">No shows available.</p>
          : theatre.shows.map((show) => (
            <ShowTimeButton key={show.id} show={show} onClick={onSelectShow} />
          ))}
      </div>
    </article>
  );
}
