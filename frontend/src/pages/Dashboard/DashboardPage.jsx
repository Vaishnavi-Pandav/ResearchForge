import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useAnalyticsStats, useResearchSessions } from "../../hooks/useResearch";
import {
  Bot, FileText, Plus, History, Settings, LogOut, Search,
  LayoutDashboard, BookOpen, BarChart3, Bell, User as UserIcon,
  Upload, Bookmark, ChevronRight, TrendingUp, TrendingDown,
  Minus, Eye, Download, RefreshCw, CheckCircle2, Clock, AlertCircle,
  Sparkles, Shield, Zap, X, Menu
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, to: "/dashboard" },
  { label: "New Research", icon: <Plus className="w-5 h-5" />, to: "/research/new" },
  { label: "Research History", icon: <History className="w-5 h-5" />, to: "/research/history" },
  { label: "Reports", icon: <FileText className="w-5 h-5" />, to: "/reports" },
  { label: "Profile", icon: <UserIcon className="w-5 h-5" />, to: "/profile" },
  { label: "Settings", icon: <Settings className="w-5 h-5" />, to: "/settings" },
];

const AGENT_ICON_MAP = {
  planner: <Bot className="w-4 h-4" />,
  searcher: <Search className="w-4 h-4" />,
  credibility: <Shield className="w-4 h-4" />,
  synthesizer: <Sparkles className="w-4 h-4" />,
  citation: <FileText className="w-4 h-4" />,
};

const STATUS_COLORS = {
  completed: "text-emerald-400 bg-emerald-500/10",
  "In Progress": "text-blue-400 bg-blue-500/10",
  pending: "text-amber-400 bg-amber-500/10",
  failed: "text-red-400 bg-red-500/10",
};

function StatCard({ label, value, icon, color, bg, trend, up, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}>{icon}</div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-bold ${up ? "text-emerald-400" : "text-red-400"}`}>
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-white mb-1">
        {isLoading ? <span className="text-gray-600 text-lg">—</span> : value}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </motion.div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real data from API
  const { data: statsData, isLoading: statsLoading } = useAnalyticsStats();
  const { data: sessions, isLoading: sessionsLoading } = useResearchSessions();

  const displayName = user?.displayName || "Researcher";
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Build stats from real data
  const stats = [
    {
      label: "Research Projects", value: statsData?.total_sessions?.toString() || "0",
      icon: <LayoutDashboard className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10", trend: null
    },
    {
      label: "Reports Generated", value: statsData?.total_reports?.toString() || "0",
      icon: <FileText className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10", trend: null
    },
    {
      label: "Sources Analyzed", value: statsData?.total_sources?.toLocaleString() || "0",
      icon: <BookOpen className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: null
    },
    {
      label: "Avg Credibility", value: statsData?.avg_credibility ? `${statsData.avg_credibility}/10` : "—",
      icon: <Shield className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10", trend: null
    },
  ];

  // Recent sessions from API
  const recentSessions = (sessions || []).slice(0, 5);

  const getStatusDisplay = (status) => {
    const map = {
      completed: { label: "Completed", color: "text-emerald-400 bg-emerald-500/10" },
      pending: { label: "Pending", color: "text-amber-400 bg-amber-500/10" },
      planning: { label: "Planning", color: "text-blue-400 bg-blue-500/10" },
      searching: { label: "Searching", color: "text-blue-400 bg-blue-500/10" },
      scoring: { label: "Scoring", color: "text-blue-400 bg-blue-500/10" },
      synthesizing: { label: "Synthesizing", color: "text-violet-400 bg-violet-500/10" },
      formatting: { label: "Formatting", color: "text-pink-400 bg-pink-500/10" },
      failed: { label: "Failed", color: "text-red-400 bg-red-500/10" },
    };
    return map[status] || { label: status, color: "text-gray-400 bg-gray-500/10" };
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "p-6" : "p-6"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-black text-white tracking-tight">ResearchForge</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
              }`}>
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.06] pt-4 mt-4">
        <Link to="/profile" className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0D1117] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.06] flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0D1117] border-r border-white/[0.06] z-50 md:hidden">
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Nav */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0D1117]/80 backdrop-blur-xl border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-black text-white tracking-tight">Dashboard</h1>
              <p className="text-xs text-gray-500 hidden md:block">Welcome back, {displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/research/new")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4" /> New Research
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-7xl">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-4`}>{s.icon}</div>
                <p className="text-2xl font-black text-white mb-1">
                  {statsLoading ? <span className="text-gray-600">—</span> : s.value}
                </p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "New Research", icon: <Plus className="w-5 h-5" />, desc: "Start AI research", color: "from-blue-600 to-violet-600", to: "/research/new" },
                { label: "View History", icon: <History className="w-5 h-5" />, desc: "Past sessions", color: "from-emerald-600 to-teal-600", to: "/research/history" },
                { label: "Reports", icon: <FileText className="w-5 h-5" />, desc: "Your reports", color: "from-violet-600 to-purple-600", to: "/reports" },
                { label: "Profile", icon: <UserIcon className="w-5 h-5" />, desc: "Account settings", color: "from-amber-600 to-orange-500", to: "/profile" },
              ].map((action, i) => (
                <motion.button key={action.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => navigate(action.to)}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-left transition-all group">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
                    {action.icon}
                  </div>
                  <p className="font-bold text-white text-sm">{action.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Research */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Research</h2>
              <button onClick={() => navigate("/research/history")} className="text-xs text-blue-400 hover:text-blue-300 font-medium">View all →</button>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              {sessionsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <RefreshCw className="w-5 h-5 text-gray-600 animate-spin" />
                </div>
              ) : recentSessions.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold">No research yet</p>
                  <p className="text-sm text-gray-600 mt-1">Start your first research session above</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {recentSessions.map((session, i) => {
                    const statusDisplay = getStatusDisplay(session.status);
                    return (
                      <motion.div key={session.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                        onClick={() => navigate(`/research/${session.id}`)}>
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-200 group-hover:text-white transition-colors truncate text-sm">{session.topic}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(session.created_at).toLocaleDateString()} · {session.depth} · {session.citation_style}
                          </p>
                        </div>
                        <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${statusDisplay.color}`}>
                          {statusDisplay.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
