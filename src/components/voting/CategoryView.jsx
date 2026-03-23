import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NomineeCard from "./NomineeCard";

const badgeClass = (type) => {
    if (type === "talent") return "category-badge badge-talent";
    if (type === "personality") return "category-badge badge-personality";
    return "category-badge badge-funny";
};

const badgeLabel = (type) => {
    if (type === "talent") return "✦ Talent Award";
    if (type === "personality") return "✦ Personality Award";
    return "✦ Funny Award";
};

const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export default function CategoryView({
    category,
    selectedNominee,
    selectedMale,
    selectedFemale,
    onSelect,
    onNext,
    onPrev,
    isFirst,
    isLast,
    direction,
    categoryIndex,
    totalCategories,
    votedCount,
    totalRequiredVotes,
    onTabChange,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("Male");

    useEffect(() => {
        if (onTabChange) onTabChange(activeTab);
    }, [activeTab, onTabChange]);

    useEffect(() => {
        setSearchTerm("");
        if (category.splitGender) {
            // Auto switch intelligently when entering the category
            if (selectedMale && !selectedFemale) {
                setActiveTab("Female");
            } else {
                setActiveTab("Male");
            }
        }
    }, [category.id, category.splitGender, selectedMale, selectedFemale]);

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance (in px) to trigger navigation
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && !isLast) {
            onNext();
        }
        if (isRightSwipe && !isFirst) {
            onPrev();
        }
    };

    const handleCardSelect = (nomineeId) => {
        if (category.splitGender) {
            onSelect(nomineeId, `-${activeTab}`);

            // Auto-advance logic for split gender
            const isCurrentlyMale = activeTab === "Male";
            const otherGenderSelected = isCurrentlyMale ? selectedFemale : selectedMale;

            if (isCurrentlyMale && !selectedFemale) {
                setTimeout(() => setActiveTab("Female"), 350);
            } else if (!isCurrentlyMale && !selectedMale) {
                setTimeout(() => setActiveTab("Male"), 350);
            } else if (otherGenderSelected && !isLast) {
                // If both are now selected, auto-advance to next category
                setTimeout(() => onNext(), 600);
            }
        } else {
            onSelect(nomineeId);
            // Auto-advance for standard category
            if (!isLast) {
                setTimeout(() => onNext(), 600);
            }
        }
    };

    const isNomineeSelected = (nomineeId) => {
        if (category.splitGender) {
            return activeTab === "Male" ? selectedMale === nomineeId : selectedFemale === nomineeId;
        }
        return selectedNominee === nomineeId;
    };

    const filteredNominees = useMemo(() => {
        const noneNominee = {
            id: "none",
            name: "None of the above",
            tagline: "Skip this award",
            initials: "NA",
            color: "#555555",
            gender: "all"
        };
        let list = [...category.nominees].sort((a, b) => a.name.localeCompare(b.name));
        list.push(noneNominee);

        if (category.splitGender) {
            list = list.filter(n => n.gender === activeTab || n.id === "none");
        } else if (category.gender) {
            const catGender = category.gender.toLowerCase();
            if (catGender === "male" || catGender === "m") {
                list = list.filter(n => n.gender === "Male" || n.id === "none");
            } else if (catGender === "female" || catGender === "f") {
                list = list.filter(n => n.gender === "Female" || n.id === "none");
            }
            // If "both", it skips filtering and shows all nominees.
        }

        const q = searchTerm.toLowerCase().trim();
        if (!q) return list;

        const startsWithMatches = list.filter(n =>
            n.name.toLowerCase().startsWith(q)
        );

        const otherMatches = list.filter(n =>
            !n.name.toLowerCase().startsWith(q) &&
            (n.name.toLowerCase().includes(q) || n.tagline?.toLowerCase().includes(q))
        );

        // Always keep 'none' if it matches or if we want it at the end
        // But here we only filter by search query.
        return [...startsWithMatches, ...otherMatches].filter(n => n.id !== "none").concat(list.filter(n => n.id === "none"));
    }, [category.nominees, searchTerm, category.splitGender, category.gender, activeTab]);

    return (
        <div
            style={{ maxWidth: 860, margin: "0 auto", padding: "16px 0 48px" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={category.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Category Header */}
                    <div className="category-header">
                        <span className="category-emoji">{category.emoji}</span>
                        <h1 className="category-title">{category.title}</h1>
                        <span className={badgeClass(category.type)}>{badgeLabel(category.type)}</span>
                    </div>

                    {/* In-Page Search Bar */}
                    <div style={{
                        margin: "0 auto 32px",
                        maxWidth: 500,
                        position: "relative"
                    }}>
                        <div style={{
                            position: "absolute",
                            left: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-dim)",
                            pointerEvents: "none"
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder={`Search for ${category.title} nominees...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                            style={{
                                paddingLeft: 46,
                                paddingRight: 40,
                                height: 52,
                                borderRadius: 16,
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                fontSize: 15
                            }}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "#333",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: 24,
                                    height: 24,
                                    color: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 16,
                                    lineHeight: 1
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {category.splitGender && (
                        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
                            <button
                                className={`btn ${activeTab === 'Male' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveTab('Male')}
                                style={{ flex: 1, maxWidth: 200, padding: "0 16px", height: 42, background: activeTab === 'Male' ? 'var(--card-hover)' : 'transparent', border: `1px solid ${activeTab === 'Male' ? 'var(--accent)' : 'var(--border)'}` }}
                            >
                                Male Nominee {selectedMale && "✓"}
                            </button>
                            <button
                                className={`btn ${activeTab === 'Female' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveTab('Female')}
                                style={{ flex: 1, maxWidth: 200, padding: "0 16px", height: 42, background: activeTab === 'Female' ? 'var(--card-hover)' : 'transparent', border: `1px solid ${activeTab === 'Female' ? 'var(--accent)' : 'var(--border)'}` }}
                            >
                                Female Nominee {selectedFemale && "✓"}
                            </button>
                        </div>
                    )}

                    {/* Nominees Grid */}
                    <div className="nominees-grid">
                        <AnimatePresence>
                            {filteredNominees.length > 0 ? (
                                filteredNominees.map((nominee, i) => (
                                    <motion.div
                                        key={nominee.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <NomineeCard
                                            nominee={nominee}
                                            selected={isNomineeSelected(nominee.id)}
                                            onSelect={handleCardSelect}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        gridColumn: "1 / -1",
                                        textAlign: "center",
                                        padding: "48px 0",
                                        color: "var(--text-dim)"
                                    }}
                                >
                                    <div style={{ fontSize: 40, marginBottom: 16 }}>😕</div>
                                    <p>No nominees match "<strong>{searchTerm}</strong>"</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="voting-nav">
                        <button
                            className="btn btn-ghost"
                            onClick={onPrev}
                            disabled={isFirst}
                        >
                            ← Back
                        </button>

                        <div style={{ textAlign: "center" }}>
                            <div className="voting-nav-center">
                                {category.splitGender ? (
                                    (selectedMale && selectedFemale) ? (
                                        <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 700 }}>✓ All selections made</span>
                                    ) : (
                                        <span>Select {activeTab} nominee</span>
                                    )
                                ) : (
                                    selectedNominee ? (
                                        <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 700 }}>✓ Nominee selected</span>
                                    ) : (
                                        <span>Select a nominee</span>
                                    )
                                )}
                            </div>
                        </div>

                        {isLast ? (
                            <button
                                className="btn btn-primary"
                                onClick={onNext}
                                disabled={votedCount < totalRequiredVotes}
                                title={votedCount < totalRequiredVotes ? `Complete all required votes to submit` : ""}
                            >
                                Submit Votes 🎉
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={onNext}
                            >
                                Next →
                            </button>
                        )}
                    </div>

                    {isLast && votedCount < totalRequiredVotes && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ textAlign: "center", fontSize: 13, color: "var(--text-dim)", marginTop: 16 }}
                        >
                            You've completed {votedCount} of {totalRequiredVotes} required votes.
                            Go back and ensure both male/female are selected where required.
                        </motion.p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
