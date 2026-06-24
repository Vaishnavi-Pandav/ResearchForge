import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FileText, ArrowLeft, Plus, Download, Eye, Loader2,
  BookOpen, CheckCircle2, Trash2, RefreshCw
} from "lucide-react";
import { useReports, useDeleteReport } from "../../hooks/useReports";

function ReportsPage() {
  const navigate = useNavigate();
  const { data: reports = [], isLoading, error } = useReports();
  const deleteReport = useDeleteReport();

  const handleDelete = async (e, reportId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    try {
      await deleteReport.mutateAsync(reportId);
      toast.success("Report deleted");
    } catch {
      toast.error("Failed to delete report");
    }
  };

  const handleDownload = (e, report) => {
    e.stopPropagation();
    const blob = new Blob([report.full_content || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title || "report"}.md`;
    a.click();
    toast.success("Downloaded as Markdown!");
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Reports</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isLoading ? "Loading..." : `${reports.length} generated research report${reports.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button onClick={() => navigate("/research/new")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" /> New Research
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-gray-500 text-sm">Loading reports...</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && reports.length === 0 && (
          <div className="p-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <p className="font-bold text-gray-400 mb-2">No reports yet</p>
            <p className="text-sm text-gray-600 mb-6">Start a research session to generate your first report</p>
            <button onClick={() => navigate("/research/new")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all">
              <Plus className="w-4 h-4" /> Start Research
            </button>
          </div>
        )}

        {/* Reports list */}
        {!isLoading && reports.length > 0 && (
          <div className="space-y-3">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => navigate(`/reports/${report.id}`)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.04] transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate group-hover:text-blue-300 transition-colors">
                    {report.title || "Untitled Report"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {" · "}{report.citation_style}
                    {report.word_count > 0 && ` · ${report.word_count.toLocaleString()} words`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                  </span>
                  <button
                    onClick={(e) => handleDownload(e, report)}
                    className="p-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    title="Download Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => navigate(`/reports/${report.id}`)}
                    className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, report.id)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
