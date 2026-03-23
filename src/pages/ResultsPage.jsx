import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getResultPublishDate, getResults, getNominees } from "../lib/firestore";
import { getDynamicCategories } from "../data/categories";
import ComingSoonPage from "../components/results/ComingSoonPage";
import ResultsDisplay from "../components/results/ResultsDisplay";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Fallback publish date (30 days from now)
const FALLBACK_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

export default function ResultsPage() {
    const navigate = useNavigate();
    const [publishDate, setPublishDate] = useState(null);
    const [results, setResults] = useState(null);
    const [remoteNominees, setRemoteNominees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revealed, setRevealed] = useState(false);
    const [isYear2027, setIsYear2027] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const date = await getResultPublishDate();
                const finalDate = date || FALLBACK_DATE;
                setPublishDate(finalDate);

                const now = new Date();
                const pub = new Date(finalDate);
                console.log(pub.getFullYear());
                
                if (pub.getFullYear() === 2027) {
                    setIsYear2027(true);
                } else if (pub <= now) {
                    const [res, nominees] = await Promise.all([
                        getResults(),
                        getNominees()
                    ]);
                    setResults(res);
                    if (nominees && nominees.length > 0) {
                        setRemoteNominees(nominees);
                    }
                    setRevealed(true);
                }
            } catch (err) {
                console.error("Results load error:", err);
                setPublishDate(FALLBACK_DATE);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const dynamicCategories = useMemo(() => {
        return getDynamicCategories(remoteNominees);
    }, [remoteNominees]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p className="loading-text">Loading results...</p>
            </div>
        );
    }

    if (isYear2027) {
        return (
            <div className="page">
                <Header currentIndex={0} totalCategories={30} showProgress={false} />
                <div className="container" style={{ paddingTop: 100, paddingBottom: 60, textAlign: "center" }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{ fontSize: 64, marginBottom: 24 }}></div>
                        <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 800, marginBottom: 16 }}>
                            Result date is not yet declared
                        </h1>
                        <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
                            The result date will be announced soon. Stay tuned!
                        </p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: 32 }}
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </button>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }
    if (!revealed) {
        return <ComingSoonPage publishDate={publishDate} />;
    }

    return (
        <div className="page">
            <Header currentIndex={0} totalCategories={30} showProgress={false} />
            <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: 36, textAlign: "center" }}
                >
                    <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 600 }}>
                        Official Results
                    </span>
                    <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 900, letterSpacing: "-0.04em", marginTop: 8 }}>
                        Award Winners <img src="/logoaward.png" style={{ height: 32, width: "auto", verticalAlign: "middle" }} alt="Logo" />
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: 15, marginTop: 10 }}>
                        The votes are in. Here are your college award winners!
                    </p>
                </motion.div>

                <ResultsDisplay results={results || {}} categories={dynamicCategories} />

                <div style={{ textAlign: "center", marginTop: 40 }}>
                    <button className="btn btn-secondary" onClick={() => navigate("/")}>← Back to Home</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
