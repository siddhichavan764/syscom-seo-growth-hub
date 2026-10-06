const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ?
    "http://localhost:5000/api" :
    "https://syscom-seo-growth-hub.onrender.com/api";
async function apiRequest(endpoint, options = {}) {

    const token =
        localStorage.getItem("syscom_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid server response");
    }

    if (response.status === 401 ||
        response.status === 403) {

        localStorage.removeItem("syscom_token");
        localStorage.removeItem("syscom_user");

        window.location.href = "login.html";

        return;
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            "API request failed"
        );
    }

    return data;
}