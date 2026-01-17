import { useState, useEffect } from "react";

export default function TambahSuratModal({ open, data, onClose, onSuccess }) {
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [tglSurat, setTglSurat] = useState("");
  const [tglTerima, setTglTerima] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fileLama = data?.FILE_SURAT || "";

  /* ===== PREFILL ===== */
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
    if (val.includes("-")) return val;
    const [d, m, y] = val.split("/");
    return `${y}-${m}-${d}`;
  }

  /* ===== SUBMIT ===== */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!file && !fileLama) {
      alert("File PDF wajib diupload");
      return;
    }

    setSaving(true);

    let fileBase64 = "";
    let fileName = "";

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        fileBase64 = reader.result.split(",")[1];
        fileName = file.name;
        await kirimData(fileBase64, fileName);
      };
      reader.readAsDataURL(file);
    } else {
      await kirimData("", "");
    }
  }

  async function kirimData(fileBase64, fileName) {
    try {
      const payload = {
        action: data ? "update" : "create",
        NO: data?.NO || "",
        NAMA_PELANGGAN: nama,
        JENIS_TRANSAKSI: jenis,
        TANGGAL_SURAT: tglSurat,
        TANGGAL_TERIMA_SURAT: tglTerima,
        FILE_BASE64: fileBase64,
        FILE_NAME: fileName,
        FILE_LAMA: fileLama
      };

      const res = await fetch(
        process.env.APPSCRIPT_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
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
            {fileLama && (
              <small>
                File lama:{" "}
                <a href={fileLama} target="_blank" rel="noreferrer">
                  Download
                </a>
              </small>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button className="btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
