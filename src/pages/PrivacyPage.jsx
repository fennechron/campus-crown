import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page">
            <Header />
            <main className="container" style={{ padding: "80px 24px", maxWidth: 800 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={{ fontSize: 48, marginBottom: 24, letterSpacing: "-0.04em" }}>Privacy Policy</h1>
                    <p style={{ color: "var(--text-dim)", marginBottom: 48 }}>Last Updated: March 21, 2026</p>

                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 16, color: "white" }}>1. Information We Collect</h2>
                        <p style={{ lineHeight: 1.8 }}>
                            We collect minimal information to ensure voting integrity. This includes anonymous device
                            identifiers (FingerprintJS) and session data provided by Appwrite. We do not collect
                            your personal name or identity unless explicitly provided.
                        </p>
                    </section>

                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 16, color: "white" }}>2. How We Use Data</h2>
                        <p style={{ lineHeight: 1.8 }}>
                            Collected data is used solely to prevent duplicate voting and to generate
                            aggregated award results. We do not sell or share your individual data
                            with third parties for marketing purposes.
                        </p>
                    </section>

                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 16, color: "white" }}>3. Data Protection</h2>
                        <p style={{ lineHeight: 1.8 }}>
                            All voting data is stored securely using Appwrite Cloud services.
                            We take reasonable measures to protect your information from unauthorized
                            access or disclosure.
                        </p>
                    </section>

                    <section style={{ marginBottom: 40, padding: 32, background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)" }}>
                        <h3 style={{ fontSize: 20, marginBottom: 12, color: "var(--accent)" }}>Your Rights</h3>
                        <p style={{ margin: 0 }}>
                            Since we mostly store anonymous data, we may not be able to identify your specific records.
                            However, if you have any privacy concerns, reach out to: <br />
                            <a href="mailto:fennechronlabs@gmail.com" style={{ color: "white", fontWeight: 700, textDecoration: "underline" }}>
                                fennechronlabs@gmail.com
                            </a>
                        </p>
                    </section>
                </motion.div>
            </main>
           
        </div>
    );
}
