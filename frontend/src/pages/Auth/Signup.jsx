import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Mail, Lock, Eye, EyeOff, User, ArrowRight,
  AlertCircle, Loader2, CheckCircle2, Check
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

function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (pwd.length >= 12) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-400"];

function Login() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(form.password);

  const passwordRules = [
    { label: "At least 8 characters", ok: form.password.length >= 8 },
    { label: "Contains uppercase letter", ok: /[A-Z]/.test(form.password) },
    { label: "Contains a number", ok: /[0-9]/.test(form.password) },
  ];

  const getFirebaseError = (code) => {
    const messages = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/network-request-failed": "Network error. Check your connection.",
    };
    return messages[code] || "Signup failed. Please try again.";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  if (success) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Account Created!</h2>
          <p className="text-gray-400 leading-relaxed mb-2">
            We've sent a verification email to <span className="text-white font-semibold">{form.email}</span>.
          </p>
          <p className="text-sm text-gray-600">Redirecting you to login in 3 seconds...</p>
          <Link to="/login" className="inline-block mt-6 text-sm text-blue-400 hover:text-blue-300 font-semibold">
            Go to Login now →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-[480px]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">ResearchForge</span>
        </div>

        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
          <h2 className="text-2xl font-black text-white tracking-tight mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-7">Start your AI-powered research journey today</p>

          {/* Google Sign-up */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            id="google-signup-btn"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white font-semibold text-sm disabled:opacity-50 mb-5"
          >
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GOOGLE_ICON />}
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error */}
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

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2.5">
                  <div className="flex gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength: <span className={`font-semibold ${strength >= 4 ? "text-emerald-400" : strength >= 3 ? "text-yellow-400" : "text-orange-400"}`}>
                      {strengthLabels[strength]}
                    </span>
                  </p>
                  <div className="mt-2 space-y-1">
                    {passwordRules.map((r) => (
                      <div key={r.label} className="flex items-center gap-1.5">
                        <Check className={`w-3 h-3 ${r.ok ? "text-emerald-400" : "text-gray-700"}`} />
                        <span className={`text-xs ${r.ok ? "text-emerald-400" : "text-gray-600"}`}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  id="signup-confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={form.confirm}
                  onChange={update("confirm")}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 transition-all ${
                    form.confirm && form.confirm !== form.password
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : form.confirm && form.confirm === form.password
                      ? "border-emerald-500/50 focus:ring-emerald-500/30"
                      : "border-white/10 focus:ring-blue-500/50 focus:border-blue-500/50"
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirm && form.confirm === form.password && (
                <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match
                </p>
              )}
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || googleLoading}
              id="signup-submit"
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
