import { MongoClient } from "mongodb";

import { DATABASE_NAME, DATABASE_URL } from "./constants";

let client;
export let db;

export const connectDb = async () => {
  client = await MongoClient.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  db = client.db(DATABASE_NAME);
  console.log("Connected to database.");
};

export const disconnectDb = async () => {
  client.close();
  console.log("Disconnected from database.");
};
