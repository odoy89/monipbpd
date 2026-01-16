import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ok = localStorage.getItem("LOGIN_OK");
    if (!ok) {
      window.location.replace("/");
      return;
    }
    setReady(true);
  }, []);

  if (!ready) return null; // ⛔ JANGAN render apa pun dulu

  return (
    <div className="layout">
      <Header />
      <div className="main">
        <Sidebar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
