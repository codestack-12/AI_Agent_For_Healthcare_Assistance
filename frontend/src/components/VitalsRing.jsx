import { motion } from "framer-motion";

// The dashboard's signature element: a stethoscope-dial style radial progress ring
// used for daily goals (steps / water / sleep) instead of a plain progress bar.
export default function VitalsRing({ label, value, goal, unit, color = "#1D6F73", delay = 0 }) {
  const pct = Math.min(1, value / goal);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            className="stroke-ink/10 dark:stroke-white/10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - pct) }}
            transition={{ duration: 1.1, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold tabular-nums">{value}</span>
          <span className="text-[11px] opacity-60">/{goal} {unit}</span>
        </div>
      </div>
      <span className="text-sm font-medium opacity-80">{label}</span>
    </div>
  );
}
