import { useEffect, useState } from "react";

export default function VendorModal({ open, data, onClose, onSuccess }) {
  const [vendors, setVendors] = useState([]);
  const [vendorJaringan, setVendorJaringan] = useState("");
const [vendorTiang, setVendorTiang] = useState("");
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
     if (data.VENDOR_JARINGAN) setVendorJaringan(data.VENDOR_JARINGAN);
if (data.VENDOR_TIANG) setVendorTiang(data.VENDOR_TIANG);
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
  if (!vendorJaringan && !vendorTiang) {
  setPopup("Pilih minimal satu vendor");
  return;
}


  setLoading(true);

  fetch("/api/vendor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
  action: "saveVendorToRecord",
  NO: String(data.NO),
  VENDOR_JARINGAN: vendorJaringan,
  VENDOR_TIANG: vendorTiang
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
  <div className="form-group">
  <label>Vendor Jaringan</label>
  <select
    value={vendorJaringan}
    onChange={e => setVendorJaringan(e.target.value)}
  >
    <option value="">-- pilih vendor jaringan --</option>
    {vendors.map(v => (
      <option key={v.NAMA_VENDOR} value={v.NAMA_VENDOR}>
        {v.NAMA_VENDOR}
      </option>
    ))}
  </select>
</div>

<div className="form-group">
  <label>Vendor Tiang</label>
  <select
    value={vendorTiang}
    onChange={e => setVendorTiang(e.target.value)}
  >
    <option value="">-- pilih vendor tiang --</option>
    {vendors.map(v => (
      <option key={v.NAMA_VENDOR} value={v.NAMA_VENDOR}>
        {v.NAMA_VENDOR}
      </option>
    ))}
  </select>
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





















