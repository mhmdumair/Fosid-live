const fs = require("fs");
const path = require("path");

// Define the paths to the export files
const baseDir = path.join(__dirname, "firebase");
const firestoreDir = path.join(
  baseDir,
  "firestore_export",
  "all_namespaces",
  "all_kinds"
);
const outputFilePath = path.join(__dirname, "consolidated_firestore_data.json");

// Function to read and parse a JSON file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading or parsing file ${filePath}:`, error);
    return null;
  }
};

// Function to consolidate export files into a single JSON object
const consolidateFirestoreData = () => {
  try {
    console.log(`Reading export directory: ${firestoreDir}`);
    const exportFiles = fs.readdirSync(firestoreDir);

    if (exportFiles.length === 0) {
      console.error("No files found in export directory.");
      return;
    }

    let consolidatedData = [];

    exportFiles.forEach((file) => {
      const filePath = path.join(firestoreDir, file);
      if (fs.statSync(filePath).isFile() && file.startsWith("output-")) {
        console.log(`Processing file: ${filePath}`);
        const fileData = readJsonFile(filePath);
        if (fileData) {
          consolidatedData = consolidatedData.concat(fileData);
        }
      }
    });

    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(consolidatedData, null, 2),
      "utf-8"
    );
    console.log(`Consolidated data written to ${outputFilePath}`);
  } catch (error) {
    console.error("Error during consolidation:", error);
  }
};

// Run the consolidation process
consolidateFirestoreData();
