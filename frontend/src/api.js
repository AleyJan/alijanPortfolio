// In dev, Vite proxies /api → Express (vite.config.js), so BASE is empty.
// In production, set VITE_API_URL to the deployed backend URL (no trailing slash)
// e.g. https://your-backend.vercel.app — then all requests go there.
// Strip any trailing slash(es) so `${BASE}/api/...` never produces a double
// slash (which Vercel 308-redirects — and redirects break CORS preflight).
const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

const TOKEN_KEY = "admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = "GET", body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/auth/me", { auth: true }),

  getContent: () => request("/content"),
  saveContent: (data) => request("/content", { method: "PUT", body: data, auth: true }),

  submitLead: (lead) => request("/leads", { method: "POST", body: lead }),
  getLeads: () => request("/leads", { auth: true }),
  updateLead: (id, read) =>
    request(`/leads/${id}`, { method: "PATCH", body: { read }, auth: true }),
  deleteLead: (id) => request(`/leads/${id}`, { method: "DELETE", auth: true }),

  uploadImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return request("/upload", { method: "POST", body: form, auth: true, isForm: true });
  },
};
