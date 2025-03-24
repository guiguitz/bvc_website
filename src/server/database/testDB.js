import { db } from "./connection.js";
import fs from "fs/promises";

async function initializeDatabase() {
    try {
        const sql = await fs.readFile("./src/server/database/database.sql", "utf-8");
        const statements = sql.split(";").map(stmt => stmt.trim()).filter(stmt => stmt);

        console.log("Starting database initialization...");
        for (const statement of statements) {
            try {
                console.log(`Executing: ${statement}`);
                await db.exec(statement); // Ensure async execution
            } catch (error) {
                console.error(`Error executing statement: ${statement}`, error);
            }
        }

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

async function insertTestCases() {
    try {
        const insertQuery = `
            INSERT OR IGNORE INTO Cases (Name, CPF, RG, Address, Profession, Phone, Email, CivilStatus, BankDetails, BirthDate, Organization, CaseDescription, ProcessNumber, Observations, JusticeScopeID, DemandTypeID, StatusID)
            VALUES
            ('John Doe', '12345678901', 'MG1234567', '123 Main St, Cityville', 'Engineer', '1234567890', 'johndoe@example.com', 'Single', 'Bank XYZ - 123456', '1985-06-15', 'Company A', 'Case regarding contract dispute', 'PN123456', 'Urgent case', 1, 1, 1),
            ('Jane Smith', '98765432100', 'SP7654321', '456 Elm St, Townsville', 'Doctor', '0987654321', 'janesmith@example.com', 'Married', 'Bank ABC - 654321', '1990-03-22', 'Organization B', 'Case regarding medical malpractice', 'PN654321', 'Requires additional documents', 2, 2, 1),
            ('Alice Johnson', '11122233344', 'RJ1122334', '789 Oak St, Villagetown', 'Lawyer', '1122334455', 'alicejohnson@example.com', 'Divorced', 'Bank DEF - 789012', '1980-11-05', 'Firm C', 'Case regarding property dispute', 'PN789012', 'Pending review', 3, 3, 2),
            ('Bob Brown', '55566677788', 'BA5566778', '321 Pine St, Hamletville', 'Teacher', '5566778899', 'bobbrown@example.com', 'Widowed', 'Bank GHI - 345678', '1975-08-30', 'School D', 'Case regarding labor rights', 'PN345678', 'Awaiting court decision', 4, 4, 1);
        `;
        await db.run(insertQuery);
        console.log("Test cases inserted successfully!");
    } catch (error) {
        console.error("Error inserting test cases:", error);
    }
}

async function queryInsertedCases() {
    try {
        const rows = await db.all("SELECT * FROM Cases");
        if (rows.length > 0) {
            console.log("Inserted cases:", rows);
        } else {
            console.log("No cases found in the database.");
        }
    } catch (error) {
        console.error("Error querying inserted cases:", error);
    }
}

async function checkTableExists() {
    try {
        const rows = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='Cases'");
        if (rows.length > 0) {
            console.log("The 'Cases' table exists.");
        } else {
            console.log("The 'Cases' table does not exist.");
        }
    } catch (error) {
        console.error("Error checking table existence:", error);
    }
}

async function verifyForeignKeyTables() {
    try {
        const justiceScopes = await db.all("SELECT * FROM JusticeScope");
        const demandTypes = await db.all("SELECT * FROM DemandType");
        const caseStatuses = await db.all("SELECT * FROM CaseStatus");

        console.log("JusticeScope table:", justiceScopes);
        console.log("DemandType table:", demandTypes);
        console.log("CaseStatus table:", caseStatuses);
    } catch (error) {
        console.error("Error verifying foreign key tables:", error);
    }
}

initializeDatabase()
    .then(() => verifyForeignKeyTables())
    .then(() => checkTableExists())
    .then(() => insertTestCases())
    .then(() => queryInsertedCases())
    .finally(() => {
        try {
            db.close(); // Close the database connection at the very end
            console.log("Database connection closed.");
        } catch (closeError) {
            console.error("Error closing the database connection:", closeError);
        }
    });