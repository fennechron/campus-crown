import { motion } from "framer-motion";

const CheckIcon = () => (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path d="M1 5l3.5 3.5L11 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function NomineeCard({ nominee, selected, onSelect, disabled }) {
    return (
        <motion.div
            className={`nominee-card${selected ? " selected" : ""}`}
            onClick={() => !disabled && onSelect(nominee.id)}
            whileTap={{ scale: 0.97 }}
            layout
        >
            <div className="nominee-avatar" style={{ background: `linear-gradient(135deg, ${nominee.color}cc, ${nominee.color}66)` }}>
                <div className="nominee-avatar-ring" />
                {nominee.initials}
            </div>

            <div style={{ textAlign: "center" }}>
                <div className="nominee-name">{nominee.name}</div>
                {nominee.tagline && (
                    <div className="nominee-tagline">{nominee.tagline}</div>
                )}
            </div>

            <div className="nominee-check">
                <span style={{ fontSize: 10, fontWeight: 700, marginRight: 4, color: "#000", textTransform: "uppercase", letterSpacing: "0.02em" }}>Selected</span>
                <CheckIcon />
            </div>
        </motion.div>
    );
}
