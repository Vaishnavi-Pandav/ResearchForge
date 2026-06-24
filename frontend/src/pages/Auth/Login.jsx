import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Mail, Lock, Eye, EyeOff, ArrowRight,
  Search, FileText, Shield, Sparkles, BookOpen,
  AlertCircle, Loader2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const GOOGLE_ICON = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const features = [
  { icon: <Bot className="w-4 h-4" />, color: "from-blue-500 to-blue-600", label: "Query Planner Agent", desc: "Intelligently structures your research queries" },
  { icon: <Search className="w-4 h-4" />, color: "from-violet-500 to-violet-600", label: "Web Searcher Agent", desc: "Scans thousands of sources in seconds" },
  { icon: <Shield className="w-4 h-4" />, color: "from-emerald-500 to-emerald-600", label: "Credibility Scorer", desc: "Verifies source reliability automatically" },
  { icon: <Sparkles className="w-4 h-4" />, color: "from-amber-500 to-orange-500", label: "Synthesizer Agent", desc: "Distills findings into clear insights" },
  { icon: <BookOpen className="w-4 h-4" />, color: "from-pink-500 to-rose-500", label: "Citation Formatter", desc: "Auto-generates APA, MLA, Chicago, Harvard" },
];

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const getFirebaseError = (code) => {
    const messages = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/network-request-failed": "Network error. Check your connection.",
    };
    return messages[code] || "Authentication failed. Please try again.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(getFirebaseError(err.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
      >
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#0B0F1A]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ResearchForge</span>
          </div>

          {/* Central copy */}
          <div className="flex-1 flex flex-col justify-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 w-fit">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">5 AI Agents Active</span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
                Research at the
                <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  speed of thought.
                </span>
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                Your multi-agent AI research platform. From query to citation-ready report in minutes.
              </p>
            </motion.div>

            {/* Feature list */}
            <div className="mt-10 space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{f.label}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="relative z-10 mt-auto p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-sm text-gray-300 leading-relaxed italic">
              "ResearchForge cut my literature review time from days to hours. The credibility scoring alone is worth it."
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-xs font-bold">
                DR
              </div>
              <div>
                <p className="text-xs font-bold text-white">Dr. Rebecca Chen</p>
                <p className="text-[11px] text-gray-500">Senior Researcher, MIT</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#0D1117]"
      >
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ResearchForge</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to continue your research</p>
          </div>

          {/* Google Sign-in */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GOOGLE_ICON />}
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-400">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || googleLoading}
              id="login-submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
