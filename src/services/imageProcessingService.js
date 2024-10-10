import Product from '../models/productModel.js';
import compressImage from '../utils/compressImage.js';

export const processImages = async (product) => {
  const outputUrls = await Promise.all(
    product.inputImageUrls.map(async (url) => await compressImage(url))
  );

  product.outputImageUrls = outputUrls;
  await product.save();
};
