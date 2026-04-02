import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const user = await User.create({ fullName, email, password });

        generateToken(user._id, res);

        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });

    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ── GET CURRENT USER ──────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error("GetMe error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};