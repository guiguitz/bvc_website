import { db } from "./connection.js";

async function testDatabaseConnection() {
    try {
        const rows = await db.all("SELECT 1");
        console.log("Database connected successfully! Test query result:", rows);
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

testDatabaseConnection();
