export default function CenterPopup({ open, type="success", message, onClose }) {
  if (!open) return null;

  return (
    <div className="popup-center" onClick={onClose}>
      <div className={`popup-box ${type}`} onClick={e => e.stopPropagation()}>
        <h4>{type === "success" ? "Berhasil" : "Gagal"}</h4>
        <div>{message}</div>
        <br />
        <button className="btn-primary" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
