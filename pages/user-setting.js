import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function UserSetting() {
  const [users, setUsers] = useState([]);
  const [pwd, setPwd] = useState("");
  const [popup, setPopup] = useState("");
  const [role, setRole] = useState("");

  const [form, setForm] = useState({
    USERNAME: "",
    PASSWORD: "",
    ROLE: "USER",
    NAMA: "",
    PHONE: ""
  });

  const [editRow, setEditRow] = useState(null);

  /* ================= POPUP ================= */
  function showPopup(msg) {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2000);
  }

  /* ================= LOAD USER ================= */
  function loadUsers() {
    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getUserList" })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          setUsers(res.users);
        }
      });
  }

  useEffect(() => {
  const raw = localStorage.getItem("USER");
  if (!raw) return;

  try {
    const u = JSON.parse(raw);

    // 🔥 FIX ROLE AMAN
    const roleFix = (u.role || u.ROLE || u.SEBAGAI || u.LEVEL || "")
      .toString()
      .toUpperCase();

    setRole(roleFix);

  } catch (e) {
    console.error("USER parse error");
  }

  loadUsers();
}, []);


  /* ================= GANTI PASSWORD ================= */
  function changePwd() {
    if (!pwd.trim()) {
      alert("Password kosong");
      return;
    }

    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "changePassword",
        NEW_PASSWORD: pwd
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          setPwd("");
          showPopup("Password berhasil diubah");
        } else {
          alert(res.message);
        }
      });
  }

  /* ================= SIMPAN / UPDATE USER ================= */
  function saveUser() {
    if (!form.USERNAME.trim()) {
      alert("Username wajib diisi");
      return;
    }

    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "saveUser",
        ROW: editRow,
        ...form
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          showPopup(editRow ? "User berhasil diupdate" : "User berhasil ditambahkan");
          setForm({
            USERNAME: "",
            PASSWORD: "",
            ROLE: "USER",
            NAMA: "",
            PHONE: ""
          });
          setEditRow(null);
          loadUsers();
        } else {
          alert(res.message);
        }
      });
  }

  /* ================= HAPUS USER ================= */
  function hapusUser(row) {
    if (!confirm("Hapus user ini?")) return;

    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "deleteUser",
        ROW: row
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status === "ok") {
          showPopup("User berhasil dihapus");
          loadUsers();
        } else {
          alert(res.message);
        }
      });
  }

  return (
    <Layout>
      <h2>User Setting</h2>

      {/* ================= GANTI PASSWORD ================= */}
      <h4>Ganti Password</h4>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          type="password"
          placeholder="Password baru"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
        />
        <button className="btn-primary" onClick={changePwd}>
          Simpan
        </button>
      </div>

      {/* ================= ADMIN AREA ================= */}
      {role === "ADMIN" && (
        <>
          <hr />

          {/* ===== FORM TAMBAH / EDIT USER ===== */}
          <h4>{editRow ? "Edit User" : "Tambah User"}</h4>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 8,
    marginBottom: 16,
    alignItems: "end"
  }}
>
  {/* USERNAME */}
  <div>
    <label>Username</label>
    <input
      value={form.USERNAME}
      onChange={e =>
        setForm({ ...form, USERNAME: e.target.value })
      }
    />
  </div>

  {/* PASSWORD */}
  <div>
    <label>Password</label>
    <input
      type="password"
      placeholder={editRow ? "Kosongkan jika tidak diubah" : ""}
      value={form.PASSWORD}
      onChange={e =>
        setForm({ ...form, PASSWORD: e.target.value })
      }
    />
  </div>

  {/* NAMA */}
  <div>
    <label>Nama Lengkap</label>
    <input
      value={form.NAMA}
      onChange={e =>
        setForm({ ...form, NAMA: e.target.value })
      }
    />
  </div>

  {/* PHONE */}
  <div>
    <label>Phone</label>
    <input
      value={form.PHONE}
      onChange={e =>
        setForm({ ...form, PHONE: e.target.value })
      }
    />
  </div>

  {/* ROLE */}
  <div>
    <label>Role</label>
    <select
      value={form.ROLE}
      onChange={e =>
        setForm({ ...form, ROLE: e.target.value })
      }
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  </div>

  {/* BUTTON */}
  <div>
    <button className="btn-primary" onClick={saveUser}>
      {editRow ? "Update" : "Tambah"}
    </button>

    {editRow && (
      <button
        className="btn-ghost"
        style={{ marginLeft: 6 }}
        onClick={() => {
          setEditRow(null);
          setForm({
            USERNAME: "",
            PASSWORD: "",
            ROLE: "USER",
            NAMA: "",
            PHONE: ""
          });
        }}
      >
        Batal
      </button>
    )}
  </div>
</div>


          {/* ===== TABEL USER ===== */}
          <h4>Manajemen User (Admin)</h4>

          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Nama</th>
                <th>Phone</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.ROW}>
                  <td>{u.USERNAME}</td>
                  <td>{u.ROLE}</td>
                  <td>{u.NAMA}</td>
                  <td>{u.PHONE}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setForm({
                            USERNAME: u.USERNAME,
                            PASSWORD: "",
                            ROLE: u.ROLE,
                            NAMA: u.NAMA,
                            PHONE: u.PHONE
                          });
                          setEditRow(u.ROW);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-hapus"
                        onClick={() => hapusUser(u.ROW)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= POPUP ================= */}
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

