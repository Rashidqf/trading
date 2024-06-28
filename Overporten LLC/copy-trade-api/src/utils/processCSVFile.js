const csv = require('csv-parser');
const fs = require('fs');

// Fields that need to be converted to numbers
const intData = ['U']; // Add any other fields here if needed

/**
 * Processes a CSV file and returns its contents as an array of objects.
 * The file is deleted after processing.
 * @param {string} filepath - The path to the CSV file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects representing the CSV data.
 * @throws {Error} - If the function fails to read the data.
 */
export const processCSVFile = async (filePath) => {
  if (!filePath) return null;
  try {
    const res = new Promise((resolve, reject) => {
      let entries = [];
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' })) // Specify the separator
        .on('data', (data) => {
          // Convert specified fields into numbers
          Object.keys(data).forEach((key) => {
            if (intData.includes(key)) {
              data[key] = parseFloat(data[key]);
            }
          });
          entries.push(data);
        })
        .on('end', () => {
          fs.unlinkSync(filePath);
          // Transform the data into desired structure
          const transformedEntries = entries.map((entry) => ({
            email: entry.Username,
            accountId: entry.AccountId,
            u: entry.U || 0, 
          }));          
          resolve(transformedEntries);
        })
        .on('error', (err) => {
          console.log(err);
          reject(err);
        });
    });
    return res;
  } catch (err) {
    throw new Error('Failed to read data');
  }
};
