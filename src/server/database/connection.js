import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const dbPath = process.env.DB_PATH;
const dbName = process.env.DB_NAME;
const dbFullPath = path.join(dbPath, dbName);

// Ensure the database directory exists
const dbDir = path.dirname(dbFullPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbFullPath, (err) => {
    if (err) {
        console.error("Failed to connect to the database:", err.message);
    } else {
        console.log("Connected to the SQLite database at", dbPath);
    }
});

export { db };
