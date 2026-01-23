import { useState, useMemo, useEffect } from "react";

export default function FilterBar({
  onFilter,
  data = [],
  total = 0,
  onTambah,
  onSearch,
  onDownload
}) {
  const [date, setDate] = useState("");
  const [ulp, setUlp] = useState("");
  const [status, setStatus] = useState("");
  const [jenisPelanggan, setJenisPelanggan] = useState("");
  const [search, setSearch] = useState("");

  const ulpOptions = useMemo(() => {
    return [...new Set(data.map(d => d.ULP).filter(Boolean))].sort();
  }, [data]);

  /* ===== KIRIM FILTER KE DASHBOARD ===== */
  useEffect(() => {
    const t = setTimeout(() => {
      onFilter({
        date: date || "",
        ulp: ulp || "",
        progres: status || "",
        jenisPelanggan: jenisPelanggan || "" 
      });
    }, 400);

    return () => clearTimeout(t);
  }, [date, ulp, status, jenisPelanggan, onFilter]);

  /* ===== SEARCH ===== */
  useEffect(() => {
    onSearch(search);
  }, [search]);

  function handleReset() {
    setDate("");
    setUlp("");
    setStatus("");
    setJenisPelanggan("");
    setSearch("");

    onFilter({});
    onSearch("");
  }

  return (
    <div className="filter-box">

      {/* ===== FILTER ===== */}
      <div className="filter-grid">
        <div>
          <label>Tanggal Surat</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>Unit / ULP</label>
          <select value={ulp} onChange={e => setUlp(e.target.value)}>
            <option value="">Semua</option>
            {ulpOptions.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
  <label>Jenis Pelanggan</label>
  <select
    value={jenisPelanggan}
    onChange={e => setJenisPelanggan(e.target.value)}
  >
    <option value="">-- pilih jenis pelanggan --</option>
    <option value="RETAIL">RETAIL</option>
    <option value="PERUMAHAN">PERUMAHAN</option>
    <option value="TM">TM</option>
  </select>
</div>


        <div>
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Semua</option>
            <option value="MENUNGGU">MENUNGGU</option>
            <option value="PROGRES">PROGRES</option>
            <option value="SELESAI">SELESAI</option>
          </select>
        </div>

        <button type="button" className="btn-ghost" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* ===== ACTION ===== */}
      <div className="filter-bottom">
        <div className="search-box">
          <input
            placeholder="Cari nama pelanggan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

              
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-success" onClick={onDownload}>
            Download Excel
          </button>

          <button className="btn-primary" onClick={onTambah}>
            Tambah Surat
          </button>
        </div>

   <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>
      Menampilkan <b>{total}</b> data
    </div>
  
      </div>

    </div>
  );
}






