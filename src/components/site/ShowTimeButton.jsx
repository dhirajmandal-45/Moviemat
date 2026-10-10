export default function ShowTimeButton({ show, onClick }) {
  return (
    <button onClick={() => onClick(show)} className="rounded-lg border border-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
      {show.time}<span className="ml-1 font-normal opacity-70">₹{show.price}</span>
    </button>
  );
}
