import { useEffect, useState } from "react";

const ULP_LIST = [
  "17100","17110","17120","17130","17131","17150","17180"
];

export default function ProsesPBModal({ open, onClose, data, onSuccess }) {
  const [ulp, setUlp] = useState("");
  const [tarifList, setTarifList] = useState({});
  const [tarifBaru, setTarifBaru] = useState("");
  const [dayaBaru, setDayaBaru] = useState("");

  /* ===== LOAD TARIF DAYA ===== */
  useEffect(() => {
    if (!open) return;
    fetch("/api/tarif-daya")
      .then(r => r.json())
      .then(res => setTarifList(res || {}));
  }, [open]);

  /* ===== AUTO DAYA ===== */
  useEffect(() => {
    if (!tarifBaru || !tarifList[tarifBaru]) {
      setDayaBaru("");
      return;
    }
    setDayaBaru(tarifList[tarifBaru][0] || "");
  }, [tarifBaru, tarifList]);

  function handleSave() {
    fetch("/api/proses2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        NO: data.NO,
        ULP: ulp,
        TARIF_BARU: tarifBaru,
        DAYA_BARU: dayaBaru
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          onSuccess();
          onClose();
        } else {
          alert(res.message || "Gagal simpan");
        }
      });
  }

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-title">Proses Tahap 2 (PB)</div>

        <div className="modal-form">

          {/* ULP */}
          <div className="form-group">
            <label>ULP</label>
            <select value={ulp} onChange={e => setUlp(e.target.value)}>
              <option value="">-- pilih ULP --</option>
              {ULP_LIST.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* TARIF */}
          <div className="form-group">
            <label>Tarif Baru</label>
            <select
              value={tarifBaru}
              onChange={e => setTarifBaru(e.target.value)}
            >
              <option value="">-- pilih tarif --</option>
              {Object.keys(tarifList).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* DAYA */}
          <div className="form-group">
            <label>Daya Baru</label>
            <input value={dayaBaru} disabled />
          </div>

        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={handleSave}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
