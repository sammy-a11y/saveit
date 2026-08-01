import { motion } from "framer-motion";
import { Heart } from "lucide-react";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      style={{
        textAlign: "center",
        padding: "32px 16px",
        borderTop: "1px solid var(--border)",
        color: "var(--text-muted)",
        fontSize: "13px",
      }}
    >
      <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        Made with <Heart size={13} color="#EF4444" fill="#EF4444" /> by SaveIt
      </p>
      <p style={{ marginTop: "6px", fontSize: "11px" }}>
        Download TikTok · Instagram · YouTube · Facebook — No Watermark
      </p>
    </motion.footer>
  );
}

export default Footer;