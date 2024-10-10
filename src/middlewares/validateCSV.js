import csv from 'csv-parser';
import fs from 'fs';

const validateCSV = (req, res, next) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Basic validation logic
      if (results && results.length > 0) {
        req.csvData = results;
        next();
      } else {
        res.status(400).json({ message: 'Invalid CSV format' });
      }
    });
};

export default validateCSV;
