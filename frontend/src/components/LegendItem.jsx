export default function LegendItem({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#a1a1aa", fontWeight: "500" }}>
      <div style={{ width: "16px", height: "16px", borderRadius: "4px", border: `2px solid ${color}`, background: color + "22" }} />
      {label}
    </div>
  );
}
