import express from "express";
import cors from "cors";
import databaseHandler from "./database/databaseHandler.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/options", databaseHandler);
app.post("/api/cases", databaseHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
