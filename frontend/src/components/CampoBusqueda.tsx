interface CampoBusquedaProps {
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
}

export function CampoBusqueda({ value, onChange, placeholder }: CampoBusquedaProps) {
  return (
    <div className="relative flex-1">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? "Buscar..."}
        className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-slate-500 focus:outline-none"
      />
    </div>
  );
}
