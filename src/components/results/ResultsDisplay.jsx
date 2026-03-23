import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CATEGORIES_DEFAULT from "../../data/categories";

function getRankedNominees(categoryResults) {
    if (!categoryResults) return [];
    return Object.entries(categoryResults)
        .filter(([id]) => id !== "none")
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count);
}

function findNominee(category, id) {
    return category.nominees.find((n) => n.id === id);
}

const rankLabel = ["🥇", "🥈", "🥉"];

function CategoryResult({ category, results, index }) {
    const ranked = getRankedNominees(results);
    const total = Object.values(results || {}).reduce((s, c) => s + c, 0);
    const navigate = useNavigate();

    const handleReveal = () => {
        navigate(`/results/${category.id}`);
    };

    return (
        <motion.div
            className="card"
            onClick={handleReveal}
            style={{
                padding: 24,
                marginBottom: 16,
                border: "1px solid var(--border)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 40, background: "rgba(255,255,255,0.05)", width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16 }}>
                    {category.emoji}
                </span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "white" }}>
                        {category.title}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}></span>
                        {total} total vote{total !== 1 ? "s" : ""}
                    </div>
                </div>
                <div style={{ padding: "8px 16px", background: "var(--accent)", color: "black", fontWeight: 800, fontSize: 13, borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Reveal
                </div>
            </div>
        </motion.div>
    );
}

export default function ResultsDisplay({ results, categories: propCategories }) {
    const categories = propCategories || CATEGORIES_DEFAULT;
    return (
        <div>
            {categories.map((cat, i) => {
                let catResults = {};
                if (cat.splitGender) {
                    catResults = {
                        ...(results[`${cat.id}-Male`] || {}),
                        ...(results[`${cat.id}-Female`] || {})
                    };
                } else {
                    catResults = results[cat.id] || {};
                }

                return (
                    <CategoryResult
                        key={cat.id}
                        category={cat}
                        results={catResults}
                        index={i}
                    />
                );
            })}
        </div>
    );
}
