import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: { type: String, default: 'pending' }
});

export default mongoose.model('Request', requestSchema);
