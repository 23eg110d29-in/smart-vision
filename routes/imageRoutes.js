const express = require('express');
const router = express.Router();
const {
  uploadImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage
} = require('../controllers/imageController');
const multer = require('multer');

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.route('/').get(getAllImages);
router.route('/upload').post(upload.single('image'), uploadImage);
router.route('/:id').get(getImageById).put(updateImage).delete(deleteImage);

module.exports = router;
