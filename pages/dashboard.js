import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import StatBox from "../components/StatBox";
import FilterBar from "../components/FilterBar";
import DataTable from "../components/DataTable";

import TambahSuratModal from "../components/TambahSuratModal";
import ProsesModal from "../components/ProsesModal";

import VendorModal from "../components/VendorModal";
import ProgressModal from "../components/ProgresModal";
import EditChooserModal from "../components/EditChooserModal";
import DetailModal from "../components/DetailModal";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState(null);

  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openProses, setOpenProses] = useState(false);
  const [openVendor, setOpenVendor] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const [openEditChooser, setOpenEditChooser] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [activeFilter, setActiveFilter] = useState({});
  
  const [downloading, setDownloading] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);
const [role, setRole] = useState("");

useEffect(() => {
  const raw = localStorage.getItem("USER");
  if (!raw) return;

  try {
    const u = JSON.parse(raw);
    console.log("USER DASHBOARD:", u); // DEBUG
    setRole(u.role || "");
  } catch (e) {
    console.error("USER parse error");
  }
}, []);



  console.log("ROLE DI DATATABLE:", role);

  /* ================= LOAD DATA (INI FIX UTAMA) ================= */
function loadData(filter = {}) {
  setActiveFilter(filter); // 🔥 SIMPAN FILTER AKTIF

  fetch("/api/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "dashboard",
      filters: filter
    })
  })
    .then(r => r.json())
    .then(res => {
      setData(Array.isArray(res.data) ? res.data : []);
    });
}

function normalizeDate(val) {
  if (!val) return "";
  if (val instanceof Date) return val.toISOString().slice(0, 10);

  // format dd/mm/yyyy
  if (val.includes("/")) {
    const [d, m, y] = val.split("/");
    return `${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`;
  }

  return val;
}

  
  /* ================= SEARCH ================= */
 const filteredData = useMemo(() => {
  return data.filter(d => {

    // 🔍 NAMA
    if (
      search &&
      !String(d.NAMA_PELANGGAN || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    ) return false;

    // 📌 STATUS
    if (activeFilter.progres && d.STATUS !== activeFilter.progres)
      return false;

    // 🏢 ULP / UNIT
    if (
      activeFilter.ulp &&
      String(d.ULP || "").trim() !== String(activeFilter.ulp).trim()
    ) return false;

// 🧾 JENIS PELANGGAN
if (
  activeFilter.jenisPelanggan &&
  String(d.JENIS_PELANGGAN || "").trim() !==
    String(activeFilter.jenisPelanggan).trim()
) return false;

    
    // 📅 TANGGAL SURAT
    if (activeFilter.date) {
      const rowDate = normalizeDate(d.TANGGAL_SURAT);
      const filterDate = activeFilter.date;
      if (rowDate !== filterDate) return false;
    }

    return true;
  });
}, [data, search, activeFilter]);



  /* ================= SUMMARY ================= */
  const summary = useMemo(() => ({
    menunggu: data.filter(d => d.STATUS === "MENUNGGU").length,
    progres: data.filter(d => d.STATUS === "PROGRES").length,
    selesai: data.filter(d => d.STATUS === "SELESAI").length
  }), [data]);

  function showPopup(msg) {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2000);
  }

  /* ================= DELETE ================= */
 function handleDelete(row) {
  if (!row?.NO) {
    alert("NO data tidak ditemukan");
    return;
  }

  if (!window.confirm(`Hapus data ${row.NAMA_PELANGGAN}?`)) return;

  fetch("/api/hapus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "delete",
      NO: row.NO
    })
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === "ok") {
        loadData();
        showPopup("Data berhasil dihapus");
      } else {
        alert(res.message || "Gagal menghapus");
      }
    })
    .catch(() => alert("Koneksi error"));
}

async function handleDownloadExcel() {
  try {
    setDownloading(true);

    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: activeFilter
      })
    });

    const json = await res.json();

    if (!json.url) throw new Error("URL export tidak ada");

    // 🔥 DOWNLOAD XLSX ASLI
    window.location.href = json.url;

  } catch (e) {
    alert("Gagal download Excel");
  } finally {
    setDownloading(false);
  }
}

function handleDetail(row) {
  fetch("/api/detail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ NO: row.NO })
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === "ok") {
        setSelectedRow(res);
        setOpenDetail(true);
      } else {
        alert(res.message);
      }
    });
}
const jenisTransaksi = String(selectedRow?.JENIS_TRANSAKSI || "")
  .trim()
  .toUpperCase();

  return (
    <Layout>

      {downloading && (
  <div className="modal-overlay">
    <div className="modal-card" style={{ maxWidth: 300, textAlign: "center" }}>
      <b>Menyiapkan file Excel…</b>
      <p style={{ marginTop: 10 }}>Mohon tunggu</p>
    </div>
  </div>
)}


      {/* ===== POPUP TENGAH ===== */}
      {popup && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 300, textAlign: "center" }}>
            <b>{popup}</b>
            <br /><br />
            <button className="btn-primary" onClick={() => setPopup("")}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* ===== STAT ===== */}
      <div className="stat-grid">
        <StatBox title="MENUNGGU" value={summary.menunggu} color="#dc2626" />
        <StatBox title="PROGRES" value={summary.progres} color="#f59e0b" />
        <StatBox title="SELESAI" value={summary.selesai} color="#16a34a" />
      </div>

      {/* ===== FILTER ===== */}
      <FilterBar
        data={data}
        onFilter={loadData}
        onSearch={setSearch}
        onTambah={() => {
          setEditData(null);
          setOpenTambah(true);
        }}
        onDownload={handleDownloadExcel}
      />

      {/* ===== TABLE ===== */}
      <DataTable
  data={filteredData}
  onDetail={(row) => {
    setDetailData(row);
    setOpenDetail(true);
  }}
  onEdit={(row) => {
    setSelectedRow(row);
    setEditData(row);
    setOpenEditChooser(true);
  }}
  onDelete={handleDelete}
  onProses={(row) => {
    setSelectedRow(row);
    setOpenProses(true);
  }}
  onProgress={(row) => {
    fetch("/api/detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ NO: row.NO })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          setSelectedRow(res);
          setOpenProgress(true);
        } else {
          alert(res.message || "Gagal ambil detail progres");
        }
      });
  }}
  onVendor={(row) => {
    setSelectedRow(row);
    setOpenVendor(true);
  }}
  onFoto={(row) => {
    setPreviewFoto(row);
  }}
  role={role}
/>

      {/* ===== TAMBAH SURAT ===== */}
      <TambahSuratModal
        open={openTambah}
        data={null}
        onClose={() => setOpenTambah(false)}
        onSuccess={() => {
          loadData();
          showPopup("Data berhasil ditambahkan");
        }}
      />

        

      {/* ===== EDIT SURAT ===== */}
      <TambahSuratModal
        open={openEdit}
        data={editData}
        onClose={() => {
          setOpenEdit(false);
          setEditData(null);
        }}
        onSuccess={() => {
          loadData();
          showPopup("Data berhasil diupdate");
        }}
      />

   {openProses && (
  <ProsesModal
    open={openProses}
    data={selectedRow}
    onClose={() => setOpenProses(false)}
    onSuccess={() => {
      loadData();
      showPopup("Proses berhasil disimpan");
    }}
  />
)}

      {/* ===== VENDOR ===== */}
      <VendorModal
        open={openVendor}
        data={selectedRow}
        onClose={() => setOpenVendor(false)}
        onSuccess={() => {
          loadData();
          showPopup("Vendor tersimpan");
        }}
      />

      {/* ===== PROGRES ===== */}
      <ProgressModal
        open={openProgress}
        data={selectedRow}
        onClose={() => setOpenProgress(false)}
        onSuccess={() => {
          loadData();
          showPopup("Progres tersimpan");
        }}
      />

        {/* ===== DETAIL ===== */}
<DetailModal
  open={openDetail}
  data={detailData}
  onClose={() => {
    setOpenDetail(false);
    setDetailData(null);
  }}
/>


      {/* ===== PILIH JENIS EDIT ===== */}
      <EditChooserModal
        open={openEditChooser}
        onClose={() => setOpenEditChooser(false)}
        onPick={(type) => {
          setOpenEditChooser(false);
          if (type === "SURAT") setOpenEdit(true);
          if (type === "PROSES2") setOpenProses(true);
          if (type === "VENDOR") setOpenVendor(true);
          if (type === "PROGRES") setOpenProgress(true);
        }}
      />
{previewFoto && console.log("PREVIEW FOTO:", previewFoto)}

{previewFoto && (
  <div className="modal-overlay">
    <div className="modal-card" style={{ maxWidth: 600 }}>
      <h3>Foto Eviden</h3>

      {previewFoto.EVIDEN_1 && (
        <img
          src={previewFoto.EVIDEN_1}
          style={{ width: "100%", marginBottom: 10 }}
        />
      )}

      {previewFoto.EVIDEN_2 && (
        <img
          src={previewFoto.EVIDEN_2}
          style={{ width: "100%" }}
        />
      )}

      <div className="modal-actions">
        <button className="btn-primary" onClick={() => setPreviewFoto(null)}>
          Tutup
        </button>
      </div>
    </div>
  </div>
)}

    </Layout>
  );
  
}












