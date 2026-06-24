import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Mail, ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const getFirebaseError = (code) => {
    const messages = {
      "auth/user-not-found": "No account found with this email address.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/too-many-requests": "Too many attempts. Please wait and try again.",
      "auth/network-request-failed": "Network error. Check your connection.",
    };
    return messages[code] || "Failed to send reset email. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[420px]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">ResearchForge</span>
        </div>

        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Check your inbox</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-1">
                  We've sent a password reset link to
                </p>
                <p className="text-sm font-semibold text-white mb-6">{email}</p>
                <p className="text-xs text-gray-600 mb-6">
                  Didn't receive it? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Try a different email
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Reset password</h2>
                <p className="text-gray-500 text-sm mb-7">
                  Enter your email and we'll send you a reset link.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 mb-5"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    id="forgot-submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          to="/login"
          className="flex items-center gap-2 justify-center mt-5 text-sm text-gray-600 hover:text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
