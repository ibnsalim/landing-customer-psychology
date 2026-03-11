import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingBag, Users, CreditCard,
  Mail, FileText, Settings, X
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Orders", icon: ShoppingBag, to: "/admin/orders" },
  { label: "Products", icon: Package, to: "/admin/products" },
  { label: "Customers", icon: Users, to: "/admin/customers" },
  { label: "Payments", icon: CreditCard, to: "/admin/payments" },
  { label: "Email", icon: Mail, to: "/admin/email" },
  { label: "Blog", icon: FileText, to: "/admin/blog" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({ collapsed, mobileOpen, onCloseMobile }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col border-r transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          width: collapsed ? 64 : 240,
          backgroundColor: "#13131A",
          borderColor: "#2A2A3A",
        }}
      >
        {/* Logo */}
        <div className="h-[60px] flex items-center justify-between px-4 border-b" style={{ borderColor: "#2A2A3A" }}>
          {!collapsed && (
            <span className="text-lg font-bold tracking-widest uppercase" style={{ color: "#C9A96E" }}>
              Zillbirds
            </span>
          )}
          {collapsed && (
            <span className="text-lg font-bold mx-auto" style={{ color: "#C9A96E" }}>Z</span>
          )}
          {mobileOpen && (
            <button onClick={onCloseMobile} className="md:hidden" style={{ color: "#9999B0" }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "" : "hover:text-[#F9F6F2]"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? "#C9A96E" : "#9999B0",
                backgroundColor: isActive ? "rgba(201,169,110,0.08)" : "transparent",
                borderLeft: isActive ? "4px solid #C9A96E" : "4px solid transparent",
              })}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
