import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GLOBAL_NOMINEES } from "../../data/categories";

export default function GlobalSearch({ nominees: propNominees, onJumpToCategory, onClose, onSelectNominee }) {
    const nominees = propNominees || GLOBAL_NOMINEES;
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);

    const handleNomineeClick = useCallback((id) => {
        if (onSelectNominee) {
            onSelectNominee(id);
            onClose();
        }
    }, [onSelectNominee, onClose]);

    // Focus input on mount
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 50);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Live search through the shared 67 nominees
    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            setResults([]);
            return;
        }
        const found = nominees.filter(
            (n) =>
                n.name.toLowerCase().includes(q) ||
                n.tagline?.toLowerCase().includes(q)
        ).slice(0, 10);
        setResults(found);
    }, [query, nominees]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "80px 16px 24px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: 580,
                    background: "var(--surface)",
                    border: "1px solid var(--border-bright)",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
                }}
            >
                {/* Search Input */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px 20px",
                        borderBottom: results.length > 0 ? "1px solid var(--border)" : "none",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a nominee across all awards..."
                        style={{
                            flex: 1,
                            background: "none",
                            border: "none",
                            outline: "none",
                            color: "var(--text)",
                            fontSize: 16,
                            fontFamily: "var(--font-sans)",
                            fontWeight: 500,
                        }}
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "var(--text-dim)", fontSize: 18, lineHeight: 1, padding: "0 4px",
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Results */}
                <AnimatePresence>
                    {query && results.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}
                        >
                            No nominees found for <strong style={{ color: "var(--text)" }}>"{query}"</strong>
                        </motion.div>
                    )}

                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ maxHeight: 440, overflowY: "auto" }}
                        >
                            {results.map((nom, i) => (
                                <div
                                    key={nom.id}
                                    onClick={() => handleNomineeClick(nom.id)}
                                    className="search-result-item"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        width: "100%",
                                        padding: "12px 20px",
                                        borderBottom: "1px solid var(--border)",
                                        transition: "background 0.15s",
                                        cursor: "pointer"
                                    }}
                                >
                                    {/* Avatar */}
                                    <div
                                        style={{
                                            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                                            background: `linear-gradient(135deg, ${nom.color}cc, ${nom.color}66)`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 13, fontWeight: 700, color: "white",
                                            fontFamily: "var(--font-display)",
                                        }}
                                    >
                                        {nom.initials}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                                            {nom.name}
                                        </div>
                                        {nom.tagline && (
                                            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {nom.tagline}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 10, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase" }}>
                                        Select
                                    </div>
                                </div>
                            ))}

                            {/* Footer hint */}
                            <div style={{ padding: "16px 20px", fontSize: 12, color: "var(--text-dim)", textAlign: "center", background: "rgba(0,0,0,0.1)" }}>
                                Click a nominee to vote for them in the current category.
                            </div>
                        </motion.div>
                    )}

                    {/* Empty state when no query */}
                    {!query && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ padding: "28px 20px", textAlign: "center" }}
                        >
                            <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
                            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                                Search through all <strong style={{ color: "var(--text)" }}>67</strong> nominees
                            </p>
                            <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>
                                Click to instantly vote for a nominee
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
