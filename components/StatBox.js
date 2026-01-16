export default function StatBox({ color, title, value }) {
  return (
    <div style={{
      flex: 1,
      background: color,
      color: "#fff",
      padding: 20,
      borderRadius: 10,
      textAlign: "center"
    }}>
      <h1>{value}</h1>
      <div>{title}</div>
    </div>
  );
}
