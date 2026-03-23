import { motion, AnimatePresence } from "framer-motion";

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);

export default function BottomNav({ onPrev, onNext, onSearchOpen, isFirst, isLast, votedCount, totalCategories, isVoted, isSplit }) {
    return (
        <div className="bottom-nav-container">
            <motion.div
                className="bottom-nav"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Back Button */}
                <button
                    className="bottom-nav-btn nav-prev"
                    onClick={onPrev}
                    disabled={isFirst}
                    aria-label="Previous category"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>Back</span>
                </button>

                {/* Selection Status Indicator */}
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <AnimatePresence mode="wait">
                        {isVoted ? (
                            <motion.div
                                key="selected"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    background: "rgba(74, 222, 128, 0.15)",
                                    border: "1px solid rgba(74, 222, 128, 0.3)",
                                    padding: "4px 12px", borderRadius: 100,
                                    color: "#4ade80", fontSize: 11, fontWeight: 700,
                                    textTransform: "uppercase", letterSpacing: "0.05em"
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Selected
                            </motion.div>
                        ) : (
                            <motion.div
                                key="not-selected"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    color: "var(--text-dim)", fontSize: 11, fontWeight: 600,
                                    textTransform: "uppercase", letterSpacing: "0.05em"
                                }}
                            >
                                {isSplit ? "Select both" : "Select one"}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Next/Submit Button */}
                <button
                    className={`bottom-nav-btn nav-next ${isLast ? 'submit-active' : ''}`}
                    onClick={onNext}
                    disabled={isLast && votedCount < totalCategories}
                    style={isLast ? { background: 'white', color: 'black', width: 'auto', padding: '0 20px' } : {}}
                >
                    {isLast ? (
                        <span style={{ fontWeight: 700, fontSize: 13 }}>Submit</span>
                    ) : (
                        <>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>Next</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}
