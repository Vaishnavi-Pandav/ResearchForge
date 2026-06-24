import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Bot, Mail, Lock, Eye, EyeOff, User,
  ArrowRight, ArrowLeft, AlertCircle, Loader2,
  CheckCircle2, Check, Shield, Search, Sparkles, FileText, BookOpen
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ── Google Icon ────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// ── Password strength ──────────────────────────────────────────────
function getStrength(pwd) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  if (pwd.length >= 12) s++;
  return s;
}
const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-400"];
const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];

// ── Error mapping ──────────────────────────────────────────────────
function firebaseMsg(code) {
  const m = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/user-disabled": "This account has been disabled.",
  };
  return m[code] || "Something went wrong. Please try again.";
}

// ── Feature highlights shown on left panel ─────────────────────────
const features = [
  { icon: <Bot className="w-3.5 h-3.5" />, color: "from-blue-500 to-blue-600", label: "Query Planner" },
  { icon: <Search className="w-3.5 h-3.5" />, color: "from-violet-500 to-violet-600", label: "Web Searcher" },
  { icon: <Shield className="w-3.5 h-3.5" />, color: "from-emerald-500 to-emerald-600", label: "Credibility Scorer" },
  { icon: <Sparkles className="w-3.5 h-3.5" />, color: "from-amber-500 to-orange-500", label: "Synthesizer" },
  { icon: <FileText className="w-3.5 h-3.5" />, color: "from-pink-500 to-rose-500", label: "Citation Formatter" },
];

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL
// Props: isOpen, onClose, defaultTab ("login" | "signup")
// ─────────────────────────────────────────────────────────────────────────────
function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const [tab, setTab] = useState(defaultTab);          // "login" | "signup" | "forgot"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Signup state
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPwd, setSignupPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Forgot state
  const [forgotEmail, setForgotEmail] = useState("");

  const strength = getStrength(signupPwd);

  const clearErrors = () => setError("");

  const switchTab = (t) => {
    clearErrors();
    setSignupSuccess(false);
    setResetSent(false);
    setTab(t);
  };

  const handleSuccess = () => {
    onClose();
    navigate("/dashboard");
  };

  // ── Login ────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    try {
      await login(loginEmail, loginPwd);
      handleSuccess();
    } catch (err) {
      setError(firebaseMsg(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Signup ───────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    clearErrors();
    if (signupPwd !== confirmPwd) return setError("Passwords do not match.");
    if (signupPwd.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      await signup(signupEmail, signupPwd, name);
      setSignupSuccess(true);
    } catch (err) {
      setError(firebaseMsg(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Google ───────────────────────────────────────────────────────
  const handleGoogle = async () => {
    clearErrors();
    setGLoading(true);
    try {
      await loginWithGoogle();
      handleSuccess();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setError(firebaseMsg(err.code));
    } finally {
      setGLoading(false);
    }
  };

  // ── Forgot Password ──────────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    try {
      await resetPassword(forgotEmail);
      setResetSent(true);
    } catch (err) {
      setError(firebaseMsg(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Modal backdrop click ─────────────────────────────────────────
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ── Shared reusable input ────────────────────────────────────────
  const Input = ({ id, type, placeholder, value, onChange, icon: Icon, right }) => (
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />}
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2.5 bg-[#1a1f2e] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
      />
      {right}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.65)" }}
          onClick={handleBackdrop}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[860px] rounded-[28px] overflow-hidden shadow-2xl flex"
            style={{ maxHeight: "90vh" }}
          >
            {/* ── LEFT PANEL (hidden on mobile) ─────────────────── */}
            <div className="hidden md:flex w-[300px] flex-shrink-0 flex-col justify-between p-8 relative overflow-hidden bg-[#090d16]">
              {/* Glows */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/25 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-violet-600/20 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4" />
              {/* Grid */}
              <div className="absolute inset-0 opacity-[0.025]"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

              <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-10">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Bot className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="font-bold text-white text-sm tracking-tight">ResearchForge</span>
                </div>

                <div className="mb-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">5 AI Agents</span>
                  </div>
                  <h2 className="text-xl font-black text-white leading-tight mb-2">
                    Research at the<br />
                    <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">speed of thought.</span>
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed">From query to citation-ready report in minutes.</p>
                </div>

                <div className="mt-8 space-y-3">
                  {features.map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {f.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-400">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <p className="text-[11px] text-gray-400 italic leading-relaxed">
                  "ResearchForge cut my literature review from days to hours."
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-[9px] font-black">DR</div>
                  <div>
                    <p className="text-[10px] font-bold text-white leading-none">Dr. Rebecca Chen</p>
                    <p className="text-[9px] text-gray-600">MIT Research</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL ───────────────────────────────────── */}
            <div className="flex-1 bg-[#0d1117] overflow-y-auto">
              <div className="p-7 min-h-full flex flex-col">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <AnimatePresence mode="wait">
                  {/* ══ SIGNUP SUCCESS ══ */}
                  {tab === "signup" && signupSuccess ? (
                    <motion.div key="signup-success"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col items-center justify-center text-center py-8"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">Account Created!</h3>
                      <p className="text-sm text-gray-400 mb-1 leading-relaxed">
                        We've sent a verification email to<br />
                        <span className="text-white font-semibold">{signupEmail}</span>
                      </p>
                      <p className="text-xs text-gray-600 mb-6">Please verify your email then sign in.</p>
                      <button
                        onClick={() => switchTab("login")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-all"
                      >
                        Go to Login <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>

                  ) : tab === "forgot" ? (
                    /* ══ FORGOT PASSWORD ══ */
                    <motion.div key="forgot"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col"
                    >
                      <button onClick={() => switchTab("login")} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-6 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to login
                      </button>
                      <h3 className="text-xl font-black text-white mb-1">Reset password</h3>
                      <p className="text-sm text-gray-500 mb-6">We'll email you a reset link.</p>

                      {resetSent ? (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                          <p className="text-sm text-emerald-400 font-semibold">Reset link sent!</p>
                          <p className="text-xs text-gray-500 mt-1">Check your inbox at <span className="text-white">{forgotEmail}</span></p>
                        </div>
                      ) : (
                        <form onSubmit={handleForgot} className="space-y-4">
                          {error && <ErrorBox msg={error} />}
                          <div>
                            <label className="label-xs">Email address</label>
                            <Input id="forgot-email" type="email" placeholder="you@example.com"
                              value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} icon={Mail} />
                          </div>
                          <SubmitBtn loading={loading} label="Send Reset Link" />
                        </form>
                      )}
                    </motion.div>

                  ) : tab === "login" ? (
                    /* ══ LOGIN ══ */
                    <motion.div key="login"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col"
                    >
                      <Tabs tab={tab} onSwitch={switchTab} />
                      <form onSubmit={handleLogin} className="space-y-4 mt-6">
                        {error && <ErrorBox msg={error} />}
                        <div>
                          <label className="label-xs">Email</label>
                          <Input id="login-email" type="email" placeholder="you@example.com"
                            value={loginEmail} onChange={e => setLoginEmail(e.target.value)} icon={Mail} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="label-xs">Password</label>
                            <button type="button" onClick={() => switchTab("forgot")}
                              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                              Forgot password?
                            </button>
                          </div>
                          <Input id="login-pwd" type={showLoginPwd ? "text" : "password"}
                            placeholder="••••••••" value={loginPwd} onChange={e => setLoginPwd(e.target.value)}
                            icon={Lock}
                            right={
                              <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                                {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                          />
                        </div>
                        <SubmitBtn loading={loading} label="Sign In" />
                      </form>
                      <Divider />
                      <GoogleBtn loading={gLoading} onClick={handleGoogle} />
                    </motion.div>

                  ) : (
                    /* ══ SIGNUP ══ */
                    <motion.div key="signup"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col"
                    >
                      <Tabs tab={tab} onSwitch={switchTab} />
                      <form onSubmit={handleSignup} className="space-y-3.5 mt-6">
                        {error && <ErrorBox msg={error} />}
                        <div>
                          <label className="label-xs">Full Name</label>
                          <Input id="signup-name" type="text" placeholder="Jane Doe"
                            value={name} onChange={e => setName(e.target.value)} icon={User} />
                        </div>
                        <div>
                          <label className="label-xs">Email</label>
                          <Input id="signup-email" type="email" placeholder="you@example.com"
                            value={signupEmail} onChange={e => setSignupEmail(e.target.value)} icon={Mail} />
                        </div>
                        <div>
                          <label className="label-xs">Password</label>
                          <Input id="signup-pwd" type={showSignupPwd ? "text" : "password"}
                            placeholder="Min. 8 characters" value={signupPwd} onChange={e => setSignupPwd(e.target.value)}
                            icon={Lock}
                            right={
                              <button type="button" onClick={() => setShowSignupPwd(!showSignupPwd)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                                {showSignupPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                          />
                          {signupPwd && (
                            <div className="mt-2">
                              <div className="flex gap-1 mb-1">
                                {[1,2,3,4,5].map(i => (
                                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : "bg-white/10"}`} />
                                ))}
                              </div>
                              <p className="text-[10px] text-gray-600">
                                Strength: <span className={`font-bold ${strength >= 4 ? "text-emerald-400" : strength >= 3 ? "text-yellow-400" : "text-red-400"}`}>
                                  {strengthLabels[strength]}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="label-xs">Confirm Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input id="signup-confirm" type={showConfirmPwd ? "text" : "password"}
                              required placeholder="••••••••" value={confirmPwd}
                              onChange={e => setConfirmPwd(e.target.value)}
                              className={`w-full pl-10 pr-10 py-2.5 bg-[#1a1f2e] border rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 transition-all ${
                                confirmPwd && confirmPwd !== signupPwd ? "border-red-500/50 focus:ring-red-500/30"
                                  : confirmPwd && confirmPwd === signupPwd ? "border-emerald-500/40 focus:ring-emerald-500/30"
                                  : "border-white/10 focus:ring-blue-500/40 focus:border-blue-500/40"}`}
                            />
                            <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                              {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {confirmPwd && confirmPwd === signupPwd && (
                            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</p>
                          )}
                        </div>
                        <SubmitBtn loading={loading} label="Create Account" />
                      </form>
                      <Divider />
                      <GoogleBtn loading={gLoading} onClick={handleGoogle} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Shared sub-components ──────────────────────────────────────────
function Tabs({ tab, onSwitch }) {
  return (
    <div className="flex bg-white/[0.05] rounded-xl p-1 gap-1">
      {["login", "signup"].map(t => (
        <button key={t} onClick={() => onSwitch(t)}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
            tab === t ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md" : "text-gray-500 hover:text-gray-300"}`}>
          {t === "login" ? "Sign In" : "Sign Up"}
        </button>
      ))}
    </div>
  );
}

function ErrorBox({ msg }) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-red-400 leading-snug">{msg}</p>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-white/[0.08]" />
      <span className="text-[10px] text-gray-600 uppercase tracking-wider">or</span>
      <div className="flex-1 h-px bg-white/[0.08]" />
    </div>
  );
}

function GoogleBtn({ loading, onClick }) {
  return (
    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
      type="button" onClick={onClick} disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-semibold text-sm transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
      Continue with Google
    </motion.button>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
      type="submit" disabled={loading}
      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{label} <ArrowRight className="w-4 h-4" /></>}
    </motion.button>
  );
}

// CSS hack for label-xs (used inline via className)
// We use regular Tailwind classes directly where possible.
// "label-xs" class needs to be defined — use a workaround via styled span
// Actually let's just inline the classes properly
// Replacing label className usage above with explicit Tailwind

export default AuthModal;
