import { useState, useEffect } from "react";

export default function ProsesModal({ open, data, onClose, onSuccess }) {
  if (!open || !data) return null;

  const [saving, setSaving] = useState(false);
  const [kategori, setKategori] = useState("");

  useEffect(() => {
    if (!data) return;
    setKategori(data.KATEGORI || "");
  }, [data]);

  function handleSubmit() {
    setSaving(true);

    fetch("/api/proses2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "saveProses2",
        NO: data.NO,
        KATEGORI: kategori
      })
    })
      .then(r => r.json())
      .then(() => {
        setSaving(false);
        onSuccess();
        onClose();
      })
      .catch(() => {
        setSaving(false);
        alert("Error");
      });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 400 }}>
        <h3>Proses Tahap 2</h3>

        <div className="form-group">
          <label>Kategori</label>
          <input
            value={kategori}
            onChange={e => setKategori(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Batal</button>
          <button disabled={saving} onClick={handleSubmit}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
