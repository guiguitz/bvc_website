import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Use morgan logging middleware

// Routes
app.use("/api", routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
