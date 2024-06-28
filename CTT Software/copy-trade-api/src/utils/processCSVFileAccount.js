const csv = require('csv-parser');
const fs = require('node:fs');

// Fields that need to be converted to numbers
const intData = [];

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
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      })
      .on('error', (error) => reject(error));
  });
};

