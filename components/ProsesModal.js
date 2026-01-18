import { useEffect, useState } from "react";

const ULP_LIST = ["17100","17110","17120","17130","17131","17150","17180"];

export default function ProsesModal({ open, data, onClose, onSuccess }) {
  if (!open || !data) return null;

  const isPD = String(data.JENIS_TRANSAKSI || "").toUpperCase() === "PD";

  const [kategori, setKategori] = useState("");
  const [ulp, setUlp] = useState("");

  const [suratBalasan, setSuratBalasan] = useState(false);
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

  const [survey, setSurvey] = useState(false);
  const [trafo, setTrafo] = useState("");
  const [jtm, setJtm] = useState("");
  const [jtr, setJtr] = useState("");

  const [nodin, setNodin] = useState(false);

  useEffect(() => {
    fetch("/api/tarif-daya")
      .then(r => r.json())
      .then(res => setTarifList(res || {}));
  }, []);

  function handleSubmit() {
    if (!kategori || !ulp || !tarifBaru) {
      alert("Kategori, ULP, dan Tarif Baru wajib diisi");
      return;
    }

    const payload = {
      action: "saveProses2",
      NO: String(data.NO),

      KATEGORI: kategori,
      ULP: ulp,

      POTENSI_PELANGGAN: potensi,
      RUMAH_SELESAI_DIBANGUN: rumah,

      TARIF_LAMA: isPD ? tarifLama : "",
      DAYA_LAMA: isPD ? dayaLama : "",
      TARIF_BARU: tarifBaru,
      DAYA_BARU: dayaBaru,

      DELTA_VA: deltaVA,
      NO_SURAT_PENYAMPAIAN_REKSIS_KE_UP3: noReksis,

      SURVEY: survey,
      TRAFO: survey ? trafo : "",
      JTM: survey ? jtm : "",
      JTR: survey ? jtr : "",

      NODIN_KE_REN: nodin
    };

    if (suratBalasan && fileBalasan) {
      const reader = new FileReader();
      reader.onload = () => {
        payload.FILE_SURAT_BALASAN_BASE64 = reader.result.split(",")[1];
        payload.FILE_SURAT_BALASAN_NAME = fileBalasan.name;
        submit(payload);
      };
      reader.readAsDataURL(fileBalasan);
    } else {
      submit(payload);
    }
  }

  function submit(payload) {
    fetch("/api/proses2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          onSuccess();
          onClose();
        } else {
          alert(res.message || "Gagal simpan");
        }
      })
      .catch(() => alert("Koneksi error"));
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <h3>Proses Tahap 2 ({data.JENIS_TRANSAKSI})</h3>

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

        {/* ===== KHUSUS PD ===== */}
        {isPD && (
          <>
            <label>
              <input type="checkbox"
                checked={suratBalasan}
                onChange={e => setSuratBalasan(e.target.checked)}
              /> Ada Surat Balasan
            </label>

            {suratBalasan && (
              <input type="file" accept="application/pdf"
                onChange={e => setFileBalasan(e.target.files[0])}
              />
            )}

            <input placeholder="Potensi Pelanggan" value={potensi} onChange={e => setPotensi(e.target.value)} />
            <input placeholder="Rumah Selesai Dibangun" value={rumah} onChange={e => setRumah(e.target.value)} />

            <select value={tarifLama} onChange={e => setTarifLama(e.target.value)}>
              <option value="">Tarif Lama</option>
              {Object.keys(tarifList).map(t => <option key={t}>{t}</option>)}
            </select>

            <select value={dayaLama} onChange={e => setDayaLama(e.target.value)}>
              {(tarifList[tarifLama] || []).map(d => <option key={d}>{d}</option>)}
            </select>

            <label>
              <input type="checkbox"
                checked={survey}
                onChange={e => setSurvey(e.target.checked)}
              /> SURVEY
            </label>

            {survey && (
              <>
                <input placeholder="TRAFO" value={trafo} onChange={e => setTrafo(e.target.value)} />
                <input placeholder="JTM" value={jtm} onChange={e => setJtm(e.target.value)} />
                <input placeholder="JTR" value={jtr} onChange={e => setJtr(e.target.value)} />
              </>
            )}

            <label>
              <input type="checkbox"
                checked={nodin}
                onChange={e => setNodin(e.target.checked)}
              /> NODIN ke REN
            </label>
          </>
        )}

        {/* TARIF BARU (PB & PD) */}
        <select value={tarifBaru} onChange={e => setTarifBaru(e.target.value)}>
          <option value="">Tarif Baru</option>
          {Object.keys(tarifList).map(t => <option key={t}>{t}</option>)}
        </select>

        <select value={dayaBaru} onChange={e => setDayaBaru(e.target.value)}>
          {(tarifList[tarifBaru] || []).map(d => <option key={d}>{d}</option>)}
        </select>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={handleSubmit}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
