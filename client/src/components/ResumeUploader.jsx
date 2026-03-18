import React, { useState, useCallback, useRef } from "react";
import { useUploadResumes } from "../hooks/useResumes";

/**
 * ResumeUploader — Stitch-ready drag & drop file uploader component.
 *
 * Props:
 *   onUploadComplete(results) – callback when upload + analysis finishes
 *   className                 – additional CSS classes for Stitch styling
 */
export default function ResumeUploader({ onUploadComplete, className = "" }) {
  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { mutate: upload, isPending, isError, error } = useUploadResumes();

  // ─── Drag & Drop Handlers ──────────────────────────────────────────────────

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  // ─── File Input Handler ───────────────────────────────────────────────────

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploadProgress(0);

    upload(
      {
        files,
        jobTitle,
        jobDescription,
        onProgress: setUploadProgress,
      },
      {
        onSuccess: (result) => {
          setFiles([]);
          setUploadProgress(0);
          setJobTitle("");
          setJobDescription("");
          onUploadComplete?.(result);
        },
      }
    );
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center
            transition-all duration-300 ease-in-out
            ${
              isDragging
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.02]"
                : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="resume-file-input"
          />

          <div className="space-y-3">
            <div className="flex justify-center">
              <svg
                className={`h-12 w-12 transition-colors ${
                  isDragging ? "text-indigo-500" : "text-gray-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {isDragging
                ? "Drop your resumes here"
                : "Drag & drop PDF resumes"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse • Max 10 files, 10MB each
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2" id="selected-files-list">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </h4>
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-2.5"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Job Context Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="job-title-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Target Role (optional)
            </label>
            <input
              id="job-title-input"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Developer"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100
                         placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                         transition-all outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="job-desc-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Job Description (optional)
            </label>
            <textarea
              id="job-desc-input"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here for better matching accuracy..."
              rows={4}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100
                         placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                         transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* Upload Progress */}
        {isPending && (
          <div className="space-y-2" id="upload-progress">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Uploading & analyzing…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400"
            id="upload-error"
          >
            {error?.message || "Upload failed. Please try again."}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={files.length === 0 || isPending}
          id="upload-submit-btn"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3
                     text-sm font-semibold text-white shadow-lg shadow-indigo-500/25
                     hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-indigo-500/30
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                     transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {isPending
            ? "Analyzing Resumes…"
            : `Screen ${files.length || ""} Resume${files.length !== 1 ? "s" : ""}`}
        </button>
      </form>
    </div>
  );
}
