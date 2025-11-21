import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

console.log("API base URL:", process.env.REACT_APP_API_URL);

// Add token interceptor
API.interceptors.request.use((config) => {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      const { token } = JSON.parse(user);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Error reading token:", e);
  }

  return config;
});

export default API;
