const rawBaseUrl = (
  import.meta.env.VITE_API_URL ||
  "https://campusx-backend-qw91.onrender.com/api"
).replace(/\/$/, "");

const BASE_URL = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl}/api`;

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      },
      signal: options.signal || AbortSignal.timeout(60000)
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new Error(
        "The backend did not respond within 60 seconds. Please try again in a moment."
      );
    }
    throw new Error(
      "Cannot connect to the backend. Please check the backend URL and server status."
    );
  }

  const raw = await response.text();
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (typeof data === "string" && data.trim() ? data : null) ||
      `Request failed with status ${response.status}`;

    if (response.status === 401) {
      ["token", "role", "username"].forEach((key) =>
        localStorage.removeItem(key)
      );

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    throw new Error(message);
  }

  return data;
}

// Authentication
export const login = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: username.trim(),
      password
    })
  });

// Contests
export const getContests = () => request("/contests");

export const createContest = (payload) =>
  request("/contests", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const joinContest = (id) =>
  request(`/contests/${id}/join`, {
    method: "POST",
    body: JSON.stringify({})
  });

export const submitSolution = (id, payload) =>
  request(`/contests/${id}/submissions`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

// Student data
export const getMySubmissions = () => request("/submissions/mine");
export const getLeaderboard = () => request("/leaderboard");
export const getMyAnalytics = () => request("/analytics/mine");
