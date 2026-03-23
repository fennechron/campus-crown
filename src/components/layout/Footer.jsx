import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            borderTop: "1px solid var(--border)",
            padding: "80px 24px 24px",
            background: "var(--surface)",
            position: "relative",
            zIndex: 1,
            marginTop: "auto",
            marginBottom: 0
        }}>
            <div className="container">
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "48px 32px",
                    marginBottom: 64,
                    textAlign: "left"
                }}>
                    {/* Brand Column */}
                    <div>
                        <div
                            onClick={() => navigate("/")}
                            style={{
                                fontSize: 24,
                                fontWeight: 900,
                                fontFamily: "var(--font-display)",
                                letterSpacing: "-0.04em",
                                marginBottom: 16,
                                color: "white",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 10
                            }}
                        >
                            <img src="/logoaward.png" style={{ height: 40, width: "auto" }} alt="Logo" />
                            <span style={{ color: "var(--text-muted)", fontSize: 15, letterSpacing: "-0.02em" }}>Campus Crown</span>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, maxWidth: 300 }}>
                            Celebrating the excellence, talent, and unique memories of college life.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 24 }}>Platform</h4>
                        <ul className="footer-links" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                            <li onClick={() => navigate("/")} style={{ color: "var(--text-dim)", fontSize: 14, cursor: "pointer" }}>Home</li>
                            <li onClick={() => navigate("/vote")} style={{ color: "var(--text-dim)", fontSize: 14, cursor: "pointer" }}>Vote Now</li>
                            <li onClick={() => navigate("/results")} style={{ color: "var(--text-dim)", fontSize: 14, cursor: "pointer" }}>Live Results</li>

                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 24 }}>Support</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                            <li><a href="mailto:fennechronlabs@gmail.com" style={{ color: "var(--text-dim)", fontSize: 14, textDecoration: "none" }}>Contact Us</a></li>
                            <li onClick={() => navigate("/terms")} style={{ color: "var(--text-dim)", fontSize: 14, cursor: "pointer" }}>Terms of Service</li>
                            <li onClick={() => navigate("/privacy")} style={{ color: "var(--text-dim)", fontSize: 14, cursor: "pointer" }}>Privacy Policy</li>
                        </ul>
                    </div>

                    {/* Contact info / Fennechron */}
                    <div>
                        <h4 style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 24 }}>Connect</h4>
                        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                            Developed by <strong>Fennechron Labs</strong>.
                        </p>
                        <a
                            href="mailto:fennechronlabs@gmail.com"
                            style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                padding: "10px 20px",
                                borderRadius: "10px",
                                fontSize: 13,
                                color: "var(--accent)",
                                fontWeight: 700,
                                textDecoration: "none",
                                display: "inline-block",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                            }}
                        >
                            fennechronlabs@gmail.com
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: 32,
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 20
                }}>
                    <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0 }}>
                        &copy; {currentYear} Campus Crown. Built with 🪄 by Fennechron Labs.
                    </p>
                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>

                        <span style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Community Project</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
