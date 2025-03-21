import { db } from "../database/connection.js"; // Fixed import path

async function testQueries() {
    try {
        console.log("Testing database connection...");
        const rows = await db.all("SELECT * FROM JusticeScope LIMIT 5");
        console.log("Query successful. Results:", rows);
    } catch (error) {
        console.error("Error testing queries:", error);
    }
}

testQueries();
