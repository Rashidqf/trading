const csv = require('csv-parser');
const fs = require('fs');

// Fields that need to be converted to numbers
const intData = ['AccountId']; // Specify the fields that need to be converted to numbers

/**
 * Processes a CSV file and returns its contents as an array of objects.
 * The file is deleted after processing.
 * @param {string} filepath - The path to the CSV file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects representing the CSV data.
 * @throws {Error} - If the function fails to read the data.
 */
export const processCSVFileAccount = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' })) // Specify the separator as ';' since your CSV data seems to use semicolons
      .on('data', (data) => {
        // Convert specified fields to numbers
        intData.forEach(field => {
          if (!isNaN(data[field])) {
            data[field] = parseInt(data[field]);
          }
        });
        results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};
