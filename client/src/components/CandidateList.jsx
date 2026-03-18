import React, { useState } from "react";
import CandidateCard from "./CandidateCard";
import { useCandidates, useDeleteCandidate, useExportCSV } from "../hooks/useResumes";

/**
 * CandidateList — Paginated, filterable list of screened candidates.
 *
 * Props:
 *   onSelectCandidate(id)  – Called when a card is clicked
 *   className              – Additional CSS classes
 */
export default function CandidateList({ onSelectCandidate, className = "" }) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("analysis.match_score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 12;

  const { data, isLoading, error } = useCandidates({
    page,
    limit,
    sort: sortBy,
    order: sortOrder,
    status: statusFilter || undefined,
    search: searchQuery || undefined,
  });

  const { mutate: remove } = useDeleteCandidate();
  const { mutate: exportCsv, isPending: isExporting } = useExportCSV();

  const candidates = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      remove(id);
    }
  };

  return (
    <div className={`w-full ${className}`} id="candidate-list-section">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="candidate-search-input"
              type="text"
              placeholder="Search candidates…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none
                         transition-all w-56"
            />
          </div>

          {/* Status Filter */}
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300
                       focus:border-indigo-500 outline-none transition-all"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="analyzing">Analyzing</option>
            <option value="failed">Failed</option>
          </select>

          {/* Sort */}
          <select
            id="sort-select"
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(":");
              setSortBy(field);
              setSortOrder(order);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300
                       focus:border-indigo-500 outline-none transition-all"
          >
            <option value="analysis.match_score:desc">Score: High → Low</option>
            <option value="analysis.match_score:asc">Score: Low → High</option>
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="candidate_name:asc">Name: A → Z</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={() => exportCsv({ status: statusFilter || undefined })}
          disabled={isExporting || pagination.total === 0}
          id="export-csv-btn"
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-100
                     px-4 py-2 text-sm font-medium text-white dark:text-gray-900
                     hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50
                     transition-all duration-200 shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {isExporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      {/* Total Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {pagination.total} candidate{pagination.total !== 1 ? "s" : ""} found
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-6 py-4 text-center">
          <p className="text-red-600 dark:text-red-400">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && candidates.length === 0 && (
        <div className="text-center py-20" id="empty-state">
          <svg
            className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            No candidates yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload resumes to get started with AI screening
          </p>
        </div>
      )}

      {/* Card Grid */}
      {candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              onClick={onSelectCandidate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2" id="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30
                       transition-colors"
          >
            ← Previous
          </button>

          {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  pageNum === page
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30
                       transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
