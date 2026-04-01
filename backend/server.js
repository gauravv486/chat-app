import dotenv from 'dotenv'
import express from 'express';
import connectDB from './src/config/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config();

await connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});

const PORT = process.env.PORT || 5000
