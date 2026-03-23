import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getVoteCount } from "../../lib/firestore";

function Digit({ value }) {
    return (
        <div className="flip-digit-box">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: "50%", opacity: 0, rotateX: -90 }}
                    animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                    exit={{ y: "-50%", opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                    style={{ position: "absolute", transformOrigin: "center" }}
                >
                    {value}
                </motion.span>
            </AnimatePresence>
            {/* Decorative center line for classic flip clock look */}
            <div className="flip-digit-line" />
        </div>
    );
}

export default function FlipCounter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function fetchVotes() {
            try {
                const totalCount = await getVoteCount();

                if (isMounted) {
                    // Slight artificial delay for initial dramatic effect
                    setTimeout(() => setCount(totalCount), 800);
                }
            } catch (err) {
                console.error("Failed to fetch vote count:", err);
            }
        }

        fetchVotes();
        const interval = setInterval(fetchVotes, 15000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    // Pad with zeros to always show at least 3 digits
    const countStr = count.toString().padStart(3, "0");

    return (
        <div className="flip-counter">
            <div className="flip-digits">
                {countStr.split('').map((char, index) => (
                    <Digit key={`${index}-${countStr.length - index}`} value={char} />
                ))}
            </div>
        </div>
    );
}
