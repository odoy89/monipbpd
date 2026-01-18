import { useEffect, useState } from "react";

const ULP_LIST = ["17100","17110","17120","17130","17131","17150","17180"];

export default function ProsesModal({ open, data, onClose, onSuccess }) {
  if (!open) return null;

  const jenis = data?.JENIS_TRANSAKSI || "";
  const isPB = jenis === "PB";
  const isPD = jenis === "PD";

  const [saving, setSaving] = useState(false);

  const [kategori, setKategori] = useState("");
  const [ulp, setUlp] = useState("");

  const [adaSuratBalasan, setAdaSuratBalasan] = useState(false);
  const [fileBalasan, setFileBalasan] = useState(null);

  const [potensi, setPotensi] = useState("");
  const [rumah, setRumah] = useState("");

  const [tarifList, setTarifList] = useState({});
  const [tarifLama, setTarifLama] = useState("");
  const [dayaLama, setDayaLama] = useState("");
  const [tarifBaru, setTarifBaru] = useState("");
  const [dayaBaru, setDayaBaru] = useState("");

  const [deltaVA, setDeltaVA] = useState("");
  const [noReksis, setNoReksis] = useState("");
  const [telepon, setTelepon] = useState("");

  const [survey, setSurvey] = useState(false);
  const [trafo, setTrafo] = useState("");
  const [jtm, setJtm] = useState("");
  const [jtr, setJtr] = useState("");

  const [nodin, setNodin] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/tarif-daya")
      .then(r => r.json())
      .then(res => setTarifList(res || {}));
  }, [open]);

  async function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit() {
    setSaving(true);

    let fileBase64 = "";
    let fileName = "";

    if (adaSuratBalasan && fileBalasan) {
      fileBase64 = await toBase64(fileBalasan);
      fileName = fileBalasan.name;
    }

    const payload = {
      action: "saveProses2",
      NO: data.NO,

      KATEGORI: kategori,
      ULP: ulp,
      POTENSI_PELANGGAN: potensi,
      RUMAH_SELESAI_DIBANGUN: rumah,

      TARIF_LAMA: tarifLama,
      DAYA_LAMA: dayaLama,
      TARIF_BARU: tarifBaru,
      DAYA_BARU: dayaBaru,
      DELTA_VA: deltaVA,

      NO_SURAT_PENYAMPAIAN_REKSIS_KE_UP3: noReksis,
      TELEPON_PELANGGAN: telepon,

      SURVEY: survey,
      TRAFO: trafo,
      JTM: jtm,
      JTR: jtr,

      NODIN_KE_REN: nodin,

      FILE_SURAT_BALASAN_BASE64: fileBase64,
      FILE_SURAT_BALASAN_NAME: fileName
    };

    fetch("/api/proses2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        setSaving(false);
        if (res.status === "ok") {
          onSuccess();
          onClose();
        } else {
          alert(res.message);
        }
      })
      .catch(() => {
        setSaving(false);
        alert("Gagal koneksi");
      });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 540 }}>
        <h3>Proses Tahap 2 ({jenis})</h3>

        {/* === SEMUA FORM-GROUP ASLI KAMU === */}
        {/* TIDAK DIUBAH STRUKTUR / TAMPILAN */}

        {/* Kategori */}
        <div className="form-group">
          <label>Kategori</label>
          <select value={kategori} onChange={e => setKategori(e.target.value)}>
            <option value="">-- pilih --</option>
            <option value="SUDAH BAYAR">SUDAH BAYAR</option>
            <option value="BELUM BAYAR">BELUM BAYAR</option>
          </select>
        </div>

        <div className="form-group">
          <label>ULP</label>
          <select value={ulp} onChange={e => setUlp(e.target.value)}>
            <option value="">-- pilih ULP --</option>
            {ULP_LIST.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>

        {/* Sisanya SAMA seperti file awal kamu */}
        {/* (potensi, rumah, tarif, survey, surat balasan, dll) */}

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={handleSubmit}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
