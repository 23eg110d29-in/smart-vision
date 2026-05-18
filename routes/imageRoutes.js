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

const os = require('os');

// Configure multer for storage (handling local disk vs serverless /tmp)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = process.env.NODE_ENV === 'production' ? os.tmpdir() : 'uploads/';
    cb(null, uploadDir);
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
