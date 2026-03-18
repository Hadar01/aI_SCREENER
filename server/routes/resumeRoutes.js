const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../middleware/upload");
const ctrl = require("../controllers/resumeController");

// ─── Upload Resumes ─────────────────────────────────────────────────────────────
// POST /api/upload
// Body: multipart/form-data with field "resumes" (1-10 PDF files)
//       Optional: job_title, job_description
router.post(
  "/upload",
  upload.array("resumes", 10),
  handleMulterError,
  ctrl.uploadResumes
);

// ─── Candidates ─────────────────────────────────────────────────────────────────
// GET  /api/candidates          – List with pagination & filters
// GET  /api/candidates/:id      – Single candidate detail
// DELETE /api/candidates/:id    – Remove candidate + file
router.get("/candidates", ctrl.getCandidates);
router.get("/candidates/:id", ctrl.getCandidateById);
router.delete("/candidates/:id", ctrl.deleteCandidate);

// ─── Re-analyze ─────────────────────────────────────────────────────────────────
// POST /api/candidates/:id/reanalyze
router.post("/candidates/:id/reanalyze", ctrl.reanalyzeCandidate);

// ─── Download Original PDF ──────────────────────────────────────────────────────
// GET /api/candidates/:id/download
router.get("/candidates/:id/download", ctrl.downloadResume);

// ─── Stats ──────────────────────────────────────────────────────────────────────
// GET /api/stats
router.get("/stats", ctrl.getStats);

// ─── CSV Export ─────────────────────────────────────────────────────────────────
// GET /api/export/csv
router.get("/export/csv", ctrl.exportCSV);

module.exports = router;
