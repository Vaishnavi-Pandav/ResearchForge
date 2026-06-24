/**
 * React Query hooks for research sessions.
 * Covers create, list, detail, sources.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

// ── Fetch all sessions for current user ──────────────────────────────────────
export function useResearchSessions() {
  return useQuery({
    queryKey: ["research", "sessions"],
    queryFn: () => apiClient.get("/research/"),
    staleTime: 30_000,
    retry: 2,
  });
}

// ── Fetch a single session ────────────────────────────────────────────────────
export function useResearchSession(sessionId) {
  return useQuery({
    queryKey: ["research", "session", sessionId],
    queryFn: () => apiClient.get(`/research/${sessionId}`),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      // Poll every 3s while session is in progress
      const status = query.state.data?.status;
      const inProgress = ["pending", "planning", "searching", "scoring", "synthesizing", "formatting"];
      return inProgress.includes(status) ? 3000 : false;
    },
  });
}

// ── Create new research session ───────────────────────────────────────────────
export function useCreateResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post("/research/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
    },
  });
}

// ── Fetch sources for a session ───────────────────────────────────────────────
export function useSessionSources(sessionId) {
  return useQuery({
    queryKey: ["research", "sources", sessionId],
    queryFn: () => apiClient.get(`/research/${sessionId}/sources`),
    enabled: !!sessionId,
    staleTime: 60_000,
  });
}

// ── Analytics stats ───────────────────────────────────────────────────────────
export function useAnalyticsStats() {
  return useQuery({
    queryKey: ["research", "analytics"],
    queryFn: () => apiClient.get("/research/analytics"),
    staleTime: 60_000,
    retry: 1,
    // Return safe defaults if API is unavailable (e.g. backend not running)
    placeholderData: {
      total_sessions: 0,
      total_reports: 0,
      total_sources: 0,
      avg_credibility: 0,
      sessions_this_week: 0,
      completion_rate: 0,
    },
  });
}
