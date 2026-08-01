const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper: detect platform
const detectPlatform = (url) => {
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "facebook";
  return "unknown";
};

// Helper: build yt-dlp base command based on platform
const getBaseCmd = (url) => {
  const platform = detectPlatform(url);
  if (platform === "tiktok") {
    return `yt-dlp --impersonate "Chrome-136" --extractor-args "tiktok:api_hostname=api22-normal-c-useast2a.tiktokv.com;app_version=40.9.6;manifest_app_version=2024409060;app_name=tiktok_web"`;
  }
  if (platform === "instagram") {
    return `yt-dlp --impersonate "Chrome-136"`;
  }
  return `yt-dlp --cookies-from-browser chrome`;
};

// Helper: run yt-dlp and get video info
const getVideoInfo = (url) => {
  return new Promise((resolve, reject) => {
    const base = getBaseCmd(url);
    const cleanUrl = url.split("?")[0]; // remove query params for YouTube
    exec(
      `${base} --dump-json --no-playlist "${cleanUrl}"`,
      { maxBuffer: 1024 * 1024 * 10, timeout: 30000 },
      (error, stdout, stderr) => {
        if (error) return reject(stderr || error.message);
        try {
          const data = JSON.parse(stdout);
          resolve(data);
        } catch (e) {
          reject("Failed to parse video info");
        }
      }
    );
  });
};

// Ensure downloads folder exists
const ensureDownloads = () => {
  const dir = path.join(__dirname, "downloads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dir;
};

// Route: Get video info + caption
app.post("/api/info", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const info = await getVideoInfo(url);
    res.json({
      title: info.title || "Untitled",
      thumbnail: info.thumbnail || "",
      caption: info.description || "",
      duration: info.duration_string || "",
      platform: detectPlatform(url),
      uploader: info.uploader || "",
      view_count: info.view_count || 0,
      like_count: info.like_count || 0,
      comment_count: info.comment_count || 0,
      repost_count: info.repost_count || info.share_count || 0,
    });
  } catch (err) {
    console.error("Info error:", err);
    res.status(500).json({ error: "Could not fetch video info. Check URL and try again." });
  }
});

// Route: Download video (HD or SD)
app.get("/api/download", (req, res) => {
  const { url, quality } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const formatArg = quality === "sd"
    ? `-f "bestvideo[height<=480]+bestaudio/best[height<=480]/best[height<=480]"`
    : `-f "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best[height<=1080]"`;

  const downloadsDir = ensureDownloads();
  const filename = `video_${Date.now()}.mp4`;
  const outputPath = path.join(downloadsDir, filename);
  const base = getBaseCmd(url);

  const cmd = `${base} ${formatArg} --merge-output-format mp4 -o "${outputPath}" "${url}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
    if (error) {
      console.error("Download error:", stderr);
      return res.status(500).json({ error: "Download failed" });
    }
    res.download(outputPath, "video.mp4", (err) => {
      try { fs.unlinkSync(outputPath); } catch {}
    });
  });
});

// Route: Download audio only (MP3)
app.get("/api/download/audio", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const downloadsDir = ensureDownloads();
  const filename = `audio_${Date.now()}.mp3`;
  const outputPath = path.join(downloadsDir, filename);
  const base = getBaseCmd(url);

  const cmd = `${base} -f bestaudio --extract-audio --audio-format mp3 -o "${outputPath}" "${url}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
    if (error) {
      console.error("Audio error:", stderr);
      return res.status(500).json({ error: "Audio download failed" });
    }
    res.download(outputPath, "audio.mp3", (err) => {
      try { fs.unlinkSync(outputPath); } catch {}
    });
  });
});

// Route: Bundle download (HD + MP3 as ZIP)
app.get("/api/download/bundle", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const downloadsDir = ensureDownloads();
  const ts = Date.now();
  const videoPath = path.join(downloadsDir, `video_${ts}.mp4`);
  const audioPath = path.join(downloadsDir, `audio_${ts}.mp3`);
  const zipPath = path.join(downloadsDir, `bundle_${ts}.zip`);
  const base = getBaseCmd(url);

  const videoCmd = `${base} -f "bestvideo[height<=1080]+bestaudio/best/best" --merge-output-format mp4 -o "${videoPath}" "${url}"`;
  const audioCmd = `${base} -f bestaudio --extract-audio --audio-format mp3 -o "${audioPath}" "${url}"`;

  exec(videoCmd, { maxBuffer: 1024 * 1024 * 100 }, (err1) => {
    if (err1) return res.status(500).json({ error: "Video download failed for bundle" });

    exec(audioCmd, { maxBuffer: 1024 * 1024 * 100 }, (err2) => {
      if (err2) return res.status(500).json({ error: "Audio download failed for bundle" });

      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        res.download(zipPath, "bundle.zip", () => {
          try { fs.unlinkSync(videoPath); } catch {}
          try { fs.unlinkSync(audioPath); } catch {}
          try { fs.unlinkSync(zipPath); } catch {}
        });
      });

      archive.pipe(output);
      archive.file(videoPath, { name: "video.mp4" });
      archive.file(audioPath, { name: "audio.mp3" });
      archive.finalize();
    });
  });
});

// Route: Bulk info (multiple URLs)
app.post("/api/bulk-info", async (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) return res.status(400).json({ error: "URLs array required" });

  try {
    const results = await Promise.allSettled(urls.map(url => getVideoInfo(url)));
    const data = results.map((result, i) => {
      if (result.status === "fulfilled") {
        const info = result.value;
        return {
          url: urls[i],
          title: info.title || "Untitled",
          thumbnail: info.thumbnail || "",
          caption: info.description || "",
          duration: info.duration_string || "",
          platform: detectPlatform(urls[i]),
          uploader: info.uploader || "",
        };
      } else {
        return { url: urls[i], error: "Failed to fetch" };
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Bulk fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ SaveIt backend running on http://localhost:${PORT}`);
});