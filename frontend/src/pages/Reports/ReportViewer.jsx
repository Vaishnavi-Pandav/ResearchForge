import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import {
  ArrowLeft, Download, FileText, Shield, ExternalLink,
  Copy, CheckCheck, BookOpen, Loader2, AlertCircle, Star
} from "lucide-react";
import { useReport } from "../../hooks/useReports";

// Static sample used when backend is offline
const DEMO_REPORT = {
  id: "demo",
  title: "Impact of Large Language Models on Scientific Research",
  executive_summary: "Large language models are fundamentally reshaping how scientists conduct literature reviews, formulate hypotheses, and communicate findings.",
  citation_style: "APA",
  word_count: 1240,
  created_at: new Date().toISOString(),
  full_content: `# Impact of Large Language Models on Scientific Research

## Executive Summary

Large language models (LLMs) are fundamentally reshaping how scientists conduct literature reviews, formulate hypotheses, and communicate findings. This report analyzes sources to synthesize current evidence on LLM integration in research workflows.

## Key Findings

### 1. Accelerating Literature Reviews
AI-assisted literature reviews reduce time-to-synthesis by **62–78%**, while maintaining or improving coverage breadth.

### 2. Hypothesis Generation
LLM-aided hypothesis generation leads to **3.2× more testable hypotheses** per research session.

### 3. Writing & Communication
AI-assisted scientific writing improved clarity scores by an average of **1.8 points** on a 10-point scale.

## Methodology

- **Search Tool**: DuckDuckGo (free, no API key required)
- **LLM**: Google Gemini 1.5 Flash (free tier)
- **Average Credibility Score**: 8.7/10

## Conclusion

LLMs are not replacing researchers — they are amplifying research capacity.
`,
  citations: [
    { id: "1", apa: "Smith, J. (2024). AI in Research. Nature, 12(3), 45-67.", mla: 'Smith, J. "AI in Research." Nature, vol. 12, no. 3, 2024, pp. 45-67.' },
  ],
  sources: [
    { id: "s1", title: "AI Augmentation in Scientific Discovery", domain: "nature.com", credibility_score: 9.4, url: "#" },
    { id: "s2", title: "LLMs and Hypothesis Generation", domain: "science.org", credibility_score: 9.1, url: "#" },
  ],
};

function ReportViewer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [citationStyle, setCitationStyle] = useState("apa");

  const { data: report, isLoading, error } = useReport(id === "demo" ? null : id);

  const displayReport = report || (error || id === "demo" ? DEMO_REPORT : null);

  const handleCopy = async () => {
    const text = displayReport?.full_content || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Report copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([displayReport?.full_content || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${displayReport?.title || "report"}.md`;
    a.click();
    toast.success("Downloaded as Markdown!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!displayReport) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white font-bold mb-2">Report not found</p>
          <button onClick={() => navigate("/reports")} className="text-blue-400 hover:text-blue-300 text-sm">← Back to Reports</button>
        </div>
      </div>
    );
  }

  const sources = displayReport.sources || [];
  const citations = displayReport.citations || [];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button onClick={() => navigate("/reports")}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </button>
          <div className="flex gap-3">
            <button onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm font-medium hover:bg-white/[0.06] transition-all">
              {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={handleDownloadMarkdown}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>

        {/* Title + meta */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">{displayReport.title}</h1>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> {displayReport.citation_style} Citations
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> {sources.length} Sources
            </span>
            {displayReport.word_count > 0 && (
              <span>{displayReport.word_count.toLocaleString()} words</span>
            )}
            <span>{new Date(displayReport.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report content */}
          <div className="lg:col-span-2">
            <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <div className="prose prose-invert prose-sm max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-400 prose-strong:text-white prose-code:text-emerald-400">
                <ReactMarkdown>{displayReport.full_content}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Sources */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sources ({sources.length})</h3>
              <div className="space-y-3">
                {sources.length === 0 && (
                  <p className="text-sm text-gray-600 text-center py-4">No sources data</p>
                )}
                {sources.map((source, i) => (
                  <div key={source.id || i} className="group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-300 group-hover:text-white truncate">{source.title}</p>
                        <p className="text-xs text-gray-600">{source.domain}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">{source.credibility_score?.toFixed(1) || "—"}</span>
                      </div>
                    </div>
                    {source.url && source.url !== "#" && (
                      <a href={source.url} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-blue-500 hover:text-blue-400 flex items-center gap-1 mt-1">
                        <ExternalLink className="w-2.5 h-2.5" /> View source
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Citations */}
            {citations.length > 0 && (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Citations</h3>
                  <div className="flex gap-1">
                    {["apa", "mla", "chicago", "harvard"].map((style) => (
                      <button key={style} onClick={() => setCitationStyle(style)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                          citationStyle === style ? "bg-blue-500/20 text-blue-400" : "text-gray-600 hover:text-gray-400"
                        }`}>{style}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {citations.slice(0, 5).map((cit, i) => (
                    <div key={cit.id || i} className="text-xs text-gray-400 leading-relaxed border-l-2 border-white/[0.06] pl-3">
                      {cit[citationStyle] || cit.apa || "Citation formatting in progress"}
                    </div>
                  ))}
                  {citations.length > 5 && (
                    <p className="text-xs text-gray-600 text-center">+{citations.length - 5} more citations</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportViewer;
