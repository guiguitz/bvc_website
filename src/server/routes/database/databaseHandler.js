import { db } from "../database/connection.js";
import { promisify } from "util";

const dbAllAsync = promisify(db.all.bind(db));

const TABLES = {
    justiceScopes: "JusticeScopes",
    demandTypes: "DemandTypes",
    caseStatuses: "CaseStatuses",
    deadlineTypes: "DeadlineTypes",
    deadlineStatuses: "DeadlineStatuses",
    feeTypes: "FeeTypes",
    feeStatuses: "FeeStatuses",
};

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    console.log("REQUEST:", { method: req.method, query: req.query, body: req.body });
    const { type } = req.query;
    const body = req.body;

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "POST") {
        if (type === "newCase" || type === "updateCase") {
            try {
                // Insert case details
                const caseInsertQuery = `
                    INSERT OR REPLACE INTO Cases (
                        Name, CPF, RG, Address, Profession, Phone, Email, CivilStatus,
                        BankDetails, BirthDate, Organization, CaseDescription, ProcessNumber,
                        JusticeScopeID, DemandTypeID, StatusID
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                        (SELECT JusticeScopeID FROM JusticeScopes WHERE ScopeName = ?),
                        (SELECT DemandTypeID FROM DemandTypes WHERE DemandName = ?),
                        (SELECT CaseStatusID FROM CaseStatuses WHERE StatusName = ?)
                    )`;
                const caseParams = [
                    body.Name, body.CPF, body.RG, body.Address, body.Profession, body.Phone,
                    body.Email, body.CivilStatus, body.BankDetails, body.BirthDate,
                    body.Organization, body.CaseDescription, body.ProcessNumber,
                    body.JusticeScope, body.DemandType, body.CaseStatus
                ];

                // Use a promise to get the lastID
                const caseID = await new Promise((resolve, reject) => {
                    db.run(caseInsertQuery, caseParams, function (err) {
                        if (err) return reject(err);
                        resolve(this.lastID); // Retrieve the last inserted ID
                    });
                });

                // Insert fees
                const feeInsertQuery = `
                    INSERT OR REPLACE INTO Fees (CaseID, FeeTypeID, FeeValue, FeeStatusID)
                    VALUES (?,
                        (SELECT FeeTypeID FROM FeeTypes WHERE TypeName = ?),
                        ?,
                        (SELECT FeeStatusID FROM FeeStatuses WHERE StatusName = ?)
                    )`;
                for (const fee of body.Fees) {
                    await new Promise((resolve, reject) => {
                        db.run(feeInsertQuery, [caseID, fee.FeeType, fee.FeeValue, fee.FeeStatus], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                }

                // Insert deadlines
                const deadlineInsertQuery = `
                    INSERT OR REPLACE INTO Deadlines (CaseID, DeadlineTypeID, DeadlineDate, StatusID)
                    VALUES (?,
                        (SELECT DeadlineTypeID FROM DeadlineTypes WHERE TypeName = ?),
                        ?,
                        (SELECT DeadlineStatusID FROM DeadlineStatuses WHERE StatusName = ?)
                    )`;
                for (const deadline of body.Deadlines) {
                    await new Promise((resolve, reject) => {
                        db.run(deadlineInsertQuery, [caseID, deadline.DeadlineType, deadline.DeadlineDate, deadline.DeadlineStatus], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                }

                console.log("[Backend] New case inserted successfully with CaseID:", caseID);
                return res.status(201).json({ message: "Case inserted successfully", CaseID: caseID });
            } catch (error) {
                console.error("[Backend] Error inserting new case:", error);
                return res.status(500).json({ error: "Failed to insert new case" });
            }
        } else {
            console.error("[Backend] Invalid 'query' for POST request.");
            return res.status(400).json({ error: "Invalid 'query' for POST request" });
        }
    }

    if (req.method === "GET") {
        const { type } = req.query;

        if (!type || (type !== "allCases" && !TABLES[type])) {
            console.error("[Backend] Invalid or missing 'type' query parameter.");
            return res.status(400).json({ error: "Invalid or missing 'type' query parameter." });
        }

        if (type === "allCases") {
            try {
                // Fetch all cases
                const casesQuery = `
                    SELECT
                        Cases.CaseID,
                        Cases.Name,
                        Cases.CPF,
                        Cases.RG,
                        Cases.Address,
                        Cases.Profession,
                        Cases.Phone,
                        Cases.Email,
                        Cases.CivilStatus,
                        Cases.BankDetails,
                        Cases.BirthDate,
                        Cases.Organization,
                        Cases.CaseDescription,
                        Cases.ProcessNumber,
                        JusticeScopes.ScopeName AS JusticeScope,
                        DemandTypes.DemandName AS DemandType,
                        CaseStatuses.StatusName AS CaseStatus
                    FROM Cases
                    LEFT JOIN JusticeScopes ON Cases.JusticeScopeID = JusticeScopes.JusticeScopeID
                    LEFT JOIN DemandTypes ON Cases.DemandTypeID = DemandTypes.DemandTypeID
                    LEFT JOIN CaseStatuses ON Cases.StatusID = CaseStatuses.CaseStatusID`;

                const cases = await dbAllAsync(casesQuery);

                // Fetch fees with names
                const feesQuery = `
                    SELECT
                        Fees.CaseID,
                        FeeTypes.TypeName AS FeeType,
                        Fees.FeeValue,
                        FeeStatuses.StatusName AS FeeStatus
                    FROM Fees
                    LEFT JOIN FeeTypes ON Fees.FeeTypeID = FeeTypes.FeeTypeID
                    LEFT JOIN FeeStatuses ON Fees.FeeStatusID = FeeStatuses.FeeStatusID`;
                const fees = await dbAllAsync(feesQuery);

                // Fetch deadlines with names
                const deadlinesQuery = `
                    SELECT
                        Deadlines.CaseID,
                        DeadlineTypes.TypeName AS DeadlineType,
                        Deadlines.DeadlineDate,
                        DeadlineStatuses.StatusName AS DeadlineStatus
                    FROM Deadlines
                    LEFT JOIN DeadlineTypes ON Deadlines.DeadlineTypeID = DeadlineTypes.DeadlineTypeID
                    LEFT JOIN DeadlineStatuses ON Deadlines.StatusID = DeadlineStatuses.DeadlineStatusID`;
                const deadlines = await dbAllAsync(deadlinesQuery);

                // Group fees and deadlines by CaseID
                const feesByCase = fees.reduce((acc, fee) => {
                    acc[fee.CaseID] = acc[fee.CaseID] || [];
                    acc[fee.CaseID].push({
                        FeeType: fee.FeeType,
                        FeeValue: fee.FeeValue,
                        FeeStatus: fee.FeeStatus,
                    });
                    return acc;
                }, {});

                const deadlinesByCase = deadlines.reduce((acc, deadline) => {
                    acc[deadline.CaseID] = acc[deadline.CaseID] || [];
                    acc[deadline.CaseID].push({
                        DeadlineType: deadline.DeadlineType,
                        DeadlineDate: deadline.DeadlineDate,
                        DeadlineStatus: deadline.DeadlineStatus,
                    });
                    return acc;
                }, {});

                // Add Fees and Deadlines arrays to each case
                const results = cases.map((caseItem) => ({
                    ...caseItem,
                    Fees: feesByCase[caseItem.CaseID] || [],
                    Deadlines: deadlinesByCase[caseItem.CaseID] || [],
                }));

                // console.log("[Backend] Resonse:", JSON.stringify(results, null, 2));
                return res.status(200).json(results);
            } catch (error) {
                console.error("[Backend] Error fetching cases with fees and deadlines:", error);
                return res.status(500).json({ error: "Failed to fetch data" });
            }
        }

        // Query for reference table data
        const tableName = TABLES[type];
        const query = `SELECT * FROM ${tableName}`;
        try {
            const results = await dbAllAsync(query);

            if (!results || results.length === 0) {
                console.warn(`[Backend] No records found for query: ${query}`);
                return res.status(404).json({ error: `No records found.` });
            }

            // console.log("[Backend] Resonse:", JSON.stringify(results, null, 2));
            return res.status(200).json(results);
        } catch (error) {
            console.error(`[Backend] Error executing query: ${query}`, error);
            return res.status(500).json({ error: "Failed to fetch data" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
