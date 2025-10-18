import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { transactionRoutes } from "./transactionRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/transactions", transactionRoutes);