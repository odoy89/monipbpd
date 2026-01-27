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

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validasi: kalau create (data undefined) wajib upload file; kalau edit boleh pakai FILE_LAMA
    if (!file && !data?.FILE_SURAT) {
      alert("File PDF wajib diupload");
      return;
    }

    setSaving(true);

    try {
      let fileBase64 = "";
      let fileName = "";

      if (file) {
        fileBase64 = await fileToBase64(file);
        fileName = file.name;
      }

      const payload = {
        action: data ? "update" : "create",
        NO: data?.NO || "",
        NAMA_PELANGGAN: nama,
        JENIS_PELANGGAN: jenisPelanggan,
        JENIS_TRANSAKSI: jenis,
        TANGGAL_SURAT: tglSurat,
        TANGGAL_TERIMA_SURAT: tglTerima,
        FILE_BASE64: fileBase64,
        FILE_NAME: fileName,
        FILE_LAMA: data?.FILE_SURAT || ""
      };

      const res = await fetch("/api/tambah-surat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

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
      console.error("TAMBAH SURAT ERROR CLIENT:", err);
      alert("Gagal koneksi ke server / file upload pdf lebih dari 3MB ");
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

