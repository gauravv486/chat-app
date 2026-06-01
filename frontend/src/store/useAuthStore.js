import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import socket from "../lib/socket.js";

// ─── DEFINED FIRST ───

const connectSocket = (userData) => {
  socket.auth = { userId: userData._id };
  console.log("connecting socket with userId:", userData._id);
  socket.connect();

  socket.on("getOnlineUsers", (userIds) => {
    console.log("getOnlineUsers received:", userIds);
    useAuthStore.setState({ onlineUsers: userIds });
  });
};

const disconnectSocket = () => {
  socket.off("getOnlineUsers");
  socket.disconnect();
};

// ─── STORE ───

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.user });       // ← .user
      connectSocket(res.data.user);           // ← .user
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data.user });       // ← .user
      connectSocket(res.data.user);           // ← .user
    } catch (error) {
      console.error("Login error:", error.response.data.message);
    }
  },

  signup: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      set({ authUser: res.data.user });       // ← .user
      connectSocket(res.data.user);           // ← .user
    } catch (error) {
      console.error("Signup error:", error.response.data.message);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, onlineUsers: [] });
      disconnectSocket();
    } catch (error) {
      console.error("Logout error:", error.response.data.message);
    }
  },
}));