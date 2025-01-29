import {
  readdirSync,
  createReadStream,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { extname, resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Searches for CSV files in the given directory.
 * @param {string} dirPath - The path of the directory to search.
 * @returns {string[]} - An array of CSV file paths.
 */
function findCsvFiles(dirPath) {
  return readdirSync(dirPath).filter((file) => extname(file) === ".csv");
}

/**
 * Reads a CSV file, converts it to JSON, and saves it to a JSON file.
 * @param {string} csvFilePath - The path of the CSV file to read.
 * @param {string} jsonDirPath - The directory path to save the JSON file.
 */
function readCsvAndSaveAsJson(csvFilePath, jsonDirPath) {
  const jsonFilePath = resolve(
    jsonDirPath,
    `${basename(csvFilePath, ".csv")}.json`
  );
  const jsonData = [];

  createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      jsonData.push(row);
    })
    .on("end", () => {
      writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
      console.log(
        `CSV file ${csvFilePath} successfully processed and saved as ${jsonFilePath}`
      );
    });
}

// Directory paths
const csvDirPath = resolve(__dirname, "../data/csv");
const jsonDirPath = resolve(__dirname, "../data/json");

// Ensure the JSON directory exists
if (!existsSync(jsonDirPath)) {
  mkdirSync(jsonDirPath);
}

// Find CSV files in the directory
const csvFiles = findCsvFiles(csvDirPath);

if (csvFiles.length > 0) {
  // Process each CSV file
  csvFiles.forEach((csvFile) => {
    readCsvAndSaveAsJson(resolve(csvDirPath, csvFile), jsonDirPath);
  });
} else {
  console.log("No CSV files found in the directory.");
}
