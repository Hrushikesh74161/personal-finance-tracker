import { Router } from "express";
import { accountRoutes } from "./accountRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { transactionRoutes } from "./transactionRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/accounts", accountRoutes);
apiRoutes.use("/transactions", transactionRoutes);