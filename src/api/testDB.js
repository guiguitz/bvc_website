import { db } from "../database/connection.js";

export default async function handler(req, res) {
    try {
        const rows = await db.all("SELECT 1"); // Simple test query
        res.status(200).json({ success: true, message: "Database connected successfully!" });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Database connection failed" });
    }
}
