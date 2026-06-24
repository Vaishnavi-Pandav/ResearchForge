import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Bot, ArrowLeft, Search, Shield, Sparkles, FileText,
  ChevronRight, Play, Zap, BookOpen, Loader2
} from "lucide-react";
import { useCreateResearch } from "../../hooks/useResearch";

const DEPTHS = [
  { value: "quick", label: "Quick", desc: "~2 min · 10–20 sources", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { value: "standard", label: "Standard", desc: "~5 min · 30–60 sources", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { value: "deep", label: "Deep", desc: "~10 min · 80–150 sources", color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
  { value: "exhaustive", label: "Exhaustive", desc: "~20 min · 200+ sources", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
];

const CITATIONS = ["APA", "MLA", "Harvard", "Chicago"];

const PIPELINE_STEPS = [
  { icon: <Bot className="w-3.5 h-3.5" />, label: "Query Planner", color: "from-blue-500 to-blue-600" },
  { icon: <Search className="w-3.5 h-3.5" />, label: "Web Searcher", color: "from-violet-500 to-violet-600" },
  { icon: <Shield className="w-3.5 h-3.5" />, label: "Credibility Scorer", color: "from-emerald-500 to-emerald-600" },
  { icon: <Sparkles className="w-3.5 h-3.5" />, label: "Synthesizer", color: "from-amber-500 to-orange-500" },
  { icon: <FileText className="w-3.5 h-3.5" />, label: "Citation Formatter", color: "from-pink-500 to-rose-500" },
];

function NewResearch() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("standard");
  const [citation, setCitation] = useState("APA");

  const createResearch = useCreateResearch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a research topic");
      return;
    }

    try {
      const session = await createResearch.mutateAsync({
        topic: topic.trim(),
        depth,
        citation_style: citation,
      });
      toast.success("Research started! Agents are working...");
      navigate(`/research/${session.id}`);
    } catch (err) {
      // If backend is unavailable, navigate to a demo view
      if (err.message?.includes("Network") || err.message?.includes("ECONNREFUSED")) {
        toast("Backend not running — showing demo mode", { icon: "⚠️" });
        navigate("/dashboard");
      } else {
        toast.error(err.message || "Failed to start research");
      }
    }
  };

  const selectedDepth = DEPTHS.find((d) => d.value === depth);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Start New Research</h1>
              <p className="text-gray-500 text-sm">Powered by 5 specialized AI agents · 100% free</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic input */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Research Topic</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The impact of artificial intelligence on climate change mitigation strategies"
              rows={3}
              className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none text-sm leading-relaxed"
            />
            <p className="text-xs text-gray-600 mt-2">{topic.length}/2000 characters · Be specific for best results</p>
          </motion.div>

          {/* Depth */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Research Depth</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DEPTHS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDepth(d.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    depth === d.value
                      ? d.color + " shadow-sm"
                      : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:bg-white/[0.04]"
                  }`}
                >
                  <p className="font-bold text-sm">{d.label}</p>
                  <p className="text-[10px] mt-0.5 opacity-75">{d.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Citation style */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Citation Style</label>
            <div className="flex gap-3 flex-wrap">
              {CITATIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCitation(c)}
                  className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                    citation === c
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                      : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:text-white hover:border-white/20"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Pipeline preview */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Agent Pipeline</p>
            <div className="flex items-center gap-2 flex-wrap">
              {PIPELINE_STEPS.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <div className={`w-4 h-4 rounded bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}>
                      {step.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-400">{step.label}</span>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <button
              type="submit"
              disabled={createResearch.isPending || !topic.trim()}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-gray-700 disabled:to-gray-700 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {createResearch.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting Research Pipeline...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Launch Research · {selectedDepth?.label} Mode
                  <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default NewResearch;
