const mongoose = require('mongoose');

const ImageAnalysisSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  detectedObjects: [{ type: String }],
  category: { type: String },
  aiDescription: { type: String },
  tags: [{ type: String }],
  confidence: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ImageAnalysis', ImageAnalysisSchema);
