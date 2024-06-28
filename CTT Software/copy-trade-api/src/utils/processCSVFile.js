import fs from 'fs';
import path from 'path';

// Fields that need to be converted to a number
const intFields = ['100%', '75%', '50%', '25%'];

/**
 * Processes a CSV file and returns its contents as an array of objects.
 * The file is deleted after processing.
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects representing the CSV data.
 * @throws {Error} - If the function fails to read the data.
 */
export const processCSVFile = async (filePath) => {
  if (!filePath) return null;
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const rows = fileContent.trim().split('\n');
    const header = rows[0].split(';').map(h => h.trim().replace('\r', ''));

    const entriesMap = new Map(); // Map to group entries by email and account ID

    rows.slice(1).forEach(row => {
      const values = row.split(';').map(v => v.trim().replace('\r', '').replace(/"/g, ''));
      const email = values[0];
      const accountId = values[1];
      const item = values[2];
      
      const percentage = {};
      for (let i = 3; i < header.length; i++) {
        const key = header[i];
        let value = values[i];
        if (intFields.includes(key)) {
          // Replace commas with periods and convert to float
          value = parseFloat(value.replace(/,/g, '.'));
        }
        percentage[key] = value;
      }

      const entryKey = email + accountId; // Unique key based on email and account ID
      if (entriesMap.has(entryKey)) {
        // Entry already exists, update percentage data
        entriesMap.get(entryKey).percentage.push({
          itemName: item,
          ...percentage
        });
      } else {
        // Create a new entry
        const entry = {
          email: email,
          accountId: accountId,
          percentage: [{
            itemName: item,
            ...percentage
          }]
        };
        entriesMap.set(entryKey, entry);
      }
    });

    // Convert map values to array
    const entries = [...entriesMap.values()];

    // Optionally delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${err}`);
    });

    return entries;
  } catch (error) {
    throw new Error(`Failed to process CSV file: ${error}`);
  }
};

// Usage example (assuming you call this function from an async context):
// const csvData = await processCSVFile('/path/to/your/csvfile.csv');
// console.log(csvData);
