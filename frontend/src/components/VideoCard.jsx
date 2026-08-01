import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Music, Package, Copy, Check, User, Clock } from "lucide-react";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

const platformColors = {
  tiktok: "#FF0050",
  instagram: "#E1306C",
  youtube: "#FF0000",
  facebook: "#1877F2",
  unknown: "var(--accent)",
};

function formatCount(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function VideoCard({ data }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(null);

  const handleCopyCaption = () => {
    if (!data.caption) return toast.error("No caption available");
    navigator.clipboard.writeText(data.caption);
    setCopied(true);
    toast.success("Caption copied! ✅");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (type) => {
    setDownloading(type);
    toast.loading(
      type === "bundle" ? "Preparing bundle ZIP..." :
      type === "audio" ? "Extracting audio..." :
      `Downloading ${type.toUpperCase()} video...`,
      { id: "dl" }
    );

    try {
      let endpoint = "";
      if (type === "hd") endpoint = `${API}/api/download?url=${encodeURIComponent(data.url)}&quality=hd`;
      if (type === "sd") endpoint = `${API}/api/download?url=${encodeURIComponent(data.url)}&quality=sd`;
      if (type === "audio") endpoint = `${API}/api/download/audio?url=${encodeURIComponent(data.url)}`;
      if (type === "bundle") endpoint = `${API}/api/download/bundle?url=${encodeURIComponent(data.url)}`;

      const a = document.createElement("a");
      a.href = endpoint;
      a.download = type === "audio" ? "audio.mp3" : type === "bundle" ? "bundle.zip" : "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success(
        type === "bundle" ? "Bundle downloading! 📦" :
        type === "audio" ? "Audio downloading! 🎵" :
        "Video downloading! 🎬",
        { id: "dl" }
      );
    } catch (err) {
      toast.error("Download failed. Try again.", { id: "dl" });
    } finally {
      setDownloading(null);
    }
  };

  const color = platformColors[data.platform] || "var(--accent)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      style={{
        marginTop: "28px",
        background: "var(--bg-card)",
        borderRadius: "20px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: `0 8px 40px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Platform bar */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />

      <div style={{ padding: "20px" }}>
        {/* Thumbnail + Info */}
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}>
          {/* Thumbnail */}
          {data.thumbnail && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                flexShrink: 0,
                width: "120px",
                height: "120px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <img
                src={data.thumbnail}
                alt="thumbnail"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: "0" }}>
            <h3 style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "8px",
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {data.title}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
              {data.uploader && (
                <span style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}>
                  <User size={12} /> {data.uploader}
                </span>
              )}
              {data.duration && (
                <span style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}>
                  <Clock size={12} /> {data.duration}s
                </span>
              )}
            </div>

            {/* Stats row */}
            <div style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "8px",
            }}>
              {[
                { icon: "👁️", value: data.view_count, label: "views" },
                { icon: "❤️", value: data.like_count, label: "likes" },
                { icon: "💬", value: data.comment_count, label: "comments" },
                { icon: "🔁", value: data.repost_count, label: "shares" },
              ].filter(s => s.value > 0).map((stat, i) => (
                <span key={i} style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  background: "var(--bg-secondary)",
                  padding: "3px 8px",
                  borderRadius: "100px",
                  border: "1px solid var(--border)",
                }}>
                  {stat.icon} {formatCount(stat.value)}
                </span>
              ))}
            </div>

            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 10px",
              borderRadius: "100px",
              fontSize: "11px",
              fontWeight: "700",
              background: `${color}18`,
              color: color,
              border: `1px solid ${color}33`,
              width: "fit-content",
            }}>
              {data.platform?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Caption */}
        {data.caption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "20px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Caption
              </span>
              <button
                onClick={handleCopyCaption}
                style={{
                  background: copied ? "rgba(16,185,129,0.15)" : "var(--bg-card)",
                  border: "1px solid",
                  borderColor: copied ? "#10B981" : "var(--border)",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  color: copied ? "#10B981" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.2s ease",
                }}
              >
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <p style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              maxHeight: "80px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {data.caption}
            </p>
          </motion.div>
        )}

        {/* Download Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          {/* HD + SD row */}
          <div style={{ display: "flex", gap: "10px" }}>
            <DownloadBtn
              label="MP4 HD"
              sub="Best Quality"
              icon={<Download size={16} />}
              color="#7C3AED"
              loading={downloading === "hd"}
              onClick={() => handleDownload("hd")}
            />
            <DownloadBtn
              label="MP4 SD"
              sub="Smaller Size"
              icon={<Download size={16} />}
              color="#2563EB"
              loading={downloading === "sd"}
              onClick={() => handleDownload("sd")}
            />
          </div>

          {/* Audio + Bundle row */}
          <div style={{ display: "flex", gap: "10px" }}>
            <DownloadBtn
              label="Audio Only"
              sub="MP3 Format"
              icon={<Music size={16} />}
              color="#059669"
              loading={downloading === "audio"}
              onClick={() => handleDownload("audio")}
            />
            <DownloadBtn
              label="Bundle"
              sub="HD + MP3 ZIP"
              icon={<Package size={16} />}
              color="#D97706"
              loading={downloading === "bundle"}
              onClick={() => handleDownload("bundle")}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DownloadBtn({ label, sub, icon, color, loading, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      style={{
        flex: 1,
        background: `${color}18`,
        border: `1px solid ${color}44`,
        borderRadius: "12px",
        padding: "12px 8px",
        color: color,
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        transition: "all 0.2s ease",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "13px" }}>
        {loading ? <BtnSpinner color={color} /> : icon}
        {loading ? "Wait..." : label}
      </span>
      <span style={{ fontSize: "10px", opacity: 0.7, fontWeight: "500" }}>{sub}</span>
    </motion.button>
  );
}

function BtnSpinner({ color }) {
  return (
    <div style={{
      width: "14px",
      height: "14px",
      border: `2px solid ${color}44`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%",
      animation: "spin 0.6s linear infinite",
    }} />
  );
}

export default VideoCard;