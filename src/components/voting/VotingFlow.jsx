import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CATEGORIES from "../../data/categories";
import CategoryView from "./CategoryView";
import { saveVotesLocally, loadVotesLocally, markSubmitted, hasSubmitted, hasSubmittedIDB } from "../../lib/storage";
import { submitAllVotes } from "../../lib/firestore";
import BottomNav from "../layout/BottomNav"; export default function VotingFlow({
    userId,
    categories: propCategories,
    onCategoryChange,
    jumpToIndex,
    onJumpHandled,
    onSearchOpen,
    onRegisterSelect,
    onGenderFilterChange
}) {
    const navigate = useNavigate();
    const categories = propCategories || CATEGORIES;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [votes, setVotes] = useState(() => loadVotesLocally());
    const [submitting, setSubmitting] = useState(false);

    // Register select handler with parent for GlobalSearch access
    useEffect(() => {
        if (onRegisterSelect) {
            onRegisterSelect(() => handleSelect);
        }
    }, [onRegisterSelect]);

    // If already submitted, redirect
    useEffect(() => {
        const shouldCheck = import.meta.env.VITE_CHECK_PREVIOUS_VOTES === "true";
        const check = async () => {
            if (shouldCheck && (hasSubmitted() || await hasSubmittedIDB())) {
                navigate("/thank-you", { replace: true });
            }
        };
        check();
    }, [navigate]);

    // Notify parent of index changes for progress bar
    useEffect(() => {
        if (onCategoryChange) onCategoryChange(currentIndex);
    }, [currentIndex, onCategoryChange]);

    // Jump to category from search
    useEffect(() => {
        if (jumpToIndex !== null && jumpToIndex !== undefined && jumpToIndex !== currentIndex) {
            setDirection(jumpToIndex > currentIndex ? 1 : -1);
            setCurrentIndex(jumpToIndex);
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (onJumpHandled) onJumpHandled();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jumpToIndex]);

    // Persist votes to localStorage on every change
    useEffect(() => {
        saveVotesLocally(votes);
    }, [votes]);

    const currentCategory = categories[currentIndex];
    const totalCategories = categories.length;
    const totalRequiredVotes = categories.reduce((sum, c) => sum + (c.splitGender ? 2 : 1), 0);
    const votedCount = Object.keys(votes).length;

    const handleSelect = useCallback((nomineeId, genderSuffix) => {
        const key = genderSuffix ? `${currentCategory.id}${genderSuffix}` : currentCategory.id;
        setVotes((prev) => ({ ...prev, [key]: nomineeId }));
    }, [currentCategory.id]);

    const handleNext = useCallback(() => {
        console.log("VotingFlow: handleNext", { currentIndex, totalCategories });
        if (currentIndex < totalCategories - 1) {
            setDirection(1);
            setCurrentIndex((i) => i + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, totalCategories, votedCount, votes, userId]);

    const handlePrev = useCallback(() => {
        console.log("VotingFlow: handlePrev", { currentIndex });
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex((i) => i - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [currentIndex]);

    const handleSubmit = async () => {
        if (votedCount < totalRequiredVotes) return;
        setSubmitting(true);
        try {
            if (userId) {
                await submitAllVotes(userId, votes);
            }
        } catch (err) {
            console.error("Submit error (non-fatal):", err);
        } finally {
            markSubmitted();
            navigate("/thank-you");
        }
    };

    if (submitting) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p className="loading-text">Submitting your votes...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <CategoryView
                category={currentCategory}
                selectedNominee={votes[currentCategory.id]}
                selectedMale={votes[`${currentCategory.id}-Male`]}
                selectedFemale={votes[`${currentCategory.id}-Female`]}
                onSelect={handleSelect}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirst={currentIndex === 0}
                isLast={currentIndex === totalCategories - 1}
                direction={direction}
                totalCategories={totalCategories}
                votedCount={votedCount}
                totalRequiredVotes={totalRequiredVotes}
                onTabChange={onGenderFilterChange}
            />

            <BottomNav
                onPrev={handlePrev}
                onNext={handleNext}
                onSearchOpen={onSearchOpen}
                isFirst={currentIndex === 0}
                isLast={currentIndex === totalCategories - 1}
                votedCount={votedCount}
                totalRequiredVotes={totalRequiredVotes}
                isVoted={currentCategory.splitGender
                    ? (votes[`${currentCategory.id}-Male`] && votes[`${currentCategory.id}-Female`])
                    : !!votes[currentCategory.id]
                }
                isSplit={currentCategory.splitGender}
            />
        </div>
    );
}
