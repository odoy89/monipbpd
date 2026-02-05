import { useState, useMemo, useEffect } from "react";

export default function FilterBar({
  onFilter,
  data = [],
  total = 0,
  onTambah,
  onSearch,
  onDownload
}) {
  const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");
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
      dateFrom: dateFrom || "",
      dateTo: dateTo || "",
      ulp: ulp || "",
      progres: status || "",
      jenisPelanggan: jenisPelanggan || ""
    });
  }, 400);

  return () => clearTimeout(t);
}, [dateFrom, dateTo, ulp, status, jenisPelanggan, onFilter]);


  /* ===== SEARCH ===== */
  useEffect(() => {
    onSearch(search);
  }, [search]);

  function handleReset() {
    setDateFrom("");
setDateTo("");
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
  <div style={{ display: "flex", gap: 6 }}>
    <input
      type="date"
      value={dateFrom}
      onChange={e => setDateFrom(e.target.value)}
    />
    <span style={{ alignSelf: "center" }}>s/d</span>
    <input
      type="date"
      value={dateTo}
      onChange={e => setDateTo(e.target.value)}
    />
  </div>
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

  <div className="filter-actions">
    <div className="filter-buttons">
      <button className="btn-success" onClick={onDownload}>
        Download Excel
      </button>

      <button className="btn-primary" onClick={onTambah}>
        Tambah Surat
      </button>
    </div>

    <div className="filter-total">
      Menampilkan <b>{total}</b> data
    </div>
  </div>
 </div>
 </div>
  );
}




