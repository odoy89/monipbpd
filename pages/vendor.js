import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function VendorPage() {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [tlp, setTlp] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [popup, setPopup] = useState("");

  const [role, setRole] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("USER"));
    if (u) setRole(u.role);
    loadVendor();
  }, []);

  function showPopup(msg) {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2000);
  }

  function loadVendor() {
    fetch("/api/vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getVendorList" })
    })
      .then(r => r.json())
      .then(res => {
        setData(Array.isArray(res.vendors) ? res.vendors : []);
      });
  }

  function save() {
    if (!nama.trim()) {
      alert("Nama vendor wajib diisi");
      return;
    }

    fetch("/api/vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "saveVendor",
        NAMA_VENDOR: nama,
        NO_TLPN: tlp,
        ROW: editRow
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          showPopup(editRow ? "Vendor berhasil diupdate" : "Vendor berhasil ditambahkan");
          setNama("");
          setTlp("");
          setEditRow(null);
          loadVendor();
        } else {
          alert(res.message || "Gagal menyimpan vendor");
        }
      });
  }

  function hapus(row) {
    if (!confirm("Hapus vendor ini?")) return;

    fetch("/api/vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "deleteVendor",
        rowIndex: row
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          showPopup("Vendor berhasil dihapus");
          loadVendor();
        } else {
          alert(res.message || "Gagal hapus vendor");
        }
      });
  }

  return (
    <Layout>
      <h2>Vendor</h2>

      {/* ===== FORM INPUT ===== */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Nama Vendor"
          value={nama}
          onChange={e => setNama(e.target.value)}
          style={{ flex: 2 }}
        />

        <input
          placeholder="No Telepon"
          value={tlp}
          onChange={e => setTlp(e.target.value)}
          style={{ flex: 1 }}
        />

        <button className="btn-primary" onClick={save}>
          {editRow ? "Update" : "Tambah"}
        </button>

        {editRow && (
          <button
            className="btn-ghost"
            onClick={() => {
              setNama("");
              setTlp("");
              setEditRow(null);
            }}
          >
            Batal
          </button>
        )}
      </div>

      {/* ===== TABLE (SCROLL) ===== */}
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Vendor</th>
              <th>No Telpon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{d.NAMA_VENDOR}</td>
                <td>{d.NO_TLPN}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setNama(d.NAMA_VENDOR);
                        setTlp(d.NO_TLPN);
                        setEditRow(i + 2);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-hapus"
                      onClick={() => hapus(i + 2)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== POPUP ===== */}
      {popup && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 300, textAlign: "center" }}>
            <b>{popup}</b>
          </div>
        </div>
      )}
    </Layout>
  );
}
