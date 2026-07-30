import { motion } from "framer-motion";

const statusColor = {
  normal: "text-leaf",
  low: "text-coral-dark",
  high: "text-coral-dark",
};

export default function HealthCard({ icon: Icon, label, value, unit, status = "normal", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="glass rounded-card p-5 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-teal/10 dark:bg-teal-light/10 flex items-center justify-center text-teal dark:text-teal-light shrink-0">
        <Icon size={22} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
        <p className="text-2xl font-display font-semibold tabular-nums">
          {value} <span className="text-sm font-body font-normal opacity-60">{unit}</span>
        </p>
        <p className={`text-xs font-medium capitalize ${statusColor[status] || ""}`}>{status}</p>
      </div>
    </motion.div>
  );
}
