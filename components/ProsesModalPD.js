import { useEffect, useState } from "react";

const ULP_LIST = [
  "17100","17110","17120","17130","17131","17150","17180"
];

export default function ProsesModalPD({ open, data, onClose, onSuccess }) {
  if (!open || !data) return null;

  /* ================= STATE ================= */
  const [kategori, setKategori] = useState("");
  const [ulp, setUlp] = useState("");

  const [suratBalasan, setSuratBalasan] = useState(false);
  const [fileBalasan, setFileBalasan] = useState(null);

  const [potensi, setPotensi] = useState("");
  const [rumah, setRumah] = useState("");

  const [tarifList, setTarifList] = useState({});
  const [tarifLama, setTarifLama] = useState("");
  const [dayaLama, setDayaLama] = useState("");

  const [deltaVA, setDeltaVA] = useState("");
  const [noReksis, setNoReksis] = useState("");

  const [survey, setSurvey] = useState(false);
  const [trafo, setTrafo] = useState("");
  const [jtm, setJtm] = useState("");
  const [jtr, setJtr] = useState("");

  const [nodin, setNodin] = useState(false);

  /* ================= LOAD TARIF DAYA ================= */
  useEffect(() => {
    if (!open) return;

    fetch("/api/tarif-daya")
      .then(r => r.json())
      .then(res => {
        // FORMAT WAJIB: { R1:["450","900"], B2:["6600"] }
        setTarifList(res || {});
      });
  }, [open]);

  /* ================= SUBMIT ================= */
  function handleSubmit() {
  if (!kategori || !ulp || !tarifLama || !dayaLama) {
    alert("Lengkapi data wajib");
    return;
  }

  fetch("/api/proses2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "saveProses2",
      NO: String(data.NO),

      KATEGORI: kategori,
      ULP: ulp,

      POTENSI_PELANGGAN: potensi,
      RUMAH_SELESAI_DIBANGUN: rumah,

      TARIF_LAMA: tarifLama,
      DAYA_LAMA: dayaLama,
      DELTA_VA: deltaVA,

      NO_SURAT_PENYAMPAIAN_REKSIS_KE_UP3: noReksis,

      SURVEY: survey,
      TRAFO: survey ? trafo : "",
      JTM: survey ? jtm : "",
      JTR: survey ? jtr : "",

      NODIN_KE_REN: nodin
    })
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === "ok") {
        onSuccess();
        onClose();
      } else {
        alert(res.message || "Gagal menyimpan PD");
      }
    })
    .catch(() => alert("Koneksi error"));
}

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <h3>Proses Tahap 2 (PD)</h3>

        {/* KATEGORI */}
        <div className="form-group">
          <label>Kategori (SUDAH BAYAR / BELUM BAYAR)</label>
          <select value={kategori} onChange={e => setKategori(e.target.value)}>
            <option value="">-- pilih --</option>
            <option value="SUDAH BAYAR">SUDAH BAYAR</option>
            <option value="BELUM BAYAR">BELUM BAYAR</option>
          </select>
        </div>

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

        {/* SURAT BALASAN */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={suratBalasan}
              onChange={e => setSuratBalasan(e.target.checked)}
            /> Ada Surat Balasan
          </label>

          {suratBalasan && (
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setFileBalasan(e.target.files[0])}
            />
          )}
        </div>

        {/* POTENSI */}
        <div className="form-group">
          <label>Potensi Pelanggan</label>
          <input value={potensi} onChange={e => setPotensi(e.target.value)} />
        </div>

        {/* RUMAH */}
        <div className="form-group">
          <label>Rumah Selesai Dibangun</label>
          <input value={rumah} onChange={e => setRumah(e.target.value)} />
        </div>

        {/* TARIF LAMA */}
        <div className="form-group">
          <label>Tarif Lama</label>
          <select
            value={tarifLama}
            onChange={e => {
              setTarifLama(e.target.value);
              setDayaLama("");
            }}
          >
            <option value="">-- pilih tarif --</option>
            {Object.keys(tarifList).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* DAYA LAMA */}
        <div className="form-group">
          <label>Daya Lama</label>
          <select
            value={dayaLama}
            disabled={!tarifLama}
            onChange={e => setDayaLama(e.target.value)}
          >
            <option value="">-- pilih tarif dulu --</option>
            {(tarifList[tarifLama] || []).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* DELTA */}
        <div className="form-group">
          <label>Delta VA</label>
          <input value={deltaVA} onChange={e => setDeltaVA(e.target.value)} />
        </div>

        {/* REKSIS */}
        <div className="form-group">
          <label>No Surat Penyampaian Reksis ke UP3</label>
          <input value={noReksis} onChange={e => setNoReksis(e.target.value)} />
        </div>

        {/* SURVEY */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={survey}
              onChange={e => setSurvey(e.target.checked)}
            /> SURVEY
          </label>
        </div>

        {survey && (
          <div className="form-grid-2">
            <div className="form-group">
              <label>TRAFO</label>
              <input value={trafo} onChange={e => setTrafo(e.target.value)} />
            </div>
            <div className="form-group">
              <label>JTM</label>
              <input value={jtm} onChange={e => setJtm(e.target.value)} />
            </div>
            <div className="form-group">
              <label>JTR</label>
              <input value={jtr} onChange={e => setJtr(e.target.value)} />
            </div>
          </div>
        )}

        {/* NODIN */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={nodin}
              onChange={e => setNodin(e.target.checked)}
            /> NODIN dikirim ke REN
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={handleSubmit}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

