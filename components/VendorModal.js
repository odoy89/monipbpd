import { useEffect, useState } from "react";

export default function VendorModal({ open, data, onClose, onSuccess }) {
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState("");
  const [kontak, setKontak] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");

  useEffect(() => {
  if (!open || !data) return;

  fetch("/api/vendor")
    .then(r => r.json())
    .then(res => {
      const list = Array.isArray(res.vendors) ? res.vendors : [];
      setVendors(list);

      // 🔥 LOAD DATA LAMA
      if (data.VENDOR) {
        setVendor(data.VENDOR);
        const v = list.find(x => x.nama === data.VENDOR);
        setKontak(v?.kontak || "");
      }
    });
}, [open, data]);


  function handleVendorChange(val) {
    setVendor(val);
    const v = vendors.find(x => x.nama === val);
    setKontak(v ? v.kontak : "");
  }

function handleSubmit() {
  if (!vendor) {
    setPopup("Pilih vendor dulu");
    return;
  }

  setLoading(true);

  fetch("/api/vendor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "saveVendor",
      NO: String(data.NO),
      NAMA_VENDOR: vendor,
      NO_TLPN: kontak
    })
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === "ok") {
        setPopup("Vendor berhasil disimpan");
        setTimeout(() => {
          setPopup("");
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setPopup(res.message || "Gagal menyimpan vendor");
      }
    })
    .catch(() => setPopup("Koneksi error"))
    .finally(() => setLoading(false));
}


  if (!open || !data) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-card">
          <h3>Pilih Vendor</h3>

          <div className="form-group">
            <label>Nama Vendor</label>
            <select value={vendor} onChange={e => handleVendorChange(e.target.value)}>
              <option value="">-- pilih vendor --</option>
              {vendors.map(v => (
                <option key={v.nama} value={v.nama}>{v.nama}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Kontak Vendor</label>
            <input value={kontak} disabled />
          </div>

          <div className="modal-actions">
            <button className="btn-ghost" onClick={onClose}>Batal</button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>

      {popup && (
        <div className="popup-success" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          {popup}
        </div>
      )}
    </>
  );
}

