import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CATEGORIES from "../data/categories";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FlipCounter from "../components/ui/FlipCounter";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    }
};

const STATS = [
    { number: "30+", label: "Categories" },
    { number: "67", label: "Nominees" },
    { number: "2026", label: "Edition" },
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <Header showProgress={false} currentIndex={0} totalCategories={30} />

            <section className="landing-hero" style={{ overflow: "hidden", height: "100vh" }}>
                <div className="landing-bg-grid" />
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="hero-container"
                    style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100%", justifyContent: "center", marginTop: "50px" }}
                >
                    <div className="hero-content-wrapper">
                        <div className="hero-text-content">
                            <motion.div variants={itemVariants} className="landing-eyebrow">
                                College Awards 2026
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="landing-title">
                                Vote for the
                                <br />
                                <span className="gradient-text">Best of Us</span>
                            </motion.h1>

                            <motion.p variants={itemVariants} className="landing-subtitle">
                                Cast your votes across 30+ award categories — from talent and personality to the awards everyone secretly wants.
                            </motion.p>

                            <motion.div variants={itemVariants} className="landing-cta-group">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-primary btn-lg"
                                    onClick={() => navigate("/vote")}
                                >
                                    Start Voting
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-ghost btn-lg"
                                    onClick={() => navigate("/results")}
                                >
                                    View Results
                                </motion.button>
                            </motion.div>
                        </div>

                        <motion.div variants={itemVariants} className="hero-counter-wrap">
                            <div className="counter-display-box">
                                <FlipCounter />
                            </div>
                            <div className="counter-label-box">
                                Total Voters
                            </div>
                        </motion.div>
                    </div>

                     
                </motion.div>
            </section>

            {/* Category Preview */}
            <section className="categories-preview" style={{ position: "relative", zIndex: 5 }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: "center", marginBottom: 32 }}
                    >
                        <h2 className="section-title" style={{ textShadow: "0 0 15px rgba(255,255,255,0.2)" }}>Award Categories</h2>
                        <p className="section-subtitle">Browse all 69 awards waiting for your picks</p>
                    </motion.div>

                    {/* Talent */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        style={{ marginBottom: 28 }}
                    >
                        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a5b4fc", fontWeight: 600, marginBottom: 12 }}>
                            🎓 Talent Awards
                        </div>
                        <div className="category-pills">
                            {CATEGORIES.filter((c) => c.type === "talent").map((c) => (
                                <motion.span key={c.id} variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(165, 180, 252, 0.4)", borderColor: "rgba(165, 180, 252, 0.6)" }} className="category-pill">
                                    <span>{c.emoji}</span> {c.title}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Personality */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        style={{ marginBottom: 28 }}
                    >
                        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5eead4", fontWeight: 600, marginBottom: 12 }}>
                            🤝 Personality Awards
                        </div>
                        <div className="category-pills">
                            {CATEGORIES.filter((c) => c.type === "personality").map((c) => (
                                <motion.span key={c.id} variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(94, 234, 212, 0.4)", borderColor: "rgba(94, 234, 212, 0.6)" }} className="category-pill">
                                    <span>{c.emoji}</span> {c.title}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Funny */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        style={{ marginBottom: 40 }}
                    >
                        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fdba74", fontWeight: 600, marginBottom: 12 }}>
                            😂 Funny Awards
                        </div>
                        <div className="category-pills">
                            {CATEGORIES.filter((c) => c.type === "funny").map((c) => (
                                <motion.span key={c.id} variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(253, 186, 116, 0.4)", borderColor: "rgba(253, 186, 116, 0.6)" }} className="category-pill">
                                    <span>{c.emoji}</span> {c.title}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    <div style={{ textAlign: "center" }}>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary btn-lg"
                            style={{ background: "linear-gradient(90deg, #fff, #ddd)", border: "none" }}
                            onClick={() => navigate("/vote")}
                        >
                            Start Voting Now →
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer/>
        </div>
    );
}
