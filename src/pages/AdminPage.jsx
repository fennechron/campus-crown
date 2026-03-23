import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getResults, saveResultPublishDate } from "../lib/firestore";
import CATEGORIES from "../data/categories";

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

export default function AdminPage() {
    const navigate = useNavigate();
    const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_authed") === "true");
    const [password, setPassword] = useState("");
    const [tab, setTab] = useState("settings");
    const [publishDate, setPublishDate] = useState("");
    const [saving, setSaving] = useState(false);
    const [results, setResults] = useState({});
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (authed && tab === "analytics") {
            getResults().then(setResults).catch(console.error);
        }
    }, [authed, tab]);

    const login = () => {
        if (password === ADMIN_SECRET) {
            sessionStorage.setItem("admin_authed", "true");
            setAuthed(true);
        } else {
            setMsg("Incorrect password");
        }
    };

    const savePublishDate = async () => {
        if (!publishDate) return;
        setSaving(true);
        setMsg("");
        try {
            await saveResultPublishDate(publishDate);
            setMsg("✓ Result date saved successfully!");
        } catch (err) {
            setMsg("Error: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (!authed) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 24 }}>
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🔐</div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>Admin Panel</h1>
                    <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Enter admin password to continue</p>
                </div>
                <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 340 }}>
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && login()}
                        autoFocus
                    />
                    <button className="btn btn-primary" onClick={login}>Enter</button>
                </div>
                {msg && <p style={{ color: "#f87171", fontSize: 13 }}>{msg}</p>}
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>Admin Panel</h1>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate("/")}>← Home</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { sessionStorage.removeItem("admin_authed"); setAuthed(false); }}>Logout</button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "var(--card)", borderRadius: 10, padding: 4, width: "fit-content", border: "1px solid var(--border)" }}>
                {[["settings", "⚙️ Settings"], ["analytics", "📊 Analytics"]].map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        style={{
                            padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13,
                            background: tab === key ? "var(--border-bright)" : "transparent",
                            color: tab === key ? "var(--text)" : "var(--text-muted)",
                            transition: "all 0.2s",
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === "settings" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 480 }}>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Result Publish Date</h2>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
                            Set the date when results become visible to all users.
                        </p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <input
                                type="datetime-local"
                                className="input"
                                value={publishDate}
                                onChange={(e) => setPublishDate(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={savePublishDate} disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                        {msg && (
                            <p style={{ fontSize: 13, color: msg.startsWith("✓") ? "#4ade80" : "#f87171", marginTop: 12 }}>
                                {msg}
                            </p>
                        )}
                    </div>
                </motion.div>
            )}

            {tab === "analytics" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Vote Analytics</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Leader</th>
                                <th>Total Votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CATEGORIES.map((cat) => {
                                const catResults = results[cat.id] || {};
                                const top = Object.entries(catResults).sort((a, b) => b[1] - a[1])[0];
                                const leader = top ? cat.nominees.find((n) => n.id === top[0]) : null;
                                const total = Object.values(catResults).reduce((s, c) => s + c, 0);
                                return (
                                    <tr key={cat.id}>
                                        <td>{cat.emoji} {cat.title}</td>
                                        <td style={{ color: leader ? "var(--text)" : "var(--text-dim)" }}>
                                            {leader ? leader.name : "—"}
                                        </td>
                                        <td>{total || 0}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    );
}
