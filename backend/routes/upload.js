const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

const uploadDir = path.join(__dirname, '../../frontend/public/product');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ image_url: `/product/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'Image upload failed' });
  }
});

router.post('/slip', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ image_url: `/product/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'Image upload failed' });
  }
});

const profileUploadDir = path.join(__dirname, '../../frontend/public/profile');
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename(req, file, cb) {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/profile', protect, uploadProfile.single('image'), (req, res) => {
  if (req.file) {
    res.json({ image_url: `/profile/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'Image upload failed' });
  }
});

module.exports = router;
