import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, X, Search } from "lucide-react";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  last_purchase: string | null;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
}

type SortKey = "total_spent" | "last_purchase" | "total_orders" | "created_at";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [drawerCustomer, setDrawerCustomer] = useState<Customer | null>(null);
  const [drawerOrders, setDrawerOrders] = useState<Order[]>([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("vw_customers_enriched" as any).select("*");

    if (search.length >= 2) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const sortCol = sortBy === "last_purchase" ? "last_purchase" : sortBy;
    query = query.order(sortCol, { ascending: false, nullsFirst: false });

    const { data, error } = await query.limit(100);
    if (error) console.error(error);
    setCustomers((data as any[]) || []);
    setLoading(false);
  }, [search, sortBy]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  const openDrawer = async (customer: Customer) => {
    setDrawerCustomer(customer);
    setDrawerLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("id, order_number, amount, status, created_at, payment_method")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false });
    setDrawerOrders((data as Order[]) || []);
    setDrawerLoading(false);
  };

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "total_spent", label: "Total Spent ↓" },
    { key: "total_orders", label: "Total Orders ↓" },
    { key: "last_purchase", label: "Last Purchase ↓" },
    { key: "created_at", label: "Newest First" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "#F9F6F2" }}>Customers</h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9999B0" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "#1E1E2E", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "#1E1E2E", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
        >
          {sortOptions.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded animate-pulse" style={{ backgroundColor: "#1E1E2E" }} />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16">
          <Users size={48} className="mx-auto mb-4" style={{ color: "#9999B0" }} />
          <p style={{ color: "#9999B0" }}>No customers found</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}>
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "#2A2A3A" }}>
                <TableHead style={{ color: "#9999B0" }}>#</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Name</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Email</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Phone</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Orders</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Total Spent</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Last Purchase</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c, i) => (
                <TableRow
                  key={c.id}
                  style={{ borderColor: "#2A2A3A", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(30,30,46,0.5)" }}
                >
                  <TableCell style={{ color: "#9999B0" }}>{i + 1}</TableCell>
                  <TableCell style={{ color: "#F9F6F2" }} className="font-medium">{c.full_name}</TableCell>
                  <TableCell style={{ color: "#9999B0" }} className="text-xs">{c.email}</TableCell>
                  <TableCell style={{ color: "#9999B0" }} className="text-xs">{c.phone}</TableCell>
                  <TableCell style={{ color: "#F9F6F2" }}>{c.total_orders}</TableCell>
                  <TableCell style={{ color: "#C9A96E" }} className="font-medium">
                    ৳{Number(c.total_spent).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {c.last_purchase ? (
                      <span
                        title={format(parseISO(c.last_purchase), "dd MMM yyyy, HH:mm")}
                        style={{ color: "#9999B0" }}
                        className="text-xs cursor-help"
                      >
                        {formatDistanceToNow(parseISO(c.last_purchase), { addSuffix: true })}
                      </span>
                    ) : (
                      <span style={{ color: "#9999B0" }} className="text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => openDrawer(c)}
                      className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                      style={{ color: "#C9A96E" }}
                      title="View Orders"
                    >
                      <Eye size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Drawer */}
      {drawerCustomer && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setDrawerCustomer(null)} />
          <div
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md overflow-y-auto p-6"
            style={{ backgroundColor: "#16161F", borderLeft: "1px solid #2A2A3A" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: "#F9F6F2" }}>
                Orders — {drawerCustomer.full_name}
              </h2>
              <button onClick={() => setDrawerCustomer(null)} style={{ color: "#9999B0" }}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-xs" style={{ color: "#9999B0" }}>{drawerCustomer.email}</p>
              <p className="text-xs" style={{ color: "#9999B0" }}>{drawerCustomer.phone}</p>
            </div>
            {drawerLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded animate-pulse" style={{ backgroundColor: "#1E1E2E" }} />
                ))}
              </div>
            ) : drawerOrders.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "#9999B0" }}>No orders found</p>
            ) : (
              <div className="space-y-3">
                {drawerOrders.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-lg p-3 border"
                    style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs" style={{ color: "#C9A96E" }}>{o.order_number}</span>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs capitalize" style={{ color: "#9999B0" }}>{o.payment_method}</span>
                      <span className="text-sm font-medium" style={{ color: "#F9F6F2" }}>৳{o.amount}</span>
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: "#9999B0" }}>
                      {format(parseISO(o.created_at), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
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
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize" style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}
