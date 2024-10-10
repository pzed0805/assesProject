import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Request from '../models/requestModel.js';
import Product from '../models/productModel.js';
import Queue from 'bull';
import { processImages } from '../services/imageProcessingService.js';

// Setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Setup Bull Queue for async processing
const imageQueue = new Queue('image-processing');

imageQueue.process(async (job) => {
  const { csvData, requestId } = job.data;

  // Process each product
  for (const row of csvData) {
    const product = new Product({
      productName: row['Product Name'],
      inputImageUrls: row['Input Image Urls'].split(',')
    });

    await processImages(product);
  }

  await Request.findOneAndUpdate({ requestId }, { status: 'completed' });
});

export const uploadCSV = async (req, res) => {
  const requestId = uuidv4();
  const newRequest = new Request({ requestId, status: 'pending' });
  await newRequest.save();

  // Add to processing queue
  imageQueue.add({ csvData: req.csvData, requestId });

  res.status(202).json({ requestId });
};

export { upload };
