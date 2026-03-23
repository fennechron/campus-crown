import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../ui/CountdownTimer";

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric", month: "long", day: "numeric",
    });
}

export default function ComingSoonPage({ publishDate }) {
    const navigate = useNavigate();

    return (
        <div className="coming-soon">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="lock-icon animate-pulse"
            >
                🔒
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}
            >
                <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 600 }}>Results locked</span>
                <h1 style={{ fontSize: "clamp(32px, 7vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "var(--font-display)" }}>
                    Coming Soon
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 380, textAlign: "center", lineHeight: 1.7 }}>
                    Results will be published on <strong style={{ color: "var(--text)" }}>{formatDate(publishDate)}</strong>.
                    Check back then to see who won!
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <CountdownTimer targetDate={publishDate} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 12 }}
            >
                <button className="btn btn-secondary" onClick={() => navigate("/")}>← Home</button>
                <button className="btn btn-secondary" onClick={() => navigate("/vote")}>Vote Now</button>
            </motion.div>
        </div>
    );
}
