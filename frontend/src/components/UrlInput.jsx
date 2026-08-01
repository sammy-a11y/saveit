import { useState } from "react";
import { motion } from "framer-motion";
import { Link, X, Search, Clipboard } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API = "http://localhost:5000";

const platformColors = {
  tiktok: "#FF0050",
  instagram: "#E1306C",
  youtube: "#FF0000",
  facebook: "#1877F2",
  unknown: "var(--accent)",
};

const platformNames = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  unknown: "Unknown",
};

function detectPlatform(url) {
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "facebook";
  return "unknown";
}

function UrlInput({ setVideoData }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setUrl(val);
    if (val.length > 10) setPlatform(detectPlatform(val));
    else setPlatform(null);
  };

  const handleClear = () => {
    setUrl("");
    setPlatform(null);
    setVideoData(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      if (text.length > 10) setPlatform(detectPlatform(text));
      toast.success("Link pasted! ✅");
    } catch {
      toast.error("Could not read clipboard. Paste manually.");
    }
  };

  const handleFetch = async () => {
    if (!url.trim()) return toast.error("Paste a video URL first!");
    if (platform === "unknown") return toast.error("Platform not supported.");

    setLoading(true);
    setVideoData(null);

    try {
      const res = await axios.post(`${API}/api/info`, { url });
      setVideoData({ ...res.data, url });
      toast.success("Video found! 🎬");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not fetch video. Check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleFetch();
  };

  const color = platform ? platformColors[platform] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      style={{ padding: "24px 0 0" }}
    >
      {/* Input Box */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        background: "var(--bg-card)",
        border: "1px solid",
        borderColor: color || "var(--border)",
        borderRadius: "16px",
        padding: "4px 4px 4px 14px",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: color ? `0 0 20px ${color}22` : "none",
        gap: "8px",
      }}>
        {/* Link icon */}
        <Link size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />

        {/* Input */}
        <input
          value={url}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Paste TikTok, Instagram, YouTube or Facebook URL..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "14px",
            padding: "11px 0",
            fontFamily: "Inter, sans-serif",
            minWidth: 0,
          }}
        />

        {/* Platform badge */}
        {platform && platform !== "unknown" && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              padding: "3px 10px",
              borderRadius: "100px",
              fontSize: "11px",
              fontWeight: "700",
              background: `${color}22`,
              color: color,
              border: `1px solid ${color}44`,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {platformNames[platform]}
          </motion.span>
        )}

        {/* Paste button */}
        {!url && (
          <button
            onClick={handlePaste}
            title="Paste from clipboard"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: "10px",
              padding: "8px 12px",
              cursor: "pointer",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: "600",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Clipboard size={14} /> Paste
          </button>
        )}

        {/* Clear button */}
        {url && (
          <button
            onClick={handleClear}
            title="Clear"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px",
              padding: "8px 12px",
              cursor: "pointer",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: "600",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <X size={14} /> Clear
          </button>
        )}

        {/* Get Video button */}
        <button
          onClick={handleFetch}
          disabled={loading}
          style={{
            background: loading ? "var(--text-muted)" : "var(--accent)",
            border: "none",
            borderRadius: "12px",
            padding: "11px 18px",
            color: "#fff",
            fontWeight: "700",
            fontSize: "13px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            transition: "background 0.2s ease",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {loading ? <><Spinner /> Fetching...</> : <><Search size={15} /> Get Video</>}
        </button>
      </div>

      {/* Tip */}
      <p style={{
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: "12px",
        marginTop: "10px",
      }}>
        💡 Paste your link above and press Enter or click Get Video
      </p>
    </motion.div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: "13px", height: "13px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 0.6s linear infinite",
    }} />
  );
}

const style = document.createElement("style");
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

export default UrlInput;