const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const { extractTextFromPDF } = require("../utils/pdfParser");
const { analyzeResume } = require("../services/aiService");
const { resumesToCSV } = require("../utils/csvExporter");

// ─── Upload & Analyze ───────────────────────────────────────────────────────────

/**
 * POST /api/upload
 * Accepts single or multiple PDF files + optional job context.
 * Pipeline: Upload → Parse → AI Analyze → Save to DB
 */
exports.uploadResumes = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No PDF files were uploaded",
      });
    }

    const { job_title, job_description } = req.body;

    const results = [];
    const errors = [];

    // Process each file
    for (const file of files) {
      let resume = null;
      try {
        // 1. Create initial DB record
        resume = await Resume.create({
          original_filename: file.originalname,
          stored_filename: file.filename,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype,
          job_title: job_title || "",
          job_description: job_description || "",
          status: "parsing",
        });

        // 2. Extract text from PDF
        const { text, pageCount } = await extractTextFromPDF(
          path.resolve(file.path)
        );

        resume.extracted_text = text;
        resume.page_count = pageCount;

        // Try to extract candidate name from first line
        const firstLine = text.split(/[\n.]/)[0]?.trim() || "";
        if (firstLine.length > 2 && firstLine.length < 60) {
          resume.candidate_name = firstLine;
        }

        // Try to extract email
        const emailMatch = text.match(
          /[\w.-]+@[\w.-]+\.\w{2,}/
        );
        if (emailMatch) {
          resume.email = emailMatch[0].toLowerCase();
        }

        resume.status = "analyzing";
        await resume.save();

        // 3. AI Analysis
        const analysis = await analyzeResume(
          text,
          job_title || "",
          job_description || ""
        );

        resume.analysis = analysis;
        resume.status = "completed";
        await resume.save();

        results.push({
          id: resume._id,
          candidate_name: resume.candidate_name,
          email: resume.email,
          filename: file.originalname,
          status: "completed",
          analysis,
        });
      } catch (fileError) {
        console.error(
          `Error processing ${file.originalname}:`,
          fileError.message
        );

        // Update resume status to failed if record exists
        if (resume) {
          resume.status = "failed";
          resume.error_message = fileError.message;
          await resume.save();
        }

        errors.push({
          filename: file.originalname,
          error: fileError.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Processed ${results.length} of ${files.length} resumes`,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process upload",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ─── Get All Candidates ─────────────────────────────────────────────────────────

/**
 * GET /api/candidates
 * Query params: page, limit, sort, order, status, min_score, max_score, search
 */
exports.getCandidates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "createdAt",
      order = "desc",
      status,
      min_score,
      max_score,
      search,
    } = req.query;

    // Build filter
    const filter = { is_archived: false };

    if (status) {
      filter.status = status;
    }

    if (min_score || max_score) {
      filter["analysis.match_score"] = {};
      if (min_score)
        filter["analysis.match_score"].$gte = parseInt(min_score, 10);
      if (max_score)
        filter["analysis.match_score"].$lte = parseInt(max_score, 10);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort
    const sortObj = {};
    sortObj[sort] = order === "asc" ? 1 : -1;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [candidates, total] = await Promise.all([
      Resume.find(filter)
        .select("-extracted_text") // Exclude large text from list view
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Resume.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch candidates",
    });
  }
};

// ─── Get Single Candidate ───────────────────────────────────────────────────────

/**
 * GET /api/candidates/:id
 */
exports.getCandidateById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).lean();

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    console.error("Get candidate error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch candidate",
    });
  }
};

// ─── Delete Candidate ───────────────────────────────────────────────────────────

/**
 * DELETE /api/candidates/:id
 */
exports.deleteCandidate = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      });
    }

    // Delete the actual file
    if (resume.file_path && fs.existsSync(resume.file_path)) {
      fs.unlinkSync(resume.file_path);
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error("Delete candidate error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete candidate",
    });
  }
};

// ─── Re-analyze Candidate ───────────────────────────────────────────────────────

/**
 * POST /api/candidates/:id/reanalyze
 */
exports.reanalyzeCandidate = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      });
    }

    if (!resume.extracted_text || resume.extracted_text.length < 20) {
      return res.status(400).json({
        success: false,
        error: "Insufficient extracted text for re-analysis",
      });
    }

    // Allow overriding job context on re-analysis
    const jobTitle = req.body.job_title || resume.job_title;
    const jobDesc = req.body.job_description || resume.job_description;

    resume.status = "analyzing";
    resume.error_message = null;
    await resume.save();

    const analysis = await analyzeResume(
      resume.extracted_text,
      jobTitle,
      jobDesc
    );

    resume.analysis = analysis;
    resume.job_title = jobTitle;
    resume.job_description = jobDesc;
    resume.status = "completed";
    await resume.save();

    res.json({
      success: true,
      message: "Re-analysis complete",
      data: resume,
    });
  } catch (error) {
    console.error("Re-analyze error:", error);
    res.status(500).json({
      success: false,
      error: "Re-analysis failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ─── Dashboard Stats ────────────────────────────────────────────────────────────

/**
 * GET /api/stats
 */
exports.getStats = async (_req, res) => {
  try {
    const stats = await Resume.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stats",
    });
  }
};

// ─── Export to CSV ──────────────────────────────────────────────────────────────

/**
 * GET /api/export/csv
 * Optional query: status, min_score, max_score
 */
exports.exportCSV = async (req, res) => {
  try {
    const { status, min_score, max_score } = req.query;

    const filter = { is_archived: false };
    if (status) filter.status = status;
    if (min_score || max_score) {
      filter["analysis.match_score"] = {};
      if (min_score)
        filter["analysis.match_score"].$gte = parseInt(min_score, 10);
      if (max_score)
        filter["analysis.match_score"].$lte = parseInt(max_score, 10);
    }

    const resumes = await Resume.find(filter)
      .sort({ "analysis.match_score": -1 })
      .lean();

    if (resumes.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No candidates found matching the criteria",
      });
    }

    const csv = resumesToCSV(resumes);

    const timestamp = new Date().toISOString().split("T")[0];
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ai-screener-export-${timestamp}.csv"`
    );
    res.send(csv);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export CSV",
    });
  }
};

// ─── Download Original PDF ──────────────────────────────────────────────────────

/**
 * GET /api/candidates/:id/download
 */
exports.downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Candidate not found",
      });
    }

    const filePath = path.resolve(resume.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "PDF file not found on server",
      });
    }

    res.download(filePath, resume.original_filename);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to download resume",
    });
  }
};
