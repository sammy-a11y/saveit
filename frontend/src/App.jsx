import { useState } from "react";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Zap, Shield, Globe, Star, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "./components/Navbar";
import UrlInput from "./components/UrlInput";
import VideoCard from "./components/VideoCard";
import BulkSection from "./components/BulkSection";
import Footer from "./components/Footer";

function App() {
  const [videoData, setVideoData] = useState(null);
  const [mode, setMode] = useState("single");
  const [openFaq, setOpenFaq] = useState(null);

  // Wake up Render backend on load
  useEffect(() => {
    fetch("https://saveit-backend-cok0.onrender.com/api/ping")
      .catch(() => {});
  }, []);

  const faqs = [
    { q: "Is SaveIt free to use?", a: "Yes! SaveIt is 100% free. No account needed, no hidden fees." },
    { q: "Does it remove TikTok watermark?", a: "Yes. We download directly from the source — no watermark on any video." },
    { q: "Which platforms are supported?", a: "TikTok, Instagram, YouTube, and Facebook." },
    { q: "Can I download multiple videos at once?", a: "Yes! Switch to Bulk Download and paste up to 10 URLs at once." },
    { q: "Is my data safe?", a: "We don't store any URLs or personal data. Everything is deleted immediately after." },
    { q: "What formats can I download?", a: "MP4 HD, MP4 SD, MP3 audio, or Bundle (HD + MP3 as ZIP)." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#10B981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section style={{
        background: "linear-gradient(180deg, rgba(124,58,237,0.10) 0%, transparent 100%)",
        padding: "60px 16px 48px",
        textAlign: "center",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: "clamp(26px, 5vw, 42px)",
              fontWeight: "900",
              lineHeight: "1.2",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #F0F0FF 0%, #9D5FF3 60%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            Download Videos Without Watermark
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              marginBottom: "24px",
              lineHeight: "1.6",
            }}
          >
            Download videos from TikTok, Instagram, YouTube & Facebook — no watermark, with captions.
          </motion.p>

          {/* Platform + No Watermark badges */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "36px",
            }}
          >
            {[
              { name: "TikTok", color: "#FF0050" },
              { name: "Instagram", color: "#E1306C" },
              { name: "YouTube", color: "#FF0000" },
              { name: "Facebook", color: "#1877F2" },
            ].map((p) => (
              <span key={p.name} style={{
                padding: "5px 14px",
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: "700",
                background: `${p.color}18`,
                color: p.color,
                border: `1px solid ${p.color}33`,
              }}>
                {p.name}
              </span>
            ))}
            <span style={{
              padding: "5px 14px",
              borderRadius: "100px",
              fontSize: "12px",
              fontWeight: "700",
              background: "rgba(16,185,129,0.1)",
              color: "#10B981",
              border: "1px solid rgba(16,185,129,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              ⚡ No Watermark
            </span>
          </motion.div>

          {/* Mode Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{
              display: "inline-flex",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "100px",
              padding: "4px",
              marginBottom: "24px",
            }}
          >
            {["single", "bulk"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setVideoData(null); }}
                style={{
                  padding: "9px 24px",
                  borderRadius: "100px",
                  border: "none",
                  background: mode === m ? "var(--accent)" : "transparent",
                  color: mode === m ? "#fff" : "var(--text-secondary)",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {m === "single" ? "🎬 Single Video" : "📦 Bulk Download"}
              </button>
            ))}
          </motion.div>

          {/* URL Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {mode === "single" ? (
              <UrlInput setVideoData={setVideoData} />
            ) : (
              <BulkSection />
            )}
          </motion.div>

          {/* Video Card — appears after fetch */}
          <AnimatePresence>
            {videoData && mode === "single" && (
              <VideoCard data={videoData} />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* STATS */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "700px",
          margin: "60px auto 0",
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {[
          { value: "10M+", label: "Videos Downloaded" },
          { value: "4", label: "Platforms Supported" },
          { value: "100%", label: "Free & No Watermark" },
        ].map((stat, i) => (
          <div key={i} style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "24px 16px",
            textAlign: "center",
          }}>
            <p style={{
              fontSize: "28px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #F0F0FF, #9D5FF3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "4px",
            }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "700px", margin: "60px auto 0", padding: "0 16px" }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "800", textAlign: "center", marginBottom: "8px", color: "var(--text-primary)" }}>
          How It Works
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px" }}>
          3 simple steps — no account needed
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          {[
            { step: "01", title: "Copy the URL", desc: "Go to TikTok, Instagram, YouTube or Facebook and copy the video link.", icon: "🔗" },
            { step: "02", title: "Paste & Fetch", desc: "Paste the URL into SaveIt, click Get Video. Preview loads instantly.", icon: "⚡" },
            { step: "03", title: "Download", desc: "Choose HD, SD, MP3 or Bundle. File downloads immediately.", icon: "⬇️" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px 20px",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute", top: "12px", right: "16px",
                fontSize: "11px", fontWeight: "800",
                color: "var(--accent)", opacity: 0.5, letterSpacing: "1px",
              }}>
                {item.step}
              </div>
              <div style={{ fontSize: "30px", marginBottom: "12px" }}>{item.icon}</div>
              <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "6px", color: "var(--text-primary)" }}>{item.title}</h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "700px", margin: "60px auto 0", padding: "0 16px" }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "800", textAlign: "center", marginBottom: "28px", color: "var(--text-primary)" }}>
          Why Choose SaveIt?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
          {[
            { icon: <Download size={18} />, title: "No Watermark", desc: "Download clean videos from all 4 platforms.", color: "#7C3AED" },
            { icon: <Zap size={18} />, title: "Lightning Fast", desc: "Videos process in seconds. No waiting.", color: "#F59E0B" },
            { icon: <Shield size={18} />, title: "100% Safe", desc: "We never store your URLs or personal data.", color: "#10B981" },
            { icon: <Globe size={18} />, title: "4 Platforms", desc: "TikTok, Instagram, YouTube, Facebook.", color: "#2563EB" },
            { icon: <Star size={18} />, title: "HD Quality", desc: "Highest resolution available, up to 1080p.", color: "#E1306C" },
            { icon: <Download size={18} />, title: "Bulk Download", desc: "Download up to 10 videos at once.", color: "#059669" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "18px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "9px",
                background: `${f.color}18`, border: `1px solid ${f.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: f.color, flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "3px", color: "var(--text-primary)" }}>{f.title}</h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* PLATFORMS */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "700px", margin: "60px auto 0", padding: "0 16px" }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "800", textAlign: "center", marginBottom: "28px", color: "var(--text-primary)" }}>
          Supported Platforms
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {[
            { name: "TikTok", color: "#FF0050", desc: "Download TikTok videos without watermark, with full caption.", emoji: "🎵" },
            { name: "Instagram", color: "#E1306C", desc: "Save Instagram Reels, posts and stories instantly.", emoji: "📸" },
            { name: "YouTube", color: "#FF0000", desc: "Download YouTube videos in HD, SD or audio only.", emoji: "▶️" },
            { name: "Facebook", color: "#1877F2", desc: "Save Facebook videos and reels with one click.", emoji: "👥" },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid",
                borderColor: `${p.color}33`,
                borderRadius: "16px",
                padding: "20px",
                borderTop: `3px solid ${p.color}`,
              }}
            >
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>{p.emoji}</div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: p.color, marginBottom: "6px" }}>{p.name}</h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "700px", margin: "60px auto 0", padding: "0 16px" }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "800", textAlign: "center", marginBottom: "28px", color: "var(--text-primary)" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card)",
                border: "1px solid",
                borderColor: openFaq === i ? "var(--accent)" : "var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", padding: "16px 20px",
                  background: "transparent", border: "none",
                  cursor: "pointer", display: "flex",
                  justifyContent: "space-between", alignItems: "center",
                  color: "var(--text-primary)", fontSize: "14px",
                  fontWeight: "600", textAlign: "left", gap: "12px",
                }}
              >
                {faq.q}
                {openFaq === i
                  ? <ChevronUp size={16} color="var(--accent)" />
                  : <ChevronDown size={16} color="var(--text-muted)" />}
              </button>
              {openFaq === i && (
                <div style={{
                  padding: "0 20px 16px",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  lineHeight: "1.6",
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ maxWidth: "700px", margin: "60px auto 0", padding: "0 16px" }}
      >
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.15))",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: "20px",
          padding: "40px 24px",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "12px", color: "var(--text-primary)" }}>
            Ready to Download?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
            Paste your video link and get your file in seconds — free, fast, no watermark.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              padding: "14px 32px",
              background: "var(--accent)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 0 24px var(--accent-glow)",
            }}
          >
            ⬆️ Start Downloading Free
          </button>
        </div>
      </motion.section>

      <div style={{ marginBottom: "60px" }} />
      <Footer />
    </div>
  );
}

export default App;