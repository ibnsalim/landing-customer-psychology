import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, LogOut, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Props {
  onMenuClick: () => void;
  sidebarWidth: number;
}

export default function AdminNavbar({ onMenuClick, sidebarWidth }: Props) {
  const { adminUser, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch pending count
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending")
      .then(({ count }) => setPendingCount(count || 0));

    // Realtime subscription for new orders
    const channel = supabase
      .channel("admin-new-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => {
        setPendingCount((c) => c + 1);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (search.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const q = `%${search}%`;
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, full_name, status")
        .or(`full_name.ilike.${q},email.ilike.${q},phone.ilike.${q},transaction_id.ilike.${q}`)
        .limit(8);
      setSearchResults(data || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const initials = adminUser?.full_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "AD";

  return (
    <header
      className="fixed top-0 right-0 z-30 h-[60px] flex items-center justify-between px-4 border-b"
      style={{
        left: sidebarWidth,
        backgroundColor: "#13131A",
        borderColor: "#2A2A3A",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden" style={{ color: "#9999B0" }}>
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9999B0" }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search orders, customers, TXN ID..."
            className="pl-9 pr-4 py-2 rounded-lg text-sm outline-none w-72"
            style={{ backgroundColor: "#16161F", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
          />
          {showDropdown && searchResults.length > 0 && (
            <div
              className="absolute top-full left-0 mt-1 w-full rounded-lg border shadow-xl overflow-hidden"
              style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}
            >
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#16161F] transition-colors"
                  onMouseDown={() => navigate(`/admin/orders?highlight=${r.id}`)}
                >
                  <span>
                    <span className="font-mono text-xs" style={{ color: "#C9A96E" }}>{r.order_number}</span>
                    <span className="ml-2" style={{ color: "#F9F6F2" }}>{r.full_name}</span>
                  </span>
                  <StatusBadge status={r.status} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="relative p-2 rounded-lg hover:bg-[#1E1E2E] transition-colors">
          <Bell size={20} style={{ color: "#9999B0" }} />
          {pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "#F5A623", color: "#16161F" }}>
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          )}
        </button>

        {/* Avatar & Logout */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: "rgba(201,169,110,0.15)", color: "#C9A96E" }}
          >
            {initials}
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-[#1E1E2E] transition-colors" title="Logout">
            <LogOut size={18} style={{ color: "#9999B0" }} />
          </button>
        </div>
      </div>
    </header>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(245,166,35,0.15)", text: "#F5A623" },
    confirmed: { bg: "rgba(46,204,113,0.15)", text: "#2ECC71" },
    cancelled: { bg: "rgba(231,76,60,0.15)", text: "#E74C3C" },
    refunded: { bg: "rgba(153,153,176,0.15)", text: "#9999B0" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}
