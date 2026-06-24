import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Clock, Search, Shield, Sparkles, FileText,
  Database, Check, Loader2, AlertCircle, Bot, RefreshCw
} from "lucide-react";
import { useResearchSession } from "../../hooks/useResearch";

const AGENT_CONFIG = {
  planner:     { label: "Query Planner",     icon: Bot,       color: "text-blue-400",    bg: "bg-blue-500/10",    glow: "shadow-blue-500/20" },
  searcher:    { label: "Web Searcher",      icon: Search,    color: "text-violet-400",  bg: "bg-violet-500/10",  glow: "shadow-violet-500/20" },
  credibility: { label: "Credibility Scorer",icon: Shield,    color: "text-emerald-400", bg: "bg-emerald-500/10", glow: "shadow-emerald-500/20" },
  synthesizer: { label: "Synthesizer",       icon: Sparkles,  color: "text-amber-400",   bg: "bg-amber-500/10",   glow: "shadow-amber-500/20" },
  citation:    { label: "Citation Formatter",icon: FileText,  color: "text-pink-400",    bg: "bg-pink-500/10",    glow: "shadow-pink-500/20" },
};

const AGENT_ORDER = ["planner", "searcher", "credibility", "synthesizer", "citation"];

const STATUS_LABELS = {
  pending: "Queued",
  planning: "Planning research strategy...",
  searching: "Searching the web for sources...",
  scoring: "Evaluating source credibility...",
  synthesizing: "Synthesizing findings into report...",
  formatting: "Formatting citations...",
  completed: "Research complete!",
  failed: "Research failed",
};

function AgentStatusIcon({ status }) {
  if (status === "done") return <Check className="w-4 h-4 text-emerald-400" />;
  if (status === "running") return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
  return <div className="w-2 h-2 rounded-full bg-gray-700 mx-auto" />;
}

function ResearchDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: session, isLoading, error } = useResearchSession(id);

  // Derive agent statuses from session
  const agentStatuses = session?.agent_statuses || {};
  const sessionStatus = session?.status || "pending";
  const isCompleted = sessionStatus === "completed";
  const isFailed = sessionStatus === "failed";
  const isInProgress = !isCompleted && !isFailed;

  // Find the related report ID (first report from session)
  const reportId = session?.reports?.[0]?.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading research session...</p>
        </div>
      </div>
    );
  }

  // Demo mode when no session found (backend offline)
  const displaySession = session || {
    id: id,
    topic: "Demo Research Session",
    depth: "standard",
    citation_style: "APA",
    status: "completed",
    agent_statuses: { planner: "done", searcher: "done", credibility: "done", synthesizer: "done", citation: "done" },
    created_at: new Date().toISOString(),
  };

  const displayStatuses = displaySession.agent_statuses || {};
  const displayStatus = displaySession.status;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/research/history")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                displayStatus === "completed" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                displayStatus === "failed" ? "bg-red-500/10 border border-red-500/20 text-red-400" :
                "bg-blue-500/10 border border-blue-500/20 text-blue-400"
              }`}>
                {displayStatus === "completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {displayStatus === "failed" && <AlertCircle className="w-3.5 h-3.5" />}
                {isInProgress && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {displayStatus === "completed" ? "Completed" : displayStatus === "failed" ? "Failed" : STATUS_LABELS[displayStatus] || "In Progress"}
              </span>
              {isInProgress && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Auto-refreshing
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
              {displaySession.topic}
            </h1>
            <p className="text-sm text-gray-500">
              {displaySession.depth} depth · {displaySession.citation_style} citations
            </p>
          </div>

          {displayStatus === "completed" && (
            <button
              onClick={() => navigate(reportId ? `/reports/${reportId}` : "/reports")}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all text-sm"
            >
              <FileText className="w-4 h-4" /> View Full Report
            </button>
          )}
        </div>

        {/* Agent pipeline live view */}
        <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] mb-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Agent Pipeline</h2>
          <div className="space-y-4 relative">
            <div className="absolute left-5 top-5 bottom-5 w-px bg-white/[0.04] -z-10" />
            {AGENT_ORDER.map((agentKey, idx) => {
              const cfg = AGENT_CONFIG[agentKey];
              const status = displayStatuses[agentKey] || "idle";
              const Icon = cfg.icon;
              return (
                <motion.div key={agentKey} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    status === "running" ? "bg-blue-500/5 border-blue-500/20 shadow-lg " + cfg.glow :
                    status === "done" ? "bg-white/[0.02] border-white/[0.04]" :
                    "bg-white/[0.01] border-white/[0.03] opacity-50"
                  }`}>
                  <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0 z-10`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm">{cfg.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {status === "done" ? "✓ Completed" :
                       status === "running" ? "Processing..." :
                       "Waiting..."}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <AgentStatusIcon status={status} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Plan preview (if available) */}
        {displaySession?.plan && (
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] mb-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Research Plan</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {displaySession.plan.objectives?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-2">Objectives</p>
                  <ul className="space-y-1">
                    {displaySession.plan.objectives.map((o, i) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-blue-400 font-bold">{i + 1}.</span> {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {displaySession.plan.subtopics?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-2">Subtopics</p>
                  <div className="flex flex-wrap gap-2">
                    {displaySession.plan.subtopics.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {isFailed && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {displaySession.error_message || "The research pipeline encountered an error. Please try again."}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchDetails;
