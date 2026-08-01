import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Download, X, Link } from "lucide-react";
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

function detectPlatform(url) {
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "facebook";
  return "unknown";
}

function BulkSection() {
  const [urls, setUrls] = useState([""]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);

  const addUrl = () => {
    if (urls.length >= 10) return toast.error("Max 10 URLs at once");
    setUrls([...urls, ""]);
  };

  const removeUrl = (i) => {
    const updated = urls.filter((_, idx) => idx !== i);
    setUrls(updated.length === 0 ? [""] : updated);
  };

  const updateUrl = (i, val) => {
    const updated = [...urls];
    updated[i] = val;
    setUrls(updated);
  };

  const handleClear = () => {
    setUrls([""]);
    setResults([]);
  };

  const handleFetchAll = async () => {
    const clean = urls.filter((u) => u.trim().length > 0);
    if (clean.length === 0) return toast.error("Add at least one URL");

    setLoading(true);
    setResults([]);

    try {
      const res = await axios.post(`${API}/api/bulk-info`, { urls: clean });
      setResults(res.data);
      toast.success(`Found ${res.data.filter((r) => !r.error).length} video(s)! 🎬`);
    } catch (err) {
      toast.error("Bulk fetch failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadOne = (url, type) => {
    let endpoint = "";
    if (type === "hd") endpoint = `${API}/api/download?url=${encodeURIComponent(url)}&quality=hd`;
    if (type === "sd") endpoint = `${API}/api/download?url=${encodeURIComponent(url)}&quality=sd`;
    if (type === "audio") endpoint = `${API}/api/download/audio?url=${encodeURIComponent(url)}`;

    const a = document.createElement("a");
    a.href = endpoint;
    a.download = type === "audio" ? "audio.mp3" : "video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Download started! 🎬");
  };

  const handleDownloadAll = async () => {
    const valid = results.filter((r) => !r.error);
    if (valid.length === 0) return toast.error("No valid videos to download");

    setDownloading("all");
    toast.loading(`Downloading ${valid.length} videos...`, { id: "bulk-dl" });

    for (let i = 0; i < valid.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500 * i));
      const endpoint = `${API}/api/download?url=${encodeURIComponent(valid[i].url)}&quality=hd`;
      const a = document.createElement("a");
      a.href = endpoint;
      a.download = `video_${i + 1}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    toast.success("All downloads started! 📦", { id: "bulk-dl" });
    setDownloading(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ paddingTop: "32px" }}
    >
      {/* URL Inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        <AnimatePresence>
          {urls.map((url, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-card)",
                border: "1px solid",
                borderColor: url && detectPlatform(url) !== "unknown"
                  ? platformColors[detectPlatform(url)]
                  : "var(--border)",
                borderRadius: "12px",
                padding: "4px 4px 4px 12px",
                transition: "border-color 0.3s",
              }}
            >
              <Link size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <input
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder={`Video URL ${i + 1}`}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  padding: "10px 8px",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              {url && detectPlatform(url) !== "unknown" && (
                <span style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: platformColors[detectPlatform(url)],
                  padding: "2px 8px",
                  borderRadius: "100px",
                  background: `${platformColors[detectPlatform(url)]}18`,
                  border: `1px solid ${platformColors[detectPlatform(url)]}33`,
                  whiteSpace: "nowrap",
                }}>
                  {detectPlatform(url).toUpperCase()}
                </span>
              )}
              {urls.length > 1 && (
                <button
                  onClick={() => removeUrl(i)}
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "8px",
                    padding: "6px",
                    cursor: "pointer",
                    color: "#EF4444",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <button
          onClick={addUrl}
          style={{
            flex: 1,
            minWidth: "120px",
            padding: "12px",
            background: "transparent",
            border: "1px dashed var(--border)",
            borderRadius: "12px",
            color: "var(--text-secondary)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "all 0.2s",
          }}
        >
          <Plus size={16} /> Add More
        </button>

        <button
          onClick={handleClear}
          style={{
            flex: 1,
            minWidth: "120px",
            padding: "12px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "12px",
            color: "#EF4444",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Trash2 size={16} /> Clear All
        </button>

        <button
          onClick={handleFetchAll}
          disabled={loading}
          style={{
            flex: 2,
            minWidth: "160px",
            padding: "12px",
            background: loading ? "var(--text-muted)" : "var(--accent)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            <><BtnSpinner /> Fetching...</>
          ) : (
            <><Download size={16} /> Fetch All Videos</>
          )}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Download All */}
            <button
              onClick={handleDownloadAll}
              disabled={downloading === "all"}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: downloading === "all" ? "not-allowed" : "pointer",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: downloading === "all" ? 0.7 : 1,
              }}
            >
              {downloading === "all" ? (
                <><BtnSpinner /> Downloading All...</>
              ) : (
                <><Download size={16} /> Download All HD ({results.filter(r => !r.error).length} videos)</>
              )}
            </button>

            {/* Individual results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {results.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid",
                    borderColor: item.error ? "rgba(239,68,68,0.3)" : "var(--border)",
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Thumbnail */}
                  {item.thumbnail && !item.error && (
                    <img
                      src={item.thumbnail}
                      alt=""
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "1px solid var(--border)",
                      }}
                    />
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {item.error ? (
                      <p style={{ color: "#EF4444", fontSize: "13px" }}>❌ {item.error}</p>
                    ) : (
                      <>
                        <p style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {item.title}
                        </p>
                        {item.caption && (
                          <p style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            marginBottom: "10px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {item.caption}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {["hd", "sd", "audio"].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleDownloadOne(item.url, type)}
                              style={{
                                padding: "5px 12px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                background: "var(--bg-secondary)",
                                color: "var(--text-secondary)",
                                fontSize: "11px",
                                fontWeight: "700",
                                cursor: "pointer",
                                textTransform: "uppercase",
                              }}
                            >
                              {type === "audio" ? "MP3" : `MP4 ${type.toUpperCase()}`}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BtnSpinner() {
  return (
    <div style={{
      width: "14px",
      height: "14px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 0.6s linear infinite",
    }} />
  );
}

export default BulkSection;