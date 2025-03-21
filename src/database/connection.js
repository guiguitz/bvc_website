import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve("./database/case_management.db"); // Ensure this matches the path in initializeDB.js
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to connect to the database:", err.message);
    } else {
        console.log("Connected to the SQLite database at", dbPath);
    }
});

export { db };
