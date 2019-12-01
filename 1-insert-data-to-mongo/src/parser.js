import bs from "binary-search";
import lineReader from "line-reader";

import {
  BUFFER_SIZE,
  BUSINESS_COLLECTION,
  DATASET_URL,
  REVIEW_COLLECTION
} from "./constants";
import { db } from "./db";

let buffer = [];
let total = 0;

const dumpBuffer = async collectionName => {
  await db.collection(collectionName).insertMany(buffer);
  total += buffer.length;
  console.log(`Written ${total} documents in ${collectionName} so far.`);
  buffer = [];
};

const readJsonFile = async ({ filePath, collectionName, processLine }) => {
  // delete collection if exists
  try {
    await db.collection(collectionName).drop();
  } catch (e) {
    console.log(`Collection ${collectionName} did not exist.`);
  }

  // initialize data
  buffer = [];
  total = 0;

  return new Promise((resolve, reject) => {
    lineReader.eachLine(
      filePath,
      async (line, last, cb) => {
        try {
          const obj = processLine(line);
          if (obj) buffer.push(obj);
          if (buffer.length >= BUFFER_SIZE) {
            await dumpBuffer(collectionName);
          }

          cb(); // go to next line

          if (last) {
            if (buffer.length > 0) await dumpBuffer(collectionName);
            console.log(
              `Finished parsing file ${filePath} for collection ${collectionName}. Written ${total} documents.`
            );
            resolve();
          }
        } catch (err) {
          reject(err);
        }
      },
      err => {
        if (err) reject(err);
      }
    );
  });
};

export const readBusinesses = async (datasetUrl = DATASET_URL) => {
  const matchRegex = new RegExp("restaurant", "i");

  return readJsonFile({
    filePath: `${datasetUrl}/business.json`,
    collectionName: BUSINESS_COLLECTION,
    processLine: line => {
      const obj = JSON.parse(line);

      if (matchRegex.test(obj.categories)) {
        // add only businesses that have restaurant somewhere in
        // the categories field
        obj._id = obj.business_id;
        delete obj.business_id;
        return obj;
      }

      return null;
    }
  });
};

export const readReviews = async (datasetUrl = DATASET_URL) => {
  const comparator = (a, b) => a.localeCompare(b);

  // construct a sorted array of existing business ids from database
  const businessIds = (
    await db
      .collection(BUSINESS_COLLECTION)
      .find({})
      .project({ _id: 1 })
      .toArray()
  )
    .map(obj => obj._id)
    .sort(comparator);

  return readJsonFile({
    filePath: `${datasetUrl}/review.json`,
    collectionName: REVIEW_COLLECTION,
    processLine: line => {
      const obj = JSON.parse(line);

      // binary search business id to see if it maches any from the database
      const pos = bs(businessIds, obj.business_id, comparator);

      if (pos >= 0) {
        // add it only if a business exists in the database for that review
        obj._id = obj.review_id;
        delete obj.review_id;
        delete obj.user_id;

        // remove newline characters, make it lowercase
        obj.text = obj.text.replace(/\n/g, "").toLowerCase();
        obj.date = new Date(`${obj.date} GMT`);

        return obj;
      }

      return null;
    }
  });
};
