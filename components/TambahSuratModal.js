import { useEffect, useState } from "react";

export default function TambahSuratModal({ open, data, onClose, onSuccess }) {
  const [nama, setNama] = useState("");
  const [jenisPelanggan, setJenisPelanggan] = useState("");
  const [jenis, setJenis] = useState("");
  const [tglSurat, setTglSurat] = useState("");
  const [tglTerima, setTglTerima] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  

  useEffect(() => {
    if (!open) return;

    if (data) {
      setNama(data.NAMA_PELANGGAN || "");
      setJenisPelanggan(data.JENIS_PELANGGAN || "");
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
    if (val.includes("-")) return val;
    const [d, m, y] = val.split("/");
    return `${y}-${m}-${d}`;
  }


  async function handleSubmit(e) {
  e.preventDefault();

  if (!file && !data?.FILE_SURAT) {
    alert("File PDF wajib diupload");
    return;
  }

  setSaving(true);

  try {
    const fd = new FormData();
    fd.append("action", data ? "update" : "create");
    fd.append("NO", data?.NO || "");
    fd.append("NAMA_PELANGGAN", nama);
    fd.append("JENIS_PELANGGAN", jenisPelanggan);
    fd.append("JENIS_TRANSAKSI", jenis);
    fd.append("TANGGAL_SURAT", tglSurat);
    fd.append("TANGGAL_TERIMA_SURAT", tglTerima);

    if (file) fd.append("FILE_SURAT", file);
    if (data?.FILE_SURAT) fd.append("FILE_LAMA", data.FILE_SURAT);

    const res = await fetch(
  "https://script.google.com/macros/s/AKfycbzShG42uSeTZbQkW3VW8vdbB247NnRIlB381UdY_S-Xdq7eAowOb8pc_8RfifHX-QdOfg/exec",
  {
    method: "POST",
    body: fd
  }
);


    const json = await res.json();
    setSaving(false);

    if (json.status === "ok") {
      onSuccess();
      onClose();
    } else {
      alert(json.message || "Gagal menyimpan");
    }
  } catch (err) {
    setSaving(false);
    alert("Gagal koneksi ke server");
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
  <label>Jenis Pelanggan</label>
  <select
    value={jenisPelanggan}
    onChange={e => setJenisPelanggan(e.target.value)}
  >
    <option value="">Semua Jenis Pelanggan</option>
    <option value="RETAIL">RETAIL</option>
    <option value="PERUMAHAN">PERUMAHAN</option>
    <option value="TM">TM</option>
  </select>
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
                File lama:{" "}
                <a href={data.FILE_SURAT} target="_blank" rel="noreferrer">Download</a>
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


