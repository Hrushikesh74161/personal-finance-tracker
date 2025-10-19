import { Router } from "express";
import { accountRoutes } from "./accountRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { budgetRoutes } from "./budgetRoutes.js";
import { categoryRoutes } from "./categoryRoutes.js";
import { regularPaymentRoutes } from "./regularPaymentRoutes.js";
import { transactionRoutes } from "./transactionRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/accounts", accountRoutes);
apiRoutes.use("/budgets", budgetRoutes);
apiRoutes.use("/categories", categoryRoutes);
apiRoutes.use("/regular-payments", regularPaymentRoutes);
apiRoutes.use("/transactions", transactionRoutes);