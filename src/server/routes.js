import express from "express";
import databaseHandler from "./routes/database/databaseHandler.js";

const router = express.Router();

// Define routes
router.use("/databaseSelect", databaseHandler);
router.use("/databaseInsert", databaseHandler);

export default router;
