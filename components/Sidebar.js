import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  const isActive = (path) =>
    router.pathname === path ? "menu active" : "menu";

  return (
    <aside className="sidebar">
      <div className={isActive("/dashboard")} onClick={() => router.push("/dashboard")}>
        📊 Dashboard
      </div>

      <div className={isActive("/vendor")} onClick={() => router.push("/vendor")}>
        🏢 Vendor
      </div>

    <div className={isActive("/tarif-daya")} onClick={() => router.push("/tarif-daya")}>
  ⚡ Tarif Daya
</div>
          
      <div className={isActive("/user-setting")} onClick={() => router.push("/user-setting")}>
        👤 User Setting
      </div>
    </aside>
  );
}

