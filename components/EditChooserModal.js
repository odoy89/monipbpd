export default function EditChooserModal({ open, onClose, onPick }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 420 }}>
        <h3 style={{ marginBottom: 16 }}>Pilih Jenis Edit</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10
          }}
        >
          <button className="btn-primary" onClick={() => onPick("SURAT")}>
            ✏️ Edit Surat
          </button>

          <button className="btn-warning" onClick={() => onPick("PROSES2")}>
            ⚙️ Edit Proses 2
          </button>

          <button className="btn-info" onClick={() => onPick("VENDOR")}>
            🏗️ Edit Vendor
          </button>

          <button className="btn-success" onClick={() => onPick("PROGRES")}>
            📈 Edit Progres
          </button>
        </div>

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button className="btn-ghost" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
