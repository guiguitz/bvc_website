import { db } from "./connection.js";
import fs from "fs/promises";

async function initializeDatabase() {
    try {
        const sql = await fs.readFile("./src/server/routes/database/database.sql", "utf-8");
        const statements = sql.split(";").map(stmt => stmt.trim()).filter(stmt => stmt);

        console.log("Starting database initialization...");
        for (const statement of statements) {
            try {
                db.exec(statement);
            } catch (error) {
                console.error(`Error executing statement: ${statement}`, error);
            }
        }

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
    } finally {
        try {
            db.close();
        } catch (closeError) {
            console.error("Error closing the database connection:", closeError);
        }
    }
}

initializeDatabase();
