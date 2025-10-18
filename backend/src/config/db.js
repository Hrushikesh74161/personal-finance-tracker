import mongoose from "mongoose";

/**
 * Retry info variables
 */
const MAX_RETRIES = 3;
let retryCount = 0;

/**
 * Handler to setup connection with db
 * @returns {Promise<void>} A Promise that resolves when the connection is successful, or rejects if it fails after retries.
 */
export async function connectDB() {
  await mongoose
    .connect(process.env.MONGODB_URL, {
      connectTimeoutMS: 2000,
    })
    .then(() => {
      retryCount = 0;
      console.log("Mongoose connected to db...");
    })
    .catch(handleDbConnectionRetry);
}

/**
 * Handler to handle retrying connection to db
 * @private
 * @returns {void}
 */
function handleDbConnectionRetry(err) {
  /**
   * If no of retries haven't reached max, retry connection with exponential backoff
   */
  if (retryCount < MAX_RETRIES) {
    retryCount += 1;
    console.error("Mongoose failed to connect to db...", err?.message);
    console.log(`Retrying... retry count: ${retryCount}`);
    setTimeout(connectDB, Math.pow(2, retryCount) * 1000);
  } else {
    mongoose.connection
      .close()
      .then(() => {
        console.log(`Failed to connect to db after ${retryCount} tries`);
        process.exit(1);
      })
      .catch((err) => {
        console.error(
          `Failed to close the connection after failing to connect to db after ${retryCount} retries.`,
          err?.message,
        );
        process.exit(1);
      });
  }
}
