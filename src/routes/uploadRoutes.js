import express from 'express';
import { upload, uploadCSV } from '../controllers/uploadController.js';
import validateCSV from '../middlewares/validateCSV.js';

const router = express.Router();

router.post('/upload', upload.single('file'), validateCSV, uploadCSV);

export default router;
