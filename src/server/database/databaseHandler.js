import { db } from "../database/connection.js";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const dbAllAsync = promisify(db.all.bind(db));

const TABLES = {
    justiceScopes: "JusticeScope",
    demandTypes: "DemandType",
    caseStatus: "CaseStatus",
    deadlineTypes: "DeadlineType",
    deadlineStatus: "DeadlineStatus",
};

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    console.log("Received request:", { method: req.method, url: req.url }); // Log method and URL

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET" && req.query.test === "db") {
        try {
            const testQuery = await dbAllAsync("SELECT name FROM sqlite_master WHERE type='table';");
            console.log("Database tables:", testQuery);
            return res.status(200).json({ message: "Database is accessible", tables: testQuery });
        } catch (error) {
            console.error("Database connection error:", error);
            return res.status(500).json({ error: "Database connection failed" });
        }
    }

    if (req.method === "POST" && req.url.endsWith("/api/cases")) {
        try {
            console.log("Request body:", req.body); // Log request body
            const caseData = req.body;

            // Validate required fields
            const requiredFields = [
                "Name", "CPF", "RG", "Address", "JusticeScopeID", "DemandTypeID", "CaseStatusID", "ProcessNumber"
            ];
            const missingFields = requiredFields.filter(field => !caseData[field] || caseData[field].trim() === "");
            if (missingFields.length > 0) {
                console.error("Missing required fields:", missingFields);
                return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
            }

            // Create directory in <cwd>/processos
            const processDir = path.resolve("processos", caseData.ProcessNumber);
            if (!fs.existsSync(processDir)) {
                fs.mkdirSync(processDir, { recursive: true });
                console.log(`Directory created at: ${processDir}`);
            }

            const query = `
                INSERT INTO Cases (
                    Name, CPF, RG, Address, Profession, Phone, Email, CivilStatus, BankDetails, BirthDate,
                    JusticeScopeID, DemandTypeID, Organization, CaseDescription, ProcessNumber, Observations,
                    StatusID
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                caseData.Name, caseData.CPF, caseData.RG, caseData.Address, caseData.Profession, caseData.Phone,
                caseData.Email, caseData.CivilStatus, caseData.BankDetails, caseData.BirthDate,
                caseData.JusticeScopeID, caseData.DemandTypeID, caseData.Organization, caseData.CaseDescription,
                caseData.ProcessNumber, caseData.Observations, caseData.CaseStatusID
            ];

            console.log("Executing query:", query);
            console.log("With parameters:", params);

            await new Promise((resolve, reject) => {
                db.run(query, params, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            console.log("Case saved successfully.");
            return res.status(201).json({ message: "Case saved successfully" });
        } catch (error) {
            console.error("Error saving case:", error.message);
            console.error("Stack trace:", error.stack);
            if (!res.headersSent) {
                return res.status(500).json({ error: "Failed to save case" });
            }
        }
    }

    if (req.method === "GET") {
        const { type } = req.query;

        console.log("Received request for type:", type);

        if (!type || !TABLES[type]) {
            console.error("Invalid or missing 'type' query parameter.");
            return res.status(400).json({ error: "Invalid or missing 'type' query parameter." });
        }

        const tableName = TABLES[type];
        try {
            console.log(`Fetching data from table: ${tableName}`);
            const rows = await dbAllAsync(`SELECT DISTINCT * FROM ${tableName}`, []);
            console.log(`Fetched rows from ${tableName}:`, rows);

            if (!rows || rows.length === 0) {
                console.warn(`No records found in ${tableName}.`);
                return res.status(404).json({ error: `No records found in ${tableName}.` });
            }

            res.status(200).json(rows);
        } catch (error) {
            console.error(`Error fetching data from ${tableName}:`, error);
            res.status(500).json({ error: `Error fetching data from ${tableName}` });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
