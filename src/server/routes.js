import express from "express";
import databaseHandler from "./database/databaseHandler.js";

const router = express.Router();

// Define routes
router.use("/options", databaseHandler);
router.use("/cases", databaseHandler);

export default router;
