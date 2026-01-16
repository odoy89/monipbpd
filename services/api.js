const API = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}?${qs}`);
  return res.json();
}

export async function apiPost(data) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchDashboard(filters = {}) {
  const res = await fetch("/api/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters)
  });

  const result = await res.json();

  // 🔑 NORMALISASI DATA
  if (Array.isArray(result)) return result;
  if (result.data) return result.data;

  return [];
}
