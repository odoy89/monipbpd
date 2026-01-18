import { useEffect, useState } from "react";
import { toBase64 } from "../utils/files";

const ULP_LIST = ["17100","17110","17120","17130","17131","17150","17180"];

export default function ProsesModal({ open, data, onClose, onSuccess }) {
  if (!open || !data) return null;

  const jenis = data.JENIS_TRANSAKSI || "";

  const [saving, setSaving] = useState(false);

  const [kategori, setKategori] = useState("");
  const [ulp, setUlp] = useState("");

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

  const [adaBalasan, setAdaBalasan] = useState(false);
  const [fileBalasan, setFileBalasan] = useState(null);

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

  /* ===== SUBMIT FINAL ===== */
  async function handleSubmit() {
    setSaving(true);

    let fileBase64 = "";
    let fileName = "";

    if (adaBalasan && fileBalasan) {
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

      TARIF_LAMA: jenis === "PD" ? tarifLama : "",
      DAYA_LAMA: jenis === "PD" ? dayaLama : "",
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
          onSuccess("Proses berhasil disimpan");
          onClose();
        } else {
          alert(res.message);
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

        {/* KATEGORI */}
        <select value={kategori} onChange={e=>setKategori(e.target.value)}>
          <option value="">-- Kategori --</option>
          <option value="SUDAH BAYAR">SUDAH BAYAR</option>
          <option value="BELUM BAYAR">BELUM BAYAR</option>
        </select>

        {/* ULP */}
        <select value={ulp} onChange={e=>setUlp(e.target.value)}>
          <option value="">-- ULP --</option>
          {ULP_LIST.map(u=> <option key={u}>{u}</option>)}
        </select>

        {/* PD ONLY */}
        {jenis === "PD" && (
          <>
            <select value={tarifLama} onChange={e=>setTarifLama(e.target.value)}>
              <option value="">Tarif Lama</option>
              {Object.keys(tarifList).map(t=> <option key={t}>{t}</option>)}
            </select>

            <select value={dayaLama} onChange={e=>setDayaLama(e.target.value)}>
              <option value="">Daya Lama</option>
              {(tarifList[tarifLama] || []).map(d=> <option key={d}>{d}</option>)}
            </select>
          </>
        )}

        {/* BARU (PB + PD) */}
        <select value={tarifBaru} onChange={e=>setTarifBaru(e.target.value)}>
          <option value="">Tarif Baru</option>
          {Object.keys(tarifList).map(t=> <option key={t}>{t}</option>)}
        </select>

        <select value={dayaBaru} onChange={e=>setDayaBaru(e.target.value)}>
          <option value="">Daya Baru</option>
          {(tarifList[tarifBaru] || []).map(d=> <option key={d}>{d}</option>)}
        </select>

        {/* SURVEY */}
        <label>
          <input type="checkbox" checked={survey} onChange={e=>setSurvey(e.target.checked)} />
          Survey
        </label>

        {survey && (
          <>
            <input placeholder="TRAFO" value={trafo} onChange={e=>setTrafo(e.target.value)} />
            <input placeholder="JTM" value={jtm} onChange={e=>setJtm(e.target.value)} />
            <input placeholder="JTR" value={jtr} onChange={e=>setJtr(e.target.value)} />
          </>
        )}

        {/* FILE BALASAN */}
        <label>
          <input type="checkbox" checked={adaBalasan} onChange={e=>setAdaBalasan(e.target.checked)} />
          Ada Surat Balasan
        </label>

        {adaBalasan && (
          <input type="file" accept="application/pdf" onChange={e=>setFileBalasan(e.target.files[0])} />
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Batal</button>
          <button onClick={handleSubmit} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

