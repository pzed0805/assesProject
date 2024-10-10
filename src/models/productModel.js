import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  inputImageUrls: [String],
  outputImageUrls: [String]
});

export default mongoose.model('Product', productSchema);
