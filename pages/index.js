import styles from "../styles/login.module.css";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      alert("Username dan password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.status === "success") {
  localStorage.clear(); // 🔥 BERSIHKAN DULU
  localStorage.setItem("LOGIN_OK", "1");
  localStorage.setItem("USER", JSON.stringify(data.user));
  window.location.href = "/dashboard";
      } else {
        alert(data.message || "Login gagal");
      }

    } catch (err) {
      setLoading(false);
      alert("Gagal koneksi ke server");
      console.error(err);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        <div className={styles.left}>
          <h1>Monitoring Proses Pekerjaan</h1>
          <p>
            Sistem monitoring dan pengelolaan data proses pekerjaan
            berbasis web untuk internal perusahaan.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.title}>Login Aplikasi</div>

          <input
            className={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </div>

      </div>
    </div>
  );
}
