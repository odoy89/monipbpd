import { useState, useEffect } from "react";

export default function TambahSuratModal({ open, data, onClose, onSuccess }) {
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [tglSurat, setTglSurat] = useState("");
  const [tglTerima, setTglTerima] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileLama = data?.FILE_SURAT || "";


  /* ===== PREFILL EDIT ===== */
  useEffect(() => {
  if (!open) return;

  if (data) {
    setNama(data.NAMA_PELANGGAN || "");
    setJenis(data.JENIS_TRANSAKSI || "");
    setTglSurat(toInputDate(data.TANGGAL_SURAT));
    setTglTerima(toInputDate(data.TANGGAL_TERIMA_SURAT));
    setFile(null);
  } else {
    setNama("");
    setJenis("");
    setTglSurat("");
    setTglTerima("");
    setFile(null);
  }
}, [open, data]);


  if (!open) return null;

  function toInputDate(val) {
  if (!val) return "";
  if (val.includes("-")) return val; // sudah yyyy-mm-dd
  const [d, m, y] = val.split("/");
  return `${y}-${m}-${d}`;
}


  async function handleSubmit(e) {
    e.preventDefault();
    const fileLama = data?.FILE_SURAT || "";

  // ✅ FIX UTAMA DI SINI
  if (!file && !fileLama) {
    alert("File PDF tidak ditemukan");
    return;
  }
    setSaving(true);

    const formData = new FormData();
    formData.append("action", data ? "update" : "create");
    if (data) formData.append("NO", data.NO);

    formData.append("NAMA_PELANGGAN", nama);
    formData.append("JENIS_TRANSAKSI", jenis);
    formData.append("TANGGAL_SURAT", tglSurat);
    formData.append("TANGGAL_TERIMA_SURAT", tglTerima);
    if (file) formData.append("FILE_SURAT", file);
    if (data?.FILE_SURAT) {
  formData.append("FILE_LAMA", data.FILE_SURAT);
}


    const res = await fetch("/api/tambah-surat", {
      method: "POST",
      body: formData
    });

    const json = await res.json();
    setSaving(false);

    if (json.status === "ok") {
      onSuccess();
      onClose();
    } else {
      alert(json.message || "Gagal menyimpan");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 500 }}>
        <h3>{data ? "Edit Surat Masuk" : "Tambah Surat Masuk"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Pelanggan</label>
            <input value={nama} onChange={e => setNama(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Jenis Transaksi</label>
            <select value={jenis} onChange={e => setJenis(e.target.value)} required>
              <option value="">Pilih</option>
              <option value="PB">PB</option>
              <option value="PD">PD</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tanggal Surat</label>
            <input type="date" value={tglSurat} onChange={e => setTglSurat(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Tanggal Terima Surat</label>
            <input type="date" value={tglTerima} onChange={e => setTglTerima(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>File Surat (PDF)</label>
            {data?.FILE_SURAT && (
              <small>
                File lama: <a href={data.FILE_SURAT} target="_blank">Download</a>
              </small>
            )}
            <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Batal</button>
            <button className="btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
