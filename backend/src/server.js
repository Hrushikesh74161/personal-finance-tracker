import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

/**
 * Connect to database
 */
await connectDB();

/**
 * Server initiation
 */
const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () =>
  console.log(`Server started on port ${SERVER_PORT}`),
);
