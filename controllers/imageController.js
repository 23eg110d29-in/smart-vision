const asyncHandler = require('express-async-handler');
const ImageAnalysis = require('../models/ImageAnalysis');
const { analyzeImageWithGemini } = require('../utils/aiVision');
const fs = require('fs');
const path = require('path');

// @desc    Upload image and analyze
// @route   POST /api/images/upload
// @access  Public
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }

  const imagePath = req.file.path;
  const mimeType = req.file.mimetype;
  
  // Call Gemini API
  const aiResult = await analyzeImageWithGemini(imagePath, mimeType);

  // Save to DB
  const newAnalysis = await ImageAnalysis.create({
    image: req.file.filename,
    title: aiResult.title || 'Untitled',
    detectedObjects: aiResult.detectedObjects || [],
    category: aiResult.category || 'Uncategorized',
    aiDescription: aiResult.aiDescription || '',
    tags: aiResult.tags || [],
    confidence: aiResult.confidence || 'Medium'
  });

  res.status(201).json(newAnalysis);
});

// @desc    Get all analyses
// @route   GET /api/images
// @access  Public
const getAllImages = asyncHandler(async (req, res) => {
  const images = await ImageAnalysis.find().sort({ createdAt: -1 });
  res.status(200).json(images);
});

// @desc    Get single analysis by ID
// @route   GET /api/images/:id
// @access  Public
const getImageById = asyncHandler(async (req, res) => {
  const image = await ImageAnalysis.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Analysis not found');
  }
  res.status(200).json(image);
});

// @desc    Update image tags/category
// @route   PUT /api/images/:id
// @access  Public
const updateImage = asyncHandler(async (req, res) => {
  const { title, category, tags, aiDescription } = req.body;
  const updatedImage = await ImageAnalysis.findByIdAndUpdate(
    req.params.id,
    { title, category, tags, aiDescription },
    { new: true }
  );
  if (!updatedImage) {
    res.status(404);
    throw new Error('Analysis not found');
  }
  res.status(200).json(updatedImage);
});

// @desc    Delete image analysis
// @route   DELETE /api/images/:id
// @access  Public
const deleteImage = asyncHandler(async (req, res) => {
  const image = await ImageAnalysis.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  // Remove file from filesystem
  const filePath = path.join(__dirname, '..', 'uploads', image.image);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await ImageAnalysis.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Image analysis deleted successfully' });
});

module.exports = {
  uploadImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
};
