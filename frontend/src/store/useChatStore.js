import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import socket from "../lib/socket.js";

export const useChatStore = create((set, get) => ({
    users: [],           // all users for sidebar
    selectedUser: null,  // currently open chat
    messages: [],        // messages in current chat
    isUsersLoading: false,
    isMessagesLoading: false,

    // ─── GET ALL USERS FOR SIDEBAR ───
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data.users });
        } catch (error) {
            console.error("getUsers error:", error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // ─── GET MESSAGES WITH SELECTED USER ───
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data.messages });
        } catch (error) {
            console.error("getMessages error:", error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // ─── SEND MESSAGE ───
    sendMessage: async (messageText) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                { message: messageText }
            );
            // add new message to existing list immediately
            set({ messages: [...messages, res.data.message] });
        } catch (error) {
            console.error("sendMessage error:", error.response.data.message);
        }
    },

    // ─── LISTEN FOR INCOMING REAL TIME MESSAGES ───
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        socket.on("newMessage", (message) => {
            // only add if message is from the currently open chat
            if (message.senderId === selectedUser._id) {
                set({ messages: [...get().messages, message] });
            }
        });
    },

    // ─── STOP LISTENING WHEN CHAT CLOSES ───
    unsubscribeFromMessages: () => {
        socket.off("newMessage");
    },

    setSelectedUser: (user) => set({ selectedUser: user }),
}));