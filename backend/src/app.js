import cors from "cors";
import express from "express";
import morgan from "morgan";
import { apiRoutes } from "./routes/index.js";

export const app = express();

app.use(morgan("dev"))
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => res.status(200).end("Personal Finance Tracker API working..."));
