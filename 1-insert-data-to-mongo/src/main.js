import { connectDb, disconnectDb } from "./db";
import { readBusinesses, readReviews, copyReviews } from "./parser";

const main = async () => {
  try {
    await connectDb();
    await readBusinesses();
    await readReviews();
    // await copyReviews();
  } catch (e) {
    console.error(e);
  } finally {
    await disconnectDb();
  }
};

main();
