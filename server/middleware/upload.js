const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Storage Configuration ──────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ─── File Filter (PDF only) ─────────────────────────────────────────────────────

const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ["application/pdf"];
  const allowedExtensions = [".pdf"];

  const extname = path.extname(file.originalname).toLowerCase();
  const isMimeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtValid = allowedExtensions.includes(extname);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only PDF files are allowed"
      ),
      false
    );
  }
};

// ─── Multer Instance ────────────────────────────────────────────────────────────

const maxFileSize =
  (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10) * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 10, // max 10 files per batch upload
  },
});

// ─── Error Handler Middleware ───────────────────────────────────────────────────

const handleMulterError = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 10}MB`,
      LIMIT_FILE_COUNT: "Too many files. Maximum is 10 per upload",
      LIMIT_UNEXPECTED_FILE: err.message || "Unexpected file type",
    };

    return res.status(400).json({
      success: false,
      error: messages[err.code] || err.message,
      code: err.code,
    });
  }

  if (err) {
    return res.status(500).json({
      success: false,
      error: "File upload failed",
      details: err.message,
    });
  }

  next();
};

module.exports = { upload, handleMulterError };
