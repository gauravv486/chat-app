import axios from "axios";

export const axiosInstance = axios.create({
    
  baseURL: import.meta.env.VITE_SERVER_URL + "/api",  
  // every request automatically goes to http://localhost:5000/api
  // so instead of writing full URL every time:
  // ❌ axios.get("http://localhost:5000/api/auth/login")
  // ✅ axiosInstance.get("/auth/login")  ← much cleaner

  withCredentials: true,  
  // same as socket — sends cookies with every request
  // without this, your JWT cookie won't be sent and auth breaks
});