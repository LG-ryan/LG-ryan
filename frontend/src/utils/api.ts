const BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL || "http://localhost:8000";

export const API = {
  tco: `${BASE_URL}/api/v1/tco`,
  timing: `${BASE_URL}/api/v1/timing/report`,
  signal: `${BASE_URL}/api/v1/lifecycle/signal`,
};
