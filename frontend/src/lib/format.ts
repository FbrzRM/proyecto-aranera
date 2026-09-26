export function formatoFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "numeric" });
}

export function formatoFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}
