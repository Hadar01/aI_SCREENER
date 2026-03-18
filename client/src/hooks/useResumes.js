import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  uploadResumes,
  fetchCandidates,
  fetchCandidateById,
  deleteCandidate,
  reanalyzeCandidate,
  fetchStats,
  exportCSV,
} from "../services/api";

// ─── Query Keys ─────────────────────────────────────────────────────────────────

export const queryKeys = {
  candidates: (params) => ["candidates", params],
  candidate: (id) => ["candidate", id],
  stats: ["stats"],
};

// ─── Upload Hook ────────────────────────────────────────────────────────────────

/**
 * Upload resumes mutation.
 *
 * Usage:
 *   const { mutate, isPending, isError, error } = useUploadResumes();
 *   mutate({ files, jobTitle, jobDescription, onProgress });
 */
export function useUploadResumes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ files, jobTitle, jobDescription, onProgress }) =>
      uploadResumes(files, { jobTitle, jobDescription, onProgress }),
    onSuccess: () => {
      // Invalidate both candidate list and stats after upload
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ─── Candidates Hook ───────────────────────────────────────────────────────────

/**
 * Fetch paginated candidate list.
 *
 * Usage:
 *   const { data, isLoading, error } = useCandidates({ page: 1, limit: 20, sort: 'analysis.match_score' });
 */
export function useCandidates(params = {}) {
  return useQuery({
    queryKey: queryKeys.candidates(params),
    queryFn: () => fetchCandidates(params),
    keepPreviousData: true,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// ─── Single Candidate Hook ─────────────────────────────────────────────────────

/**
 * Fetch single candidate by ID.
 *
 * Usage:
 *   const { data, isLoading } = useCandidate(candidateId);
 */
export function useCandidate(id) {
  return useQuery({
    queryKey: queryKeys.candidate(id),
    queryFn: () => fetchCandidateById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

// ─── Delete Hook ────────────────────────────────────────────────────────────────

/**
 * Delete candidate mutation.
 *
 * Usage:
 *   const { mutate: remove } = useDeleteCandidate();
 *   remove(candidateId);
 */
export function useDeleteCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteCandidate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ─── Re-analyze Hook ───────────────────────────────────────────────────────────

/**
 * Re-analyze a candidate with potentially new job context.
 *
 * Usage:
 *   const { mutate: rerun } = useReanalyze();
 *   rerun({ id: candidateId, jobTitle: '...', jobDescription: '...' });
 */
export function useReanalyze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, jobTitle, jobDescription }) =>
      reanalyzeCandidate(id, { jobTitle, jobDescription }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidate(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ─── Stats Hook ─────────────────────────────────────────────────────────────────

/**
 * Fetch dashboard stats.
 *
 * Usage:
 *   const { data: stats, isLoading } = useStats();
 */
export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: fetchStats,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 min
  });
}

// ─── CSV Export Hook ────────────────────────────────────────────────────────────

/**
 * Export candidates to CSV (triggers download).
 *
 * Usage:
 *   const { mutate: download, isPending } = useExportCSV();
 *   download({ status: 'completed', min_score: 60 });
 */
export function useExportCSV() {
  return useMutation({
    mutationFn: (params) => exportCSV(params),
  });
}
