import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import uploadRoutes from './routes/uploadRoutes.js';
import statusRoutes from './routes/statusRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use('/api', uploadRoutes);
app.use('/api', statusRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
