import express from "express";
import databaseHandler from "./database/databaseHandler.js";

const router = express.Router();

// Define routes
router.use("/databaseSelect", databaseHandler);

export default router;
