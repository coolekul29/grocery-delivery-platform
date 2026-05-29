const multer = require("multer");
const path = require("path");

// Store uploaded files
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    // Create a unique file name
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check allowed image types
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;

  // Check file extension
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Check file type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only! Only .jpg, .jpeg, and .png are allowed."));
  }
}

// Upload settings
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;