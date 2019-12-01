import { connectDb, disconnectDb } from "./db";
import { readBusinesses, readReviews } from "./parser";

const main = async () => {
  try {
    await connectDb();
    await readBusinesses();
    await readReviews();
  } catch (e) {
    console.error(e);
  } finally {
    await disconnectDb();
  }
};

main();
