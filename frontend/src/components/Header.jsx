import { motion } from "framer-motion";
import { Zap } from "lucide-react";

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "32px 16px 20px",
        textAlign: "center",
        borderBottom: "1px solid var(--border)",
        marginBottom: "8px",
        background: "linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)",
      }}
    >
      {/* Logo Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <img
          src="/logo.png"
          alt="SaveIt Logo"
          style={{
            height: "90px",
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 0 24px rgba(124,58,237,0.4))",
            borderRadius: "50%",
          }}
        />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          color: "var(--text-secondary)",
          fontSize: "15px",
          maxWidth: "420px",
          margin: "0 auto 16px",
          lineHeight: "1.5",
        }}
      >
        Download videos from TikTok, Instagram, YouTube & Facebook — no watermark, with captions.
      </motion.p>

      {/* Platform badges */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}
      >
        {[
          { name: "TikTok", color: "#FF0050" },
          { name: "Instagram", color: "#E1306C" },
          { name: "YouTube", color: "#FF0000" },
          { name: "Facebook", color: "#1877F2" },
        ].map((p) => (
          <span
            key={p.name}
            style={{
              padding: "4px 12px",
              borderRadius: "100px",
              fontSize: "12px",
              fontWeight: "600",
              background: `${p.color}18`,
              color: p.color,
              border: `1px solid ${p.color}33`,
            }}
          >
            {p.name}
          </span>
        ))}

        <span style={{
          padding: "4px 12px",
          borderRadius: "100px",
          fontSize: "12px",
          fontWeight: "600",
          background: "rgba(16,185,129,0.1)",
          color: "#10B981",
          border: "1px solid rgba(16,185,129,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}>
          <Zap size={10} /> No Watermark
        </span>
      </motion.div>
    </motion.header>
  );
}

export default Header;