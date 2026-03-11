import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  const { user, adminUser, loading } = useAdminAuth();
  const [sidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#16161F" }}>
        <div className="animate-pulse text-lg" style={{ color: "#C9A96E" }}>Loading...</div>
      </div>
    );
  }

  if (!user || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#16161F" }}>
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <AdminNavbar onMenuClick={() => setMobileOpen(true)} sidebarWidth={sidebarWidth} />

      <main
        className="pt-[60px] transition-all duration-300 hidden md:block"
        style={{ marginLeft: sidebarWidth }}
      />
      <div
        className="pt-[60px] min-h-screen transition-all duration-300"
        style={{ marginLeft: typeof window !== "undefined" && window.innerWidth >= 768 ? sidebarWidth : 0 }}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
