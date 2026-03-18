const mongoose = require("mongoose");

// ─── Sub-schemas ────────────────────────────────────────────────────────────────

const AnalysisSchema = new mongoose.Schema(
  {
    match_score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    missing_skills: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
    strengths: {
      type: [String],
      default: [],
    },
    experience_level: {
      type: String,
      enum: ["junior", "mid", "senior", "lead", "executive", null],
      default: null,
    },
    recommendation: {
      type: String,
      enum: ["strong_yes", "yes", "maybe", "no", "strong_no", null],
      default: null,
    },
  },
  { _id: false }
);

// ─── Main Resume Schema ─────────────────────────────────────────────────────────

const ResumeSchema = new mongoose.Schema(
  {
    // Candidate metadata
    candidate_name: {
      type: String,
      trim: true,
      default: "Unknown Candidate",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    // File info
    original_filename: {
      type: String,
      required: [true, "Original filename is required"],
    },
    stored_filename: {
      type: String,
      required: [true, "Stored filename is required"],
    },
    file_path: {
      type: String,
      required: [true, "File path is required"],
    },
    file_size: {
      type: Number, // bytes
      required: true,
    },
    mime_type: {
      type: String,
      default: "application/pdf",
    },

    // Extracted content
    extracted_text: {
      type: String,
      default: "",
    },
    page_count: {
      type: Number,
      default: 0,
    },

    // Job context
    job_title: {
      type: String,
      trim: true,
      default: "",
    },
    job_description: {
      type: String,
      trim: true,
      default: "",
    },

    // AI Analysis
    analysis: {
      type: AnalysisSchema,
      default: () => ({}),
    },

    // Processing status
    status: {
      type: String,
      enum: ["uploaded", "parsing", "analyzing", "completed", "failed"],
      default: "uploaded",
    },
    error_message: {
      type: String,
      default: null,
    },

    // Soft delete
    is_archived: {
      type: Boolean,
      default: false,
    },

    // Tags for filtering
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────────

ResumeSchema.index({ status: 1 });
ResumeSchema.index({ "analysis.match_score": -1 });
ResumeSchema.index({ createdAt: -1 });
ResumeSchema.index({ candidate_name: "text", job_title: "text" });

// ─── Virtuals ───────────────────────────────────────────────────────────────────

ResumeSchema.virtual("file_size_kb").get(function () {
  return this.file_size ? Math.round(this.file_size / 1024) : 0;
});

// ─── Static Methods ─────────────────────────────────────────────────────────────

/**
 * Get aggregate stats for the dashboard.
 */
ResumeSchema.statics.getStats = async function () {
  const [stats] = await this.aggregate([
    { $match: { is_archived: false } },
    {
      $group: {
        _id: null,
        total_candidates: { $sum: 1 },
        avg_score: { $avg: "$analysis.match_score" },
        max_score: { $max: "$analysis.match_score" },
        min_score: { $min: "$analysis.match_score" },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        failed: {
          $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
        },
        pending: {
          $sum: {
            $cond: [
              {
                $in: ["$status", ["uploaded", "parsing", "analyzing"]],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total_candidates: 1,
        avg_score: { $round: ["$avg_score", 1] },
        max_score: 1,
        min_score: 1,
        completed: 1,
        failed: 1,
        pending: 1,
      },
    },
  ]);

  // Score distribution buckets
  const distribution = await this.aggregate([
    {
      $match: {
        is_archived: false,
        status: "completed",
        "analysis.match_score": { $ne: null },
      },
    },
    {
      $bucket: {
        groupBy: "$analysis.match_score",
        boundaries: [0, 20, 40, 60, 80, 101],
        default: "Other",
        output: { count: { $sum: 1 } },
      },
    },
  ]);

  const score_distribution = {
    "0-19": 0,
    "20-39": 0,
    "40-59": 0,
    "60-79": 0,
    "80-100": 0,
  };

  const bucketLabels = ["0-19", "20-39", "40-59", "60-79", "80-100"];
  const boundaries = [0, 20, 40, 60, 80];
  distribution.forEach((bucket) => {
    const idx = boundaries.indexOf(bucket._id);
    if (idx !== -1) {
      score_distribution[bucketLabels[idx]] = bucket.count;
    }
  });

  // Top missing skills across all resumes
  const topMissingSkills = await this.aggregate([
    {
      $match: {
        is_archived: false,
        status: "completed",
      },
    },
    { $unwind: "$analysis.missing_skills" },
    {
      $group: {
        _id: { $toLower: "$analysis.missing_skills" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { _id: 0, skill: "$_id", count: 1 } },
  ]);

  return {
    ...(stats || {
      total_candidates: 0,
      avg_score: 0,
      max_score: 0,
      min_score: 0,
      completed: 0,
      failed: 0,
      pending: 0,
    }),
    score_distribution,
    top_missing_skills: topMissingSkills,
  };
};

module.exports = mongoose.model("Resume", ResumeSchema);
