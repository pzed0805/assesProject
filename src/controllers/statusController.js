import Request from '../models/requestModel.js';

export const checkStatus = async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findOne({ requestId });

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  res.status(200).json({ status: request.status });
};
