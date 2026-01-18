import { useEffect, useState } from "react";

const ULP_LIST = ["17100","17110","17120","17130","17131","17150","17180"];

export default function ProsesModal({ open, data, onClose, onSuccess }) {
  if (!open) return null;

  /* ================= UX STATE ================= */
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const jenis = data?.JENIS_TRANSAKSI || "";
  const isPB = jenis === "PB";
  const isPD = jenis === "PD";

  /* ================= FORM STATE ================= */
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
  const [nodin, setNodin] = useState(false);

  const [trafo, setTrafo] = useState("");
  const [jtm, setJtm] = useState("");
  const [jtr, setJtr] = useState("");

  /* ================= LOAD TARIF DAYA ================= */
  useEffect(() => {
    if (!open) return;
    fetch("/api/tarif-daya")
      .then(r => r.json())
      .then(res => setTarifList(res || {}));
  }, [open]);

  /* ================= PREFILL EDIT ================= */
  useEffect(() => {
    if (!open || !data) return;
    if (Object.keys(tarifList).length === 0) return;

    setKategori(data.KATEGORI || "");
    setUlp(data.ULP || "");

    setPotensi(data.POTENSI_PELANGGAN || "");
    setRumah(data.RUMAH_SELESAI_DIBANGUN || "");

    setAdaSuratBalasan(!!data.FILE_SURAT_BALASAN);
    setFileBalasan(null);
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
  }, [open, data, tarifList]);

  /* ================= SUBMIT ================= */
  async function handleSubmit() {
  if (!data?.NO) {
    alert("NO tidak ditemukan");
    return;
  }

  setSaving(true);
  setMsg("");

  let fileBase64 = "";
  let fileName = "";

  // === FILE SURAT BALASAN ===
  if (adaSuratBalasan && fileBalasan) {
    const reader = new FileReader();
    fileBase64 = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(fileBalasan);
    });
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
        onSuccess("Proses Tahap 2 berhasil disimpan");
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
    <>
      {/* ===== LOADING ===== */}
      {saving && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 300, textAlign: "center" }}>
            <b>Menyimpan data…</b>
            <p>Mohon tunggu</p>
          </div>
        </div>
      )}

      {/* ===== MESSAGE ===== */}
      {msg && !saving && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 320, textAlign: "center" }}>
            <b>{msg}</b>
            <br /><br />
            <button
              className="btn-primary"
              onClick={() => {
                setMsg("");
                onSuccess();
                onClose();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ===== FORM ===== */}
      {!saving && !msg && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 540 }}>
            <h3>Proses Tahap 2 ({jenis})</h3>

        {/* ===== KATEGORI ===== */}
        <div className="form-group">
          <label>Kategori</label>
          <select value={kategori} onChange={e => setKategori(e.target.value)}>
            <option value="">-- pilih --</option>
            <option value="SUDAH BAYAR">SUDAH BAYAR</option>
            <option value="BELUM BAYAR">BELUM BAYAR</option>
          </select>
        </div>

        {/* ===== ULP ===== */}
        <div className="form-group">
          <label>ULP</label>
          <select value={ulp} onChange={e => setUlp(e.target.value)}>
            <option value="">-- pilih ULP --</option>
            {ULP_LIST.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>

        {/* ===== SURAT BALASAN ===== */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={adaSuratBalasan}
              onChange={e => setAdaSuratBalasan(e.target.checked)}
            /> Ada Surat Balasan
          </label>

          {adaSuratBalasan && (
  <>
    {fileBalasanLama && (
      <small>
        File lama:{" "}
        <a href={fileBalasanLama} target="_blank">
          Download
        </a>
      </small>
    )}

    <input
      type="file"
      accept="application/pdf"
      onChange={e => setFileBalasan(e.target.files[0])}
    />
  </>
)}

        </div>

        {/* ===== POTENSI & RUMAH ===== */}
        <div className="form-group">
          <label>Potensi Pelanggan</label>
          <input value={potensi} onChange={e => setPotensi(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Rumah Selesai Dibangun</label>
          <input value={rumah} onChange={e => setRumah(e.target.value)} />
        </div>

        {/* ===== PD ONLY ===== */}
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

        {/* ===== BARU ===== */}
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

        <div className="form-group">
          <label>Delta VA</label>
          <input value={deltaVA} onChange={e => setDeltaVA(e.target.value)} />
        </div>

         {/* ===== SURVEY ===== */}
<div className="form-group">
  <label>
    <input
      type="checkbox"
      checked={survey}
      onChange={e => setSurvey(e.target.checked)}
    />{" "}
    SURVEY
  </label>

  {survey && (
    <div className="survey-row">
      <div className="survey-field">
        <label>TRAFO</label>
        <input value={trafo} onChange={e => setTrafo(e.target.value)} />
      </div>

      <div className="survey-field">
        <label>JTM</label>
        <input value={jtm} onChange={e => setJtm(e.target.value)} />
      </div>

      <div className="survey-field">
        <label>JTR</label>
        <input value={jtr} onChange={e => setJtr(e.target.value)} />
      </div>
    </div>
  )}
</div>

        <div className="form-group">
          <label>No Surat Penyampaian Reksis ke UP3</label>
          <input value={noReksis} onChange={e => setNoReksis(e.target.value)} />
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" checked={nodin} onChange={e => setNodin(e.target.checked)} /> NODIN dikirim ke REN
          </label>
        </div>

           {/* =====notelpon ===== */}
          <div className="form-group">
          <label>Nomor Telepon Pelanggan</label>
          <input value={telepon} onChange={e => setTelepon(e.target.value)}
            placeholder="08xxxxxxxxxx"/>
          </div>
<div className="modal-actions">
              <button className="btn-ghost" onClick={onClose}>Batal</button>
              <button className="btn-primary" onClick={handleSubmit}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

