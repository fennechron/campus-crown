import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { clearVotesLocally } from "../lib/storage";
import Footer from "../components/layout/Footer";

export default function ThankYouPage() {
    const navigate = useNavigate();
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        fired.current = true;

        // Fire confetti burst
        const fire = (opts) =>
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors: ["#ffffff", "#aaaaaa", "#555555", "#eeeeee"], ...opts });

        setTimeout(() => {
            fire({ angle: 60, origin: { x: 0, y: 0.65 } });
            fire({ angle: 120, origin: { x: 1, y: 0.65 } });
        }, 400);
        setTimeout(() => {
            fire({ angle: 90, origin: { x: 0.5, y: 0.5 }, particleCount: 120 });
        }, 800);
    }, []);

    return (
        <div className="success-screen">
            <motion.div
                className="success-icon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
                🎉
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}
            >
                <p style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 600 }}>
                    Votes submitted
                </p>
                <h1 className="success-title">Thank You! <img src="/logoaward.png" style={{ height: 32, width: "auto", verticalAlign: "middle" }} alt="Logo" /></h1>
                <p style={{ color: "var(--text-muted)", maxWidth: 380, textAlign: "center", fontSize: 15, lineHeight: 1.7 }}>
                    Your votes have been recorded. Results will be revealed on the announcement date. Stay tuned!
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
            >
                <button className="btn btn-primary btn-lg" onClick={() => navigate("/results")}>
                    View Results →
                </button>
                <button className="btn btn-ghost" onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 400, textAlign: "center", marginTop: 8 }}
            >
                {[["30", "Categories voted"], ["🏆", "Votes recorded"], ["✨", "Results coming soon"]].map(([val, lbl]) => (
                    <div key={lbl} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 8px" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text)", letterSpacing: "-0.03em" }}>{val}</div>
                        <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4, fontWeight: 500 }}>{lbl}</div>
                    </div>
                ))}
            </motion.div>
         
        </div>
    );
}
