import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
}

function getTimeLeft(targetDate) {
    const now = Date.now();
    const target = new Date(targetDate).getTime();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, done: diff === 0 };
}

function Unit({ value, label }) {
    return (
        <div className="countdown-unit">
            <div className="countdown-number">{pad(value)}</div>
            <div className="countdown-label">{label}</div>
        </div>
    );
}

export default function CountdownTimer({ targetDate }) {
    const [time, setTime] = useState(() => getTimeLeft(targetDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getTimeLeft(targetDate));
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="countdown-grid">
            <Unit value={time.days} label="Days" />
            <span className="countdown-sep">:</span>
            <Unit value={time.hours} label="Hours" />
            <span className="countdown-sep">:</span>
            <Unit value={time.minutes} label="Mins" />
            <span className="countdown-sep">:</span>
            <Unit value={time.seconds} label="Secs" />
        </div>
    );
}
