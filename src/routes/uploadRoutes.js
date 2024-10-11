import express from 'express';
import { upload, uploadCSV , compress_image} from '../controllers/uploadController.js';
import validateCSV from '../middlewares/validateCSV.js';

const router = express.Router();

router.post('/upload', upload.single('file'), validateCSV, uploadCSV);
router.post('/compress', compress_image)

export default router;
