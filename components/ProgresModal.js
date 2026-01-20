import { useState, useEffect } from "react";

export default function ProgressModal({ open, data, onClose, onSuccess }) {
  const [progres, setProgres] = useState("");
  const [eviden1, setEviden1] = useState(null);
  const [eviden2, setEviden2] = useState(null);
  const [tanggalNyala, setTanggalNyala] = useState("");
  const [loading, setLoading] = useState(false);
  const [eviden1Lama, setEviden1Lama] = useState("");
  const [eviden2Lama, setEviden2Lama] = useState("");

  /* ================= HELPER ================= */
  function toInputDate(val) {
    if (!val) return "";
    if (val.includes("-")) return val;
    const [d, m, y] = val.split("/");
    return `${y}-${m}-${d}`;
  }

  function fileToBase64(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
  }

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (!open || !data) return;

    setProgres(data.PROGRES_PEKERJAAN || "");
    setTanggalNyala(toInputDate(data.TANGGAL_NYALA));
    setEviden1Lama(data.EVIDEN_1 || "");
    setEviden2Lama(data.EVIDEN_2 || "");
  }, [open, data]);

  /* ================= SUBMIT ================= */
  async function handleSubmit() {
    if (!data?.NO) {
      alert("NO tidak ditemukan");
      return;
    }

    setLoading(true);

    const payload = {
      action: "saveProgres",
      NO: String(data.NO),
      PROGRES_PEKERJAAN: progres,
      TANGGAL_NYALA: tanggalNyala || ""
    };

    if (eviden1) {
      payload.EVIDEN_1_BASE64 = await fileToBase64(eviden1);
      payload.EVIDEN_1_NAME = eviden1.name;
    }

    if (eviden2) {
      payload.EVIDEN_2_BASE64 = await fileToBase64(eviden2);
      payload.EVIDEN_2_NAME = eviden2.name;
    }

    fetch("/api/progres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        setLoading(false);
        if (res.status === "success" || res.status === "ok") {
          onSuccess();
          onClose();
        } else {
          alert(res.message || "Gagal menyimpan progres");
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Koneksi error");
      });
  }

  /* ================= RENDER ================= */
  if (!open || !data) {
    // ❗ PENTING: JANGAN return null
    return <div style={{ display: "none" }} />;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <h3>Progres Pekerjaan</h3>

        <div className="form-group">
          <label>Progres Pekerjaan</label>
          <textarea
            rows="4"
            value={progres}
            onChange={e => setProgres(e.target.value)}
            placeholder="Tulis progres pekerjaan..."
          />
        </div>

        {eviden1Lama && (
          <div className="form-group">
            <small>Foto Eviden 1 (lama)</small>
            <img src={eviden1Lama} style={{ width: "100%" }} />
          </div>
        )}

        {eviden2Lama && (
          <div className="form-group">
            <small>Foto Eviden 2 (lama)</small>
            <img src={eviden2Lama} style={{ width: "100%" }} />
          </div>
        )}

        <div className="form-group">
          <label>Foto Eviden 1</label>
          <input type="file" onChange={e => setEviden1(e.target.files[0])} />
        </div>

        <div className="form-group">
          <label>Foto Eviden 2</label>
          <input type="file" onChange={e => setEviden2(e.target.files[0])} />
        </div>

        <div className="form-group">
          <label>Tanggal Nyala</label>
          <input
            type="date"
            value={tanggalNyala}
            onChange={e => setTanggalNyala(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Tutup</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
