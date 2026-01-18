import { useEffect, useState } from "react";

const ULP_LIST = ["17100","17110","17120","17130","17131","17150","17180"];

export default function ProsesModal({ open, data, onClose, onSuccess }) {
  if (!open || !data) return null;

  const jenis = String(data.JENIS_TRANSAKSI || "").toUpperCase();
  const isPB = jenis === "PB";
  const isPD = jenis === "PD";

  const [saving, setSaving] = useState(false);

  const [kategori, setKategori] = useState("");
  const [ulp, setUlp] = useState("");

  const [adaSuratBalasan, setAdaSuratBalasan] = useState(false);
  const [fileBalasan, setFileBalasan] = useState(null);
  const [fileBalasanLama, setFileBalasanLama] = useState("");

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

  /* ===== LOAD TARIF ===== */
  useEffect(() => {
    if (!open) return;
    fetch("/api/tarif-daya")
      .then(r => r.json())
      .then(res => setTarifList(res || {}));
  }, [open]);

  /* ===== PREFILL ===== */
  useEffect(() => {
    if (!data) return;

    setKategori(data.KATEGORI || "");
    setUlp(data.ULP || "");

    setPotensi(data.POTENSI_PELANGGAN || "");
    setRumah(data.RUMAH_SELESAI_DIBANGUN || "");

    setAdaSuratBalasan(!!data.FILE_SURAT_BALASAN);
    setFileBalasanLama(data.FILE_SURAT_BALASAN || "");

    setTarifLama(data.TARIF_LAMA || "");
    setDayaLama(data.DAYA_LAMA || "");
    setTarifBaru(data.TARIF_BARU || "");
    setDayaBaru(data.DAYA_BARU || "");

    setDeltaVA(data.DELTA_VA || "");
    setNoReksis(data.NO_SURAT_PENYAMPAIAN_REKSIS_KE_UP3 || "");
    setTelepon(data.TELEPON_PELANGGAN || "");

    setSurvey(Boolean(data.SURVEY));
    setTrafo(data.TRAFO || "");
    setJtm(data.JTM || "");
    setJtr(data.JTR || "");

    setNodin(Boolean(data.NODIN_KE_REN));
  }, [data]);

  /* ===== SUBMIT ===== */
  function handleSubmit() {
    setSaving(true);

    const fd = new FormData();
    fd.append("action", "saveProses2");
    fd.append("NO", data.NO);

    fd.append("KATEGORI", kategori);
    fd.append("ULP", ulp);
    fd.append("POTENSI_PELANGGAN", potensi);
    fd.append("RUMAH_SELESAI_DIBANGUN", rumah);

    if (isPD) {
      fd.append("TARIF_LAMA", tarifLama);
      fd.append("DAYA_LAMA", dayaLama);
    }

    fd.append("TARIF_BARU", tarifBaru);
    fd.append("DAYA_BARU", dayaBaru);
    fd.append("DELTA_VA", deltaVA);

    fd.append("NO_SURAT_PENYAMPAIAN_REKSIS_KE_UP3", noReksis);
    fd.append("TELEPON_PELANGGAN", telepon);

    fd.append("SURVEY", survey ? "YA" : "TIDAK");
    fd.append("TRAFO", trafo);
    fd.append("JTM", jtm);
    fd.append("JTR", jtr);

    fd.append("NODIN_KE_REN", nodin ? "YA" : "TIDAK");

    if (adaSuratBalasan && fileBalasan) {
      fd.append("FILE_SURAT_BALASAN", fileBalasan);
    }

    fetch("/api/proses2", { method: "POST", body: fd })
      .then(r => r.json())
      .then(res => {
        setSaving(false);
        if (res.status === "ok") {
          onSuccess();
          onClose();
        } else {
          alert(res.message || "Gagal menyimpan");
        }
      })
      .catch(() => {
        setSaving(false);
        alert("Koneksi error");
      });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 560 }}>
        <h3>Proses Tahap 2 ({jenis})</h3>

        {/* === FORM === */}
        {/* (TAMPILAN SAMA seperti script awal kamu) */}

        {/* KATEGORI */}
        <div className="form-group">
          <label>Kategori</label>
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
            {ULP_LIST.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>

        {/* SURAT BALASAN */}
        <div className="form-group">
          <label>
            <input type="checkbox" checked={adaSuratBalasan}
              onChange={e => setAdaSuratBalasan(e.target.checked)} />
            Ada Surat Balasan
          </label>

          {adaSuratBalasan && (
            <>
              {fileBalasanLama && (
                <small>
                  File lama: <a href={fileBalasanLama} target="_blank">Download</a>
                </small>
              )}
              <input type="file" accept="application/pdf"
                onChange={e => setFileBalasan(e.target.files[0])} />
            </>
          )}
        </div>

        {/* POTENSI & RUMAH */}
        <div className="form-group">
          <label>Potensi Pelanggan</label>
          <input value={potensi} onChange={e => setPotensi(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Rumah Selesai Dibangun</label>
          <input value={rumah} onChange={e => setRumah(e.target.value)} />
        </div>

        {/* PD ONLY */}
        {isPD && (
          <>
            <div className="form-group">
              <label>Tarif Lama</label>
              <select value={tarifLama} onChange={e => setTarifLama(e.target.value)}>
                <option value="">-- pilih --</option>
                {Object.keys(tarifList).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Daya Lama</label>
              <select value={dayaLama} onChange={e => setDayaLama(e.target.value)}>
                <option value="">-- pilih --</option>
                {(tarifList[tarifLama] || []).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </>
        )}

        {/* BARU */}
        <div className="form-group">
          <label>Tarif Baru</label>
          <select value={tarifBaru} onChange={e => setTarifBaru(e.target.value)}>
            <option value="">-- pilih --</option>
            {Object.keys(tarifList).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Daya Baru</label>
          <select value={dayaBaru} onChange={e => setDayaBaru(e.target.value)}>
            <option value="">-- pilih --</option>
            {(tarifList[tarifBaru] || []).map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* SURVEY */}
        <div className="form-group">
          <label>
            <input type="checkbox" checked={survey}
              onChange={e => setSurvey(e.target.checked)} /> SURVEY
          </label>

          {survey && (
            <>
              <input placeholder="TRAFO" value={trafo} onChange={e => setTrafo(e.target.value)} />
              <input placeholder="JTM" value={jtm} onChange={e => setJtm(e.target.value)} />
              <input placeholder="JTR" value={jtr} onChange={e => setJtr(e.target.value)} />
            </>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={saving} onClick={handleSubmit}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
