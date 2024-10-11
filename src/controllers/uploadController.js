import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Request from '../models/requestModel.js';
import Product from '../models/productModel.js';
import Queue from 'bull';
import { processImages } from '../services/imageProcessingService.js';
import axios from 'axios';
import path from 'path'
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';
import sharp from 'sharp';

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

export const compress_image = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const outputFileName = `compressed_${Date.now()}.jpg`;
    const outputPath = path.join(__dirname, 'compressed_images', outputFileName);
    const url = req.body.image_url;
    const response = await axios({
      url: url,
      responseType: 'arraybuffer', // Important for image processing
    });
    console.log(outputPath)
    await sharp(response.data)
      .resize(800) // Resize the image to a width of 800px (optional)
      .jpeg({ quality: 50 }) // Compress to 50% quality for JPEG
      .toFile(outputPath);
    res.status(200).send("ok image processed successfully")
  } catch (error) {
    console.log("error for image compressing", error)
    res.status(400).send("error compressing image")
  }
}
export { upload };
