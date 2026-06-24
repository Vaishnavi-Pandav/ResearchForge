import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Settings as SettingsIcon, Bell, Shield, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const displayName = user?.displayName || "Researcher";
  const email = user?.email || "user@example.com";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="text-2xl font-black text-white tracking-tight mb-8">Settings</h1>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4"
        >
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Account
          </p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">
              {initials}
            </div>
            <div>
              <p className="font-bold text-white">{displayName}</p>
              <p className="text-sm text-gray-500">{email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 uppercase tracking-wider">Pro Plan</span>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4"
        >
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" /> Notifications
          </p>
          {[
            { label: "Research completed", desc: "Get notified when your research is ready" },
            { label: "Weekly digest", desc: "Summary of your research activity" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-200">{item.label}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-blue-500/30 border border-blue-500/40 relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-blue-400" />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6"
        >
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Security
          </p>
          <button className="w-full text-left py-3 border-b border-white/[0.04] text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Change Password →
          </button>
          <button className="w-full text-left py-3 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Connected Accounts →
          </button>
        </motion.div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-all text-sm font-bold"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
