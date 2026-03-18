const { Parser } = require("json2csv");

/**
 * Converts an array of Resume documents into a CSV string.
 *
 * @param {Array} resumes – Array of resume Mongoose documents (lean or plain)
 * @returns {string} CSV formatted string
 */
function resumesToCSV(resumes) {
  const rows = resumes.map((r) => ({
    candidate_name: r.candidate_name || "Unknown",
    email: r.email || "N/A",
    job_title: r.job_title || "N/A",
    original_filename: r.original_filename,
    match_score: r.analysis?.match_score ?? "N/A",
    experience_level: r.analysis?.experience_level || "N/A",
    recommendation: r.analysis?.recommendation || "N/A",
    summary: r.analysis?.summary || "",
    strengths: (r.analysis?.strengths || []).join("; "),
    missing_skills: (r.analysis?.missing_skills || []).join("; "),
    status: r.status,
    uploaded_at: r.createdAt
      ? new Date(r.createdAt).toISOString()
      : "",
  }));

  const fields = [
    { label: "Candidate Name", value: "candidate_name" },
    { label: "Email", value: "email" },
    { label: "Applied For", value: "job_title" },
    { label: "Resume File", value: "original_filename" },
    { label: "Match Score (%)", value: "match_score" },
    { label: "Experience Level", value: "experience_level" },
    { label: "Recommendation", value: "recommendation" },
    { label: "AI Summary", value: "summary" },
    { label: "Strengths", value: "strengths" },
    { label: "Missing Skills", value: "missing_skills" },
    { label: "Status", value: "status" },
    { label: "Uploaded At", value: "uploaded_at" },
  ];

  const parser = new Parser({ fields });
  return parser.parse(rows);
}

module.exports = { resumesToCSV };
