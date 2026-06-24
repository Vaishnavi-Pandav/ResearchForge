import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight, Play, Bot, FileText, Check, ArrowRight } from "lucide-react";
import AuthModal from "../../components/auth/AuthModal";

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const navigate = useNavigate();

  const openAuth = (tab) => {
    setAuthTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-sky-300/30 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[360px] h-[360px] rounded-full bg-blue-400/20 blur-[110px]" />
      </div>

      {/* Navbar */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-6xl h-14 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/70 flex items-center justify-between px-6 py-2 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Bot className="w-7 h-7 text-blue-500" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">ResearchForge</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <a href="/" className="text-[15px] font-semibold text-gray-600 hover:text-gray-900 transition">Home</a>
            <a href="/" className="text-[15px] font-semibold text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="/" className="text-[15px] font-semibold text-gray-600 hover:text-gray-900 transition">Company</a>
            <a href="/" className="text-[15px] font-semibold text-gray-600 hover:text-gray-900 transition">Pricing</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => openAuth("login")}
              className="text-[15px] font-bold text-gray-700 hover:text-gray-900 transition"
            >
              Log In
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="px-6 py-2.5 text-[15px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg transition hover:scale-105"
            >
              Get Started
            </button>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-20 right-4 w-64 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl p-4 flex flex-col gap-4">
            <a href="/" className="text-sm font-medium text-gray-800">Home</a>
            <a href="/" className="text-sm font-medium text-gray-800">Features</a>
            <a href="/" className="text-sm font-medium text-gray-800">Company</a>
            <a href="/" className="text-sm font-medium text-gray-800">Pricing</a>
            <hr className="border-gray-100" />
            <button onClick={() => openAuth("login")} className="text-sm font-semibold text-gray-700 text-left">Log In</button>
            <button onClick={() => openAuth("signup")} className="text-sm font-semibold text-white bg-blue-500 rounded-xl py-2">Sign Up</button>
          </div>
        )}
      </div>

      {/* Main Hero Content */}
      <main className="w-full max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Copy */}
          <div className="flex flex-col items-start text-left space-y-5">
            {/* Social Proof Badge */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-100/80 border border-gray-200 rounded-full w-fit shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white" />
                <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-white" />
                <div className="w-6 h-6 rounded-full bg-purple-400 border-2 border-white" />
                <div className="w-6 h-6 rounded-full bg-orange-400 border-2 border-white" />
              </div>
              <span className="text-xs text-gray-700">Trusted by <strong className="text-gray-900">12,000+ researchers &amp; analysts</strong></span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-gray-900 leading-[1.1]">
              AI Research,
              <br />
              <span className="text-blue-600">Supercharged.</span>
            </h1>

            {/* Body Text */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-md font-medium">
              Five specialized AI agents collaborate to plan, search, verify, synthesize, and cite — delivering publication-ready research reports in minutes.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-5 items-center mt-2">
              <button
                onClick={() => openAuth("signup")}
                className="flex items-center gap-4 pl-7 pr-3 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-xl transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Researching Free
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-blue-500" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column - Visual with Robot Video */}
          <div className="relative flex items-center justify-center lg:justify-end py-4 pointer-events-none">
            {/* Decorative Orbit Art */}
            <div className="absolute top-[30%] left-[20%] w-[420px] h-[420px] bg-sky-400/15 rounded-full blur-[110px] -z-10 animate-pulse duration-[7000ms]" />
            
            {/* Hero Robot Video */}
            <div className="relative max-w-[580px]">
              <video
                src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_robo_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                className="w-full h-auto rounded-[24px] select-none block mix-blend-multiply pointer-events-none"
                style={{ filter: "brightness(1.05) contrast(1.05)" }}
              />
              {/* Overlay to ensure no browser controls appear */}
              <div className="absolute inset-0 pointer-events-none rounded-[24px]"></div>

              {/* Floating Cards */}
              {/* Write an email Badge (Suspended Top Right) */}
              <div
                className="absolute top-[15%] -right-4 sm:-right-8 bg-white/80 backdrop-blur-xl border border-white/70 rounded-[20px] px-5 py-3.5 flex items-center gap-3.5 pointer-events-auto shadow-[0_12px_32px_-4px_rgba(0,132,255,0.12)]"
                style={{ animation: "float1 5s ease-in-out infinite" }}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_4px_12px_rgba(0,132,255,0.3)]">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[14px] font-black text-gray-900 tracking-tight">Synthesize Research</span>
                  <span className="text-[11px] font-bold text-gray-500 mt-0.5">142 sources found</span>
                </div>
              </div>

              {/* Summarize document Badge (Suspended Center Left) */}
              <div
                className="absolute top-[45%] -left-6 sm:-left-10 bg-white/80 backdrop-blur-xl border border-white/70 rounded-[20px] px-5 py-3.5 flex items-center gap-3.5 pointer-events-auto shadow-[0_12px_32px_-4px_rgba(16,185,129,0.12)]"
                style={{ animation: "float2 5.5s ease-in-out infinite" }}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[14px] font-black text-gray-900 tracking-tight">Credibility Score</span>
                  <span className="text-[11px] font-bold text-gray-500 mt-0.5">8.7 / 10 avg</span>
                </div>
              </div>

              {/* Create a to-do list Badge (Suspended Bottom Right) */}
              <div
                className="absolute bottom-[15%] -right-4 sm:-right-8 bg-white/80 backdrop-blur-xl border border-white/70 rounded-[20px] px-5 py-3.5 flex items-center gap-3.5 pointer-events-auto shadow-[0_12px_32px_-4px_rgba(147,51,234,0.12)]"
                style={{ animation: "float3 4.8s ease-in-out infinite" }}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-[0_4px_12px_rgba(147,51,234,0.3)]">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[14px] font-black text-gray-900 tracking-tight">APA Citation</span>
                  <span className="text-[11px] font-bold text-gray-500 mt-0.5">auto-generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-8px) translateX(2px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(8px) translateX(-2px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(-1px); }
        }
      `}</style>
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab={authTab} 
      />
    </div>
  );
}

export default LandingPage;
