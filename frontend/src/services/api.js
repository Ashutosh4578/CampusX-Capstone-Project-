const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

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
      // Prevent the dashboard from remaining on its loading screen forever
      // when the backend is stopped or a request gets stuck.
      signal: options.signal || AbortSignal.timeout(12000)
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new Error("The backend did not respond within 12 seconds. Check that Spring Boot is running on port 8080.");
    }
    throw new Error("Cannot connect to the backend. Start Spring Boot and check that it is running on http://localhost:8080.");
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
