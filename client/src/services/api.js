import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Axios Instance ─────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 min timeout for AI processing
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Response Interceptor ───────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    console.error("[API Error]", message);
    return Promise.reject(new Error(message));
  }
);

// ─── Upload Resumes ─────────────────────────────────────────────────────────────

/**
 * Upload one or more PDF resumes with optional job context.
 *
 * @param {File[]} files           – Array of File objects (PDF)
 * @param {object} options
 * @param {string} options.jobTitle
 * @param {string} options.jobDescription
 * @param {function} options.onProgress – Progress callback (0-100)
 * @returns {Promise<object>}
 */
export async function uploadResumes(files, options = {}) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("resumes", file);
  });

  if (options.jobTitle) {
    formData.append("job_title", options.jobTitle);
  }
  if (options.jobDescription) {
    formData.append("job_description", options.jobDescription);
  }

  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (options.onProgress && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        options.onProgress(percent);
      }
    },
  });
}

// ─── Candidates ─────────────────────────────────────────────────────────────────

/**
 * Fetch paginated list of candidates.
 *
 * @param {object} params – { page, limit, sort, order, status, min_score, max_score, search }
 */
export async function fetchCandidates(params = {}) {
  return api.get("/candidates", { params });
}

/**
 * Fetch a single candidate by ID.
 */
export async function fetchCandidateById(id) {
  return api.get(`/candidates/${id}`);
}

/**
 * Delete a candidate.
 */
export async function deleteCandidate(id) {
  return api.delete(`/candidates/${id}`);
}

/**
 * Re-analyze a candidate with optional new job context.
 */
export async function reanalyzeCandidate(id, options = {}) {
  return api.post(`/candidates/${id}/reanalyze`, {
    job_title: options.jobTitle,
    job_description: options.jobDescription,
  });
}

// ─── Stats ──────────────────────────────────────────────────────────────────────

export async function fetchStats() {
  return api.get("/stats");
}

// ─── CSV Export ─────────────────────────────────────────────────────────────────

/**
 * Download the CSV export. Triggers browser file save.
 *
 * @param {object} params – { status, min_score, max_score }
 */
export async function exportCSV(params = {}) {
  const response = await axios.get(`${API_BASE_URL}/export/csv`, {
    params,
    responseType: "blob",
    timeout: 30000,
  });

  // Create download link
  const blob = new Blob([response.data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const timestamp = new Date().toISOString().split("T")[0];
  link.download = `ai-screener-export-${timestamp}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// ─── Health Check ───────────────────────────────────────────────────────────────

export async function healthCheck() {
  return api.get("/health");
}

export default api;
