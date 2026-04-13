export default function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "22px", fontWeight: "700", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "9px", color: "#556", marginTop: "2px" }}>{label}</div>
    </div>
  );
}
