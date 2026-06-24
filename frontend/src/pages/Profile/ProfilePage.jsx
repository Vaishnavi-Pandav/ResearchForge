import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft, User, Mail, Shield, LogOut, Edit2, Check, X,
  BarChart3, BookOpen, FileText, Star, Sparkles
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAnalyticsStats } from "../../hooks/useResearch";

const PLAN_BADGES = {
  free: { label: "Free Plan", color: "text-gray-400 bg-gray-500/10 border-gray-500/20" },
  pro: { label: "Pro Plan", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  enterprise: { label: "Enterprise", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
};

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: stats } = useAnalyticsStats();

  const displayName = user?.displayName || "Researcher";
  const email = user?.email || "";
  const initials = displayName.charAt(0).toUpperCase();
  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const planBadge = PLAN_BADGES["free"];

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const usageItems = [
    { label: "Research Projects", value: stats?.total_sessions || 0, icon: <BookOpen className="w-4 h-4" />, color: "text-blue-400", max: 10 },
    { label: "Reports Generated", value: stats?.total_reports || 0, icon: <FileText className="w-4 h-4" />, color: "text-violet-400", max: 10 },
    { label: "Sources Analyzed", value: stats?.total_sources || 0, icon: <BarChart3 className="w-4 h-4" />, color: "text-emerald-400", max: 500 },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="text-2xl font-black tracking-tight mb-8">Profile</h1>

        {/* Avatar + Identity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] mb-4">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-[#0D1117] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-xl font-black text-white">{displayName}</h2>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${planBadge.color}`}>
                  {planBadge.label}
                </span>
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {email}
              </p>
              <p className="text-gray-600 text-xs mt-1">Member since {joinDate}</p>
            </div>
          </div>
        </motion.div>

        {/* Usage Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Usage Statistics</h3>
          <div className="space-y-4">
            {usageItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`flex items-center gap-2 ${item.color}`}>
                    {item.icon}
                    <span className="text-sm font-medium text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className={`h-full rounded-full bg-gradient-to-r ${
                      item.color.includes("blue") ? "from-blue-500 to-blue-400" :
                      item.color.includes("violet") ? "from-violet-500 to-violet-400" :
                      "from-emerald-500 to-emerald-400"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          {stats?.avg_credibility > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Avg Source Credibility
              </span>
              <span className="text-sm font-bold text-emerald-400">{stats.avg_credibility}/10</span>
            </div>
          )}
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Account</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Display Name</p>
                  <p className="text-sm font-medium text-white">{displayName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-white">{email}</p>
                </div>
              </div>
              {user?.emailVerified && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Verified</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Authentication</p>
                  <p className="text-sm font-medium text-white">Firebase Auth</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">Secure</span>
            </div>
          </div>
        </motion.div>

        {/* Upgrade CTA (for free plan) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-white">Upgrade to Pro</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">Unlock unlimited research, priority processing, and advanced analytics.</p>
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm hover:from-blue-500 hover:to-violet-500 transition-all">
            Coming Soon
          </button>
        </motion.div>

        {/* Sign out */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;
