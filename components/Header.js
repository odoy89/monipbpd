import { useEffect, useState } from "react";

export default function Header() {
  const [now, setNow] = useState(new Date());
  const [user, setUser] = useState({
    fullname: "",
    username: ""
  });
const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("USER");
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setUser({
          fullname: parsed.fullname || "",
          username: parsed.username || ""
        });
      } catch (e) {
        console.error("USER parse error");
      }
    }

    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tgl = now.toLocaleDateString("id-ID");
  const jam = now.toLocaleTimeString("id-ID");

  function handleLogout() {
    if (!window.confirm("Yakin ingin logout?")) return;
    localStorage.clear();
    window.location.replace("/");
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-box">
          <img src="/pln.png" className="logo" />
          <div className="logo-text">UP3 TANJUNG KARANG</div>
        </div>
      </div>

      <div className="header-title">
        DASHBOARD MONITORING
      </div>

      <div className="header-user">
        <div className="datetime">
          <span>{tgl}</span> <span>{jam}</span>
        </div>

        <div className="user-row">
          <span>
            Halo,&nbsp;
            <b>
              {user.fullname !== ""
                ? user.fullname
                : user.username !== ""
                ? user.username
                : "User"}
            </b>
          </span>
<button className="logout" onClick={() => setConfirmLogout(true)}>
  Logout
</button>

        </div>
      </div>
      {confirmLogout && (
  <div className="modal-overlay">
    <div className="modal-card" style={{ maxWidth: 320, textAlign: "center" }}>
      <h3>Logout</h3>
      <p>Yakin ingin keluar?</p>

      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button
          className="btn-ghost"
          onClick={() => setConfirmLogout(false)}
        >
          Batal
        </button>

        <button
          className="btn-hapus"
          onClick={() => {
            localStorage.removeItem("LOGIN_OK");
            localStorage.removeItem("USER");
            window.location.replace("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}

    </header>
  );
}

