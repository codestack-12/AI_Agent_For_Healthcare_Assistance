import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function TrendChart({ title, data, dataKey, color = "#1D6F73", unit = "" }) {
  return (
    <div className="glass rounded-card p-5">
      <h3 className="text-base font-display font-semibold mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, opacity: 0.6 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, opacity: 0.6 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "none", fontSize: 13 }}
            formatter={(v) => [`${v} ${unit}`, ""]}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#grad-${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
