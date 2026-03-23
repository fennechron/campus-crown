import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getResults, getNominees } from "../lib/firestore";
import { getDynamicCategories } from "../data/categories";
import { toPng } from "html-to-image";
import ShareButton from "../components/ui/ShareButton";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getRanked(voteObj = {}, includeNone = false) {
  return Object.entries(voteObj)
    .filter(([id]) => includeNone || id !== "none")
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
}
function findNominee(category, id) {
  if (!id || !category) return null;
  const clean = id.replace(/^(Male|Female|male|female)_/, "");
  return category.nominees.find((n) => n.id === clean || n.id === id);
}
function getWinners(ranked, category) {
  if (!ranked.length) return [];
  const max = ranked[0].count;
  return ranked.filter((r) => r.count === max).map((r) => findNominee(category, r.id)).filter(Boolean);
}

/* ─── Particle system ─────────────────────────────────────────────────────── */
function Particles({ count = 120, active }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: ["#fbbf24", "#fff", "#a78bfa", "#f472b6", "#34d399"][Math.floor(Math.random() * 5)],
    }))
  ).current;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: p.opacity }}
          animate={active ? {
            y: [`${p.y}vh`, `${p.y - 35 - Math.random() * 40}vh`],
            opacity: [p.opacity, 0],
            scale: [1, 0],
          } : {
            y: [`${p.y}vh`, `${p.y - 8}vh`, `${p.y}vh`],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
          }}
          transition={active ? {
            duration: Math.random() * 2 + 1.5,
            delay: Math.random() * 1.2,
            ease: "easeOut",
          } : {
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
          style={{
            position: "absolute",
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.color,
            left: 0, top: 0,
            x: `${p.x}vw`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Phase 1: Full-screen Intro ──────────────────────────────────────────── */
function PhaseIntro({ category, onAdvance }) {
  useEffect(() => {
    const t = setTimeout(onAdvance, 2800);
    return () => clearTimeout(t);
  }, [onAdvance]);

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 10,
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.2 }}
        style={{
          fontSize: "clamp(80px, 18vw, 160px)", lineHeight: 1, marginBottom: 24,
          filter: "drop-shadow(0 0 40px rgba(251,191,36,0.7))"
        }}
      >
        {category.emoji}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: "clamp(32px, 7vw, 80px)",
          fontWeight: 900, textAlign: "center",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          letterSpacing: "-0.03em", lineHeight: 1.05,
          background: "linear-gradient(160deg, #fef3c7 10%, #fbbf24 45%, #f59e0b 70%, #fde68a 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          maxWidth: "80vw", margin: "0 auto",
        }}
      >
        {category.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          fontSize: "clamp(11px, 1.5vw, 14px)", letterSpacing: "0.35em",
          color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: 20
        }}
      >
        Campus Crown · 2026
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.1, duration: 1.5, ease: "linear" }}
        style={{
          marginTop: 48, height: 2, width: "min(320px, 60vw)",
          background: "linear-gradient(90deg, transparent, #fbbf24, transparent)",
          transformOrigin: "left",
        }}
      />

      <button
        onClick={onAdvance}
        style={{
          position: "fixed", bottom: 32, right: 32,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.4)", padding: "9px 18px", borderRadius: 8,
          cursor: "pointer", fontSize: 12, letterSpacing: "0.08em", zIndex: 20,
        }}
      >
        skip ›
      </button>
    </motion.div>
  );
}

/* ─── Phase 2: Drum Roll ──────────────────────────────────────────────────── */
function PhaseDrum({ category, onReveal }) {
  const [current, setCurrent] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const nominees = category?.nominees || [];
    if (!nominees.length) { setTimeout(onReveal, 500); return; }

    let idx = 0;
    const shuffle = setInterval(() => {
      setCurrent(nominees[idx++ % nominees.length]);
    }, 85);

    let prog = 0;
    const progressTick = setInterval(() => {
      prog += 100 / (5000 / 60);
      setProgress(Math.min(prog, 100));
    }, 60);

    const done = setTimeout(() => {
      clearInterval(shuffle);
      clearInterval(progressTick);
      setProgress(100);
      onReveal();
    }, 5000);

    return () => { clearInterval(shuffle); clearInterval(progressTick); clearTimeout(done); };
  }, [category, onReveal]);

  return (
    <motion.div
      key="drum"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 10, gap: 0,
      }}
    >
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(120,60,200,0.18) 0%, transparent 70%)",
      }} />

      <motion.div
        animate={{ rotate: [-10, 10, -10], scale: [1, 1.18, 1] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontSize: "clamp(60px, 12vw, 110px)", marginBottom: 32,
          filter: "drop-shadow(0 0 30px rgba(255,255,255,0.25))"
        }}
      >
        🥁
      </motion.div>

      <p style={{
        fontSize: "clamp(9px, 1.2vw, 12px)", letterSpacing: "0.28em",
        color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 36,
      }}>
        Tallying votes…
      </p>

      <div style={{
        height: "clamp(56px, 8vh, 80px)", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 20, marginBottom: 56, minWidth: "60vw"
      }}>
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.06 }}
              style={{ display: "flex", alignItems: "center", gap: 20 }}
            >
              <div style={{
                width: "clamp(44px, 6vw, 64px)", height: "clamp(44px, 6vw, 64px)",
                borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${current.color}cc, ${current.color}44)`,
                boxShadow: `0 0 24px ${current.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "clamp(14px, 2vw, 20px)", fontWeight: 800, color: "white",
              }}>
                {current.initials}
              </div>
              <span style={{
                fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, color: "white",
                fontFamily: "'Georgia', serif", letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}>
                {current.name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ width: "min(400px, 70vw)", height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: "linear-gradient(90deg, #7c3aed, #ec4899, #fbbf24)", borderRadius: 2 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Phase 3: Full-screen Reveal ─────────────────────────────────────────── */
function PhaseReveal({ category, results, cardRef, onDownload, downloading, onBack }) {
  const isSplit = category.splitGender;
  const rankedMale = getRanked(results?.male);
  const rankedFemale = getRanked(results?.female);
  const rankedBase = getRanked(results?.base);

  const winnersMale = getWinners(rankedMale, category);
  const winnersFemale = getWinners(rankedFemale, category);
  const winnersBase = getWinners(rankedBase, category);

  const totalMale = getRanked(results?.male, true).reduce((s, r) => s + r.count, 0);
  const totalFemale = getRanked(results?.female, true).reduce((s, r) => s + r.count, 0);
  const totalBase = getRanked(results?.base, true).reduce((s, r) => s + r.count, 0);
  const totalVotes = isSplit ? totalMale + totalFemale : totalBase;

  const allWinners = isSplit ? [...winnersMale, ...winnersFemale] : winnersBase;
  const winnerNames = allWinners.map((w) => w.name).join(" & ") || "No Winner";


  const isSingleWinner = !isSplit && winnersBase.length === 1;

  return (
    <motion.div
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ position: "fixed", inset: 0, zIndex: 10, overflowY: "auto" }}
    >
      <div
        ref={cardRef}
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 24px 140px",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, transparent, #fbbf24, #f59e0b, #fbbf24, transparent)",
            transformOrigin: "left",
          }}
        />

        {/* Category label */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "clamp(9px, 1.3vw, 12px)", letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
            marginBottom: 28, textAlign: "center",
          }}
        >
          Campus Crown 2026 · {category.title}
        </motion.div>

        {isSingleWinner && (
          <SingleWinnerHero
            winner={winnersBase[0]}
            votes={rankedBase[0]?.count || 0}
            totalVotes={totalBase}
          />
        )}

        {isSplit && (
          <SplitWinnerLayout
            winnersMale={winnersMale}
            winnersFemale={winnersFemale}
            rankedMale={rankedMale}
            rankedFemale={rankedFemale}
            totalMale={totalMale}
            totalFemale={totalFemale}
            category={category}
          />
        )}

        {!isSingleWinner && !isSplit && winnersBase.length > 0 && (
          <TieLayout winners={winnersBase} ranked={rankedBase} total={totalBase} category={category} />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          style={{
            marginTop: 52, fontSize: "clamp(11px, 1.5vw, 14px)",
            color: "rgba(255,255,255,0.18)", letterSpacing: "0.18em",
            textTransform: "uppercase", textAlign: "center",
          }}
        >
          {totalVotes.toLocaleString()} votes cast
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            position: "absolute", bottom: 104, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            transformOrigin: "left",
          }}
        />
      </div>

      {/* Bottom HUD */}
      <div
        className="no-export"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "14px 24px",
          background: "linear-gradient(to top, rgba(5,5,15,0.98) 0%, transparent 100%)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap", zIndex: 60,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)", padding: "9px 18px", borderRadius: 8,
            cursor: "pointer", fontSize: 12, letterSpacing: "0.05em",
          }}
        >
          ← All Results
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onDownload}
            disabled={downloading}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)",
              color: "#fbbf24", padding: "9px 18px", borderRadius: 8,
              cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? "Saving…" : "Save"}
          </button>
          <ShareButton
            title={`Winner: ${winnerNames}`}
            text={`${winnerNames} won ${category.title} at Campus Crown 2026! 👑`}
            url={window.location.origin + `/results/${category.id}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Single winner: cinematic full-screen hero ───────────────────────────── */
function SingleWinnerHero({ winner, votes, totalVotes }) {
  const pct = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;

  return (
    <div style={{ textAlign: "center", width: "100%", maxWidth: 700 }}>
      {/* Crown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 200, damping: 14 }}
      >
        <motion.span
          animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontSize: "clamp(40px, 6vw, 64px)", display: "inline-block",
            filter: "drop-shadow(0 0 24px rgba(251,191,36,0.9))", marginBottom: 16
          }}
        >
          👑
        </motion.span>
      </motion.div>

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.35 }}
        style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}
      >
        <motion.div
          animate={{
            boxShadow: [
              `0 0 50px ${winner.color}44`,
              `0 0 100px ${winner.color}77`,
              `0 0 50px ${winner.color}44`,
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            width: "clamp(120px, 20vw, 200px)", height: "clamp(120px, 20vw, 200px)",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${winner.color}ee, ${winner.color}66)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "white",
            border: `3px solid ${winner.color}88`,
          }}
        >
          {winner.initials}
        </motion.div>
      </motion.div>

      {/* Name */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: "clamp(38px, 9vw, 100px)", fontWeight: 900, color: "white",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 16px",
        }}
      >
        {winner.name}
      </motion.h2>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.85, duration: 0.8 }}
        style={{
          height: 2, width: "min(200px, 50vw)", margin: "0 auto 24px",
          background: `linear-gradient(90deg, transparent, ${winner.color}, transparent)`,
          transformOrigin: "center",
        }}
      />

      {/* Vote pct */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          fontSize: "clamp(14px, 2.5vw, 22px)", color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.15em", textTransform: "uppercase",
        }}
      >
        {pct}% of votes
      </motion.p>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        style={{
          marginTop: 44, display: "flex", justifyContent: "center",
          gap: "clamp(24px, 6vw, 80px)", flexWrap: "wrap",
        }}
      >
        {[
          { label: "Votes Received", value: votes.toLocaleString() },
          { label: "Total Votes", value: totalVotes.toLocaleString() },
          { label: "Vote Share", value: `${pct}%` },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "clamp(26px, 4.5vw, 48px)", fontWeight: 900, color: "white",
              fontFamily: "'Georgia', serif", letterSpacing: "-0.02em",
            }}>
              {value}
            </div>
            <div style={{
              fontSize: "clamp(9px, 1.2vw, 11px)", letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginTop: 5,
            }}>
              {label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Split gender layout ─────────────────────────────────────────────────── */
function SplitWinnerLayout({ winnersMale, winnersFemale, rankedMale, rankedFemale, totalMale, totalFemale, category }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 90vw), 1fr))",
      gap: "clamp(16px, 3vw, 48px)",
      width: "100%", maxWidth: 920,
    }}>
      <WinnerPanel winners={winnersMale} ranked={rankedMale} total={totalMale} label="Best Male" category={category} delay={0.3} accentColor="#60a5fa" />
      <WinnerPanel winners={winnersFemale} ranked={rankedFemale} total={totalFemale} label="Best Female" category={category} delay={0.5} accentColor="#f472b6" />
    </div>
  );
}

/* ─── Tie layout ──────────────────────────────────────────────────────────── */
function TieLayout({ winners, ranked, total, category }) {
  return (
    <div style={{ width: "100%", maxWidth: 820, textAlign: "center" }}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: "clamp(10px, 1.5vw, 13px)", letterSpacing: "0.25em",
          color: "#fbbf24", textTransform: "uppercase", marginBottom: 32
        }}
      >
        It's a tie!
      </motion.p>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
        {winners.map((w, i) => (
          <WinnerPanel key={w.id} winners={[w]} ranked={ranked} total={total}
            label="Winner" category={category} delay={0.3 + i * 0.15} accentColor={w.color} />
        ))}
      </div>
    </div>
  );
}

/* ─── Winner Panel ────────────────────────────────────────────────────────── */
function WinnerPanel({ winners, ranked, total, label, category, delay, accentColor }) {
  if (!winners.length) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      style={{
        borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)", padding: "40px 32px", textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🤷</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>No votes for {label}</div>
    </motion.div>
  );

  const maxCount = ranked[0]?.count || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: "1 1 280px",
        borderRadius: 20,
        border: `1px solid ${accentColor}30`,
        background: "rgba(255,255,255,0.02)",
        padding: "clamp(24px, 4vw, 40px) clamp(20px, 3vw, 32px)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}
    >
      {/* Glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.65, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accentColor}18 0%, transparent 70%)`,
        }}
      />

      <p style={{
        fontSize: "clamp(9px, 1.2vw, 11px)", letterSpacing: "0.25em",
        color: accentColor, textTransform: "uppercase", marginBottom: 24, opacity: 0.85, position: "relative"
      }}>
        {label}
      </p>

      {winners.map((w, i) => {
        const pct = total ? Math.round(((ranked.find((r) => r.id === w.id)?.count || 0) / total) * 100) : 0;
        return (
          <div key={w.id} style={{ textAlign: "center", marginBottom: i < winners.length - 1 ? 32 : 0, position: "relative" }}>
            <motion.span
              animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontSize: "clamp(24px, 4vw, 36px)", display: "inline-block",
                marginBottom: 12, filter: "drop-shadow(0 0 12px rgba(251,191,36,0.8))"
              }}
            >
              👑
            </motion.span>

            <motion.div
              animate={{ boxShadow: [`0 0 30px ${w.color}33`, `0 0 60px ${w.color}55`, `0 0 30px ${w.color}33`] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                width: "clamp(80px, 12vw, 120px)", height: "clamp(80px, 12vw, 120px)",
                borderRadius: "50%", margin: "0 auto 16px",
                background: `linear-gradient(135deg, ${w.color}cc, ${w.color}55)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, color: "white",
                border: `2px solid ${w.color}66`,
              }}
            >
              {w.initials}
            </motion.div>

            <div style={{
              fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 900, color: "white",
              fontFamily: "'Georgia', serif", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8,
            }}>
              {w.name}
            </div>
            <div style={{ fontSize: "clamp(11px, 1.5vw, 14px)", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
              {pct}% of votes
            </div>
          </div>
        );
      })}

      {/* Mini breakdown */}
      <div style={{ width: "100%", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
        {ranked.slice(0, 4).map((r, i) => {
          const n = findNominee(category, r.id);
          if (!n) return null;
          const barPct = total ? (r.count / total) * 100 : 0;
          const isW = r.count === maxCount;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 + i * 0.08 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: `${n.color}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "white",
              }}>
                {n.initials}
              </div>
              <div style={{
                flex: 1, fontSize: "clamp(11px, 1.4vw, 13px)",
                color: isW ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 8
              }}>
                {n.name}
                <span style={{
                  fontSize: 9,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: isW ? "rgba(74, 222, 128, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  color: isW ? "#4ade80" : "rgba(255,255,255,0.2)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  border: `1px solid ${isW ? "rgba(74, 222, 128, 0.3)" : "rgba(255,255,255,0.1)"}`
                }}>
                  {isW ? "Selected" : "Not Selected"}
                </span>
              </div>
              <div style={{ width: 80, flexShrink: 0 }}>
                <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{ delay: delay + 0.5 + i * 0.07, duration: 0.7, type: "spring" }}
                    style={{ height: "100%", borderRadius: 2, background: isW ? accentColor : "rgba(255,255,255,0.12)" }}
                  />
                </div>
              </div>
              <div style={{ fontSize: "clamp(10px, 1.3vw, 12px)", color: "rgba(255,255,255,0.25)", minWidth: 22, textAlign: "right" }}>
                {r.count}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Ticker ──────────────────────────────────────────────────────────────── */
function Ticker({ text }) {
  const items = Array(10).fill(null).map((_, i) => (i % 2 === 0 ? text : "Campus Crown 2026"));
  return (
    <div style={{
      position: "fixed", bottom: 56, left: 0, right: 0, zIndex: 50,
      overflow: "hidden", pointerEvents: "none",
      borderTop: "1px solid rgba(251,191,36,0.1)",
      background: "rgba(5,5,15,0.8)", padding: "6px 0",
    }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 60, whiteSpace: "nowrap" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontSize: "clamp(9px, 1.2vw, 11px)", letterSpacing: "0.22em",
            textTransform: "uppercase", color: "rgba(251,191,36,0.38)",
          }}>
            ✦ {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function ResultsRevealPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("intro");
  const [category, setCategory] = useState(null);
  const [results, setResults] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [res, rawNominees] = await Promise.all([getResults(), getNominees()]);
        const cats = getDynamicCategories(rawNominees || []);
        const cat = cats.find((c) => c.id === categoryId);
        setCategory(cat);
        if (cat) {
          const votes = { male: {}, female: {}, base: {} };
          if (cat.splitGender) {
            votes.male = res[`${categoryId}-Male`] || {};
            votes.female = res[`${categoryId}-Female`] || {};
          } else {
            votes.base = res?.[categoryId] || {};
          }
          setResults(votes);
        }
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryId]);

  const goToDrum = useCallback(() => setPhase("drum"), []);

  const goToReveal = useCallback(() => {
    setPhase("reveal");
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000);
  }, []);

  const downloadImage = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const opts = {
        cacheBust: true, backgroundColor: "#05050f",
        filter: (n) => !n.classList?.contains("no-export"),
      };
      let url;
      try { url = await toPng(cardRef.current, opts); }
      catch { url = await toPng(cardRef.current, { ...opts, fontEmbedCSS: "" }); }
      const a = document.createElement("a");
      a.download = `winner-${categoryId}.png`;
      a.href = url; a.click();
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  }, [categoryId]);

  if (loading) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#05050f",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <motion.div
          animate={{}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: 48 }}
        >Please Wait...</motion.div>
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#05050f", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white"
      }}>
        <h2 style={{ marginBottom: 20 }}>Category not found</h2>
        <button onClick={() => navigate("/results")} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          color: "white", padding: "10px 20px", borderRadius: 8, cursor: "pointer",
        }}>← Go back</button>
      </div>
    );
  }

  const allWinners = [
    ...getWinners(getRanked(results?.male), category),
    ...getWinners(getRanked(results?.female), category),
    ...(!category.splitGender ? getWinners(getRanked(results?.base), category) : []),
  ];
  const winnerNames = allWinners.map((w) => w.name).join(" & ") || "No Winner";

  return (
    <div style={{ position: "fixed", inset: 0, background: "#05050f", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.25); border-radius: 2px; }
      `}</style>

      {/* Grain texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize: "180px",
      }} />

      {/* Ambient light */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(100,50,200,0.08) 0%, transparent 65%)",
      }} />

      <Particles count={90} active={confetti} />

      <AnimatePresence mode="wait">
        {phase === "intro" && <PhaseIntro key="intro" category={category} onAdvance={goToDrum} />}
        {phase === "drum" && <PhaseDrum key="drum" category={category} onReveal={goToReveal} />}
        {phase === "reveal" && (
          <PhaseReveal
            key="reveal"
            category={category}
            results={results}
            cardRef={cardRef}
            onDownload={downloadImage}
            downloading={downloading}
            onBack={() => navigate("/results")}
          />
        )}
      </AnimatePresence>

      {phase === "reveal" && <Ticker text={`${winnerNames} — ${category.title}`} />}
    </div>
  );
}