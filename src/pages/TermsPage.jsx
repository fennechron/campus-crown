import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";

export default function TermsPage() {
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
                    <h1 style={{ fontSize: 48, marginBottom: 24, letterSpacing: "-0.04em" }}>Terms of Service</h1>
                    <p style={{ color: "var(--text-dim)", marginBottom: 48 }}>Last Updated: March 21, 2026</p>

                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 16, color: "white" }}>1. Acceptance of Terms</h2>
                        <p style={{ lineHeight: 1.8 }}>
                            By accessing or using Campus Crown, you agree to be bound by these Terms of Service.
                            If you do not agree with any part of these terms, you may not use our platform.
                        </p>
                    </section>

                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 16, color: "white" }}>2. Voting Eligibility</h2>
                        <p style={{ lineHeight: 1.8 }}>
                            Voting is intended for university students and community members.
                            Any attempt to manipulate voting results through automated means, multiple accounts,
                            or other fraudulent activities will result in the disqualification of those votes.
                        </p>
                    </section>

                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 16, color: "white" }}>3. Content Ownership</h2>
                        <p style={{ lineHeight: 1.8 }}>
                            The name "Campus Crown," its logo, and all original content on this platform are
                            the intellectual property of Fennechron Labs. You may not use our branding
                            without explicit permission.
                        </p>
                    </section>

                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 16, color: "white" }}>4. Limitation of Liability</h2>
                        <p style={{ lineHeight: 1.8 }}>
                            Campus Crown is provided "as is" without any warranties.
                            We are not responsible for any inaccuracies in voting results or
                            interruptions in service.
                        </p>
                    </section>

                    <section style={{ marginBottom: 40, padding: 32, background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)" }}>
                        <h3 style={{ fontSize: 20, marginBottom: 12, color: "var(--accent)" }}>Contact Us</h3>
                        <p style={{ margin: 0 }}>
                            If you have any questions about these Terms, please contact us at: <br />
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
