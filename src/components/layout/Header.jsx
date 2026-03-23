import { useNavigate } from "react-router-dom";

import { Home, Moon, User, Sun,Phone,Gift } from "lucide-react";

const SearchIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);

export default function Header({ currentIndex, totalCategories, showProgress, onSearchOpen }) {
    const navigate = useNavigate();
    const votedCount = currentIndex + 1;
    const pct = showProgress ? (currentIndex / Math.max(totalCategories - 1, 1)) * 100 : 0;

    return (
        <header className="header">
            <div className="header-inner">
                <div
                    className="header-logo"
                    style={{ cursor: "pointer",backgroundColor:"transparent",border:"1px solid var(--border)",color:"var(--text-muted)",borderRadius:"10px",padding:"10px 10px"}}
                    onClick={() => navigate("/")}
                >
                    <img src="/logoaward.png" style={{ height: 40, width: "auto" ,mixBlendMode:"screen", borderRadius:"20px"}} alt="Logo" /> <span style={{ color: "var(--text-muted)", fontSize: 15, letterSpacing: "-0.02em" }}>Campus Crown</span>

                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {showProgress && (
                        <div className="progress-info">
                            <span>Category</span>
                            <span className="progress-count">
                                {Math.min(votedCount, totalCategories)} / {totalCategories}
                            </span>
                        </div>
                    )}

                    {!showProgress && (
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <button className="icon-btn" onClick={() => navigate("/")} title="Home">
                                <Home size={20} />
                            </button>
                            <button className="icon-btn" title="Contact Us" >
                                <Phone size={20} />
                            </button>
                            <button className="icon-btn" title="Result" onClick={() => navigate("/results")}>
                                <Gift size={20} />
                            </button>

                        </div>
                    )}

                    {onSearchOpen && (
                        <button
                            className="hidden-mobile"
                            onClick={onSearchOpen}
                            title="Search nominees (Ctrl+K)"
                            style={{
                                display: "flex", alignItems: "center", gap: 7,
                                padding: "7px 12px", borderRadius: 8, cursor: "pointer",
                                background: "var(--card)", border: "1px solid var(--border)",
                                color: "var(--text-muted)", fontFamily: "var(--font-sans)",
                                fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--border-bright)";
                                e.currentTarget.style.color = "var(--text)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.color = "var(--text-muted)";
                            }}
                        >
                            <SearchIcon />
                            <span style={{
                                fontSize: 11, color: "var(--text-dim)",
                                background: "var(--surface)", border: "1px solid var(--border)",
                                borderRadius: 4, padding: "1px 5px",
                            }}>⌘K</span>
                        </button>
                    )}
                </div>
            </div>

            {showProgress && (
                <div className="progress-strip">
                    <div
                        className="progress-fill"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            )}
        </header>
    );
}
