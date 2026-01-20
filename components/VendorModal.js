import { useEffect, useState } from "react";

export default function VendorModal({ open, data, onClose, onSuccess }) {
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState("");
  const [kontak, setKontak] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");

  useEffect(() => {
  if (!open || !data) return;

  fetch("/api/vendor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getVendorList" })
  })
    .then(r => r.json())
    .then(res => {
      const list = Array.isArray(res.vendors) ? res.vendors : [];
      setVendors(list);

      // PREFILL VENDOR LAMA
      if (data.VENDOR) {
        setVendor(data.VENDOR);
        const v = list.find(x => x.NAMA_VENDOR === data.VENDOR);
        setKontak(v?.NO_TLPN || "");
      }
    })
    .catch(err => {
      console.error("Gagal load vendor:", err);
    });

}, [open, data]);


  function handleVendorChange(val) {
    setVendor(val);
    const v = vendors.find(x => x.NAMA_VENDOR === val);
setKontak(v ? v.NO_TLPN : "");
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
      action: "saveVendorToRecord",
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
          onSuccess();   // reload data
          onClose();     // tutup modal
        }, 800);
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
<select
  value={vendor}
  onChange={e => handleVendorChange(e.target.value)}
  onFocus={e => e.target.size = 8}   // 🔥 dropdown kebawah
  onBlur={e => e.target.size = 1}    // 🔥 balik normal
>
  <option value="">-- pilih vendor --</option>
  {vendors.map(v => (
    <option key={v.NAMA_VENDOR} value={v.NAMA_VENDOR}>
      {v.NAMA_VENDOR}
    </option>
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







