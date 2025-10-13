export const nf = new Intl.NumberFormat("ko-KR");
export const fmt = (n?: number | null) =>
  typeof n === "number" && Number.isFinite(n) ? nf.format(n) : "-";
