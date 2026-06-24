import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  History, ArrowLeft, Search, Filter, Clock, CheckCircle2,
  ChevronRight, FileText, Loader2, Bot, AlertCircle, Plus
} from "lucide-react";
import { useResearchSessions } from "../../hooks/useResearch";

const DEPTH_COLORS = {
  quick: "text-emerald-400 bg-emerald-500/10",
  standard: "text-blue-400 bg-blue-500/10",
  deep: "text-violet-400 bg-violet-500/10",
  exhaustive: "text-amber-400 bg-amber-500/10",
};

const STATUS_CONFIG = {
  completed: { label: "Completed", icon: <CheckCircle2 className="w-3 h-3" />, color: "text-emerald-400 bg-emerald-500/10" },
  failed: { label: "Failed", icon: <AlertCircle className="w-3 h-3" />, color: "text-red-400 bg-red-500/10" },
  pending: { label: "Pending", icon: <Clock className="w-3 h-3" />, color: "text-amber-400 bg-amber-500/10" },
  planning: { label: "Planning", icon: <Bot className="w-3 h-3" />, color: "text-blue-400 bg-blue-500/10" },
  searching: { label: "Searching", icon: <Search className="w-3 h-3" />, color: "text-violet-400 bg-violet-500/10" },
  scoring: { label: "Scoring", icon: <Clock className="w-3 h-3" />, color: "text-blue-400 bg-blue-500/10" },
  synthesizing: { label: "Synthesizing", icon: <Clock className="w-3 h-3" />, color: "text-amber-400 bg-amber-500/10" },
  formatting: { label: "Formatting", icon: <FileText className="w-3 h-3" />, color: "text-pink-400 bg-pink-500/10" },
};

const FILTER_OPTIONS = ["All", "Completed", "In Progress", "Failed"];

function ResearchHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: sessions = [], isLoading } = useResearchSessions();

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Completed" && s.status === "completed") ||
      (activeFilter === "Failed" && s.status === "failed") ||
      (activeFilter === "In Progress" && !["completed", "failed"].includes(s.status));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Research History</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isLoading ? "Loading..." : `${sessions.length} research session${sessions.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all w-full md:w-60"
              />
            </div>
            <button
              onClick={() => navigate("/research/new")}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTER_OPTIONS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === f
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10"
              }`}>{f}</button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredSessions.length === 0 && (
          <div className="p-16 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-center">
            <History className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <p className="font-bold text-gray-400 mb-2">
              {sessions.length === 0 ? "No research sessions yet" : "No results found"}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {sessions.length === 0
                ? "Start your first research session to see it here"
                : "Try adjusting your search or filter"}
            </p>
            {sessions.length === 0 && (
              <button onClick={() => navigate("/research/new")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all">
                <Plus className="w-4 h-4" /> Start Research
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!isLoading && filteredSessions.length > 0 && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Depth</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Citations</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredSessions.map((session, i) => {
                    const statusCfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
                    const depthColor = DEPTH_COLORS[session.depth] || "text-gray-400 bg-gray-500/10";
                    return (
                      <motion.tr
                        key={session.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => navigate(`/research/${session.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="font-semibold text-gray-200 group-hover:text-white transition-colors line-clamp-1 max-w-[280px] text-sm">
                              {session.topic}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(session.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${depthColor}`}>
                            {session.depth?.charAt(0).toUpperCase() + session.depth?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{session.citation_style}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${statusCfg.color}`}>
                            {statusCfg.icon} {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-500 group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchHistory;
