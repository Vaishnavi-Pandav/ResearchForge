/**
 * React Query hooks for reports.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

// ── Fetch all reports ─────────────────────────────────────────────────────────
export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => apiClient.get("/reports/"),
    staleTime: 30_000,
  });
}

// ── Fetch a single report with citations and sources ──────────────────────────
export function useReport(reportId) {
  return useQuery({
    queryKey: ["reports", reportId],
    queryFn: () => apiClient.get(`/reports/${reportId}`),
    enabled: !!reportId,
    staleTime: 60_000,
  });
}

// ── Delete a report ───────────────────────────────────────────────────────────
export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId) => apiClient.delete(`/reports/${reportId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
