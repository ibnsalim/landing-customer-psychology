import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Search, Download, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string;
  order_id: string;
  customer_id: string;
  method: string;
  transaction_id: string;
  amount: number;
  status: string;
  created_at: string;
  // joined
  order_number?: string;
  customer_name?: string;
  customer_phone?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    // Fetch payments with related order & customer info
    let query = supabase
      .from("payments")
      .select("*, orders!payments_order_id_fkey(order_number, full_name, phone)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (methodFilter !== "all") query = query.eq("method", methodFilter);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);

    const { data, error } = await query;
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((p: any) => ({
      ...p,
      order_number: p.orders?.order_number || "—",
      customer_name: p.orders?.full_name || "—",
      customer_phone: p.orders?.phone || "—",
    }));

    // Client-side search
    const filtered = search.length >= 2
      ? mapped.filter((p: any) =>
          p.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
          p.order_number.toLowerCase().includes(search.toLowerCase()) ||
          p.customer_name.toLowerCase().includes(search.toLowerCase())
        )
      : mapped;

    setPayments(filtered);
    setLoading(false);
  }, [search, methodFilter, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchPayments, 300);
    return () => clearTimeout(t);
  }, [fetchPayments]);

  // Detect duplicate TXN IDs
  const txnCounts = payments.reduce<Record<string, number>>((acc, p) => {
    acc[p.transaction_id] = (acc[p.transaction_id] || 0) + 1;
    return acc;
  }, {});

  const handleRefund = async () => {
    if (!refundingId) return;
    const payment = payments.find((p) => p.id === refundingId);
    if (!payment) return;

    const { error } = await supabase
      .from("payments")
      .update({ status: "refunded" })
      .eq("id", refundingId);

    if (error) {
      toast.error("Refund failed");
      return;
    }

    // Also update order status
    await supabase.from("orders").update({ status: "refunded" }).eq("id", payment.order_id);

    toast.success("Payment marked as refunded");
    setRefundingId(null);
    setRefundReason("");
    fetchPayments();
  };

  const exportCSV = () => {
    const header = "Order #,Customer,Phone,Method,TXN ID,Amount,Status,Date";
    const rows = payments.map((p) =>
      [p.order_number, p.customer_name, p.customer_phone, p.method, p.transaction_id, p.amount, p.status, format(parseISO(p.created_at), "yyyy-MM-dd HH:mm")].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const resetFilters = () => {
    setSearch("");
    setMethodFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "#F9F6F2" }}>Payments</h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9999B0" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search TXN ID, customer, order #..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "#1E1E2E", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
          />
        </div>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "#1E1E2E", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
        >
          <option value="all">All Methods</option>
          <option value="bkash">Bkash</option>
          <option value="nagad">Nagad</option>
          <option value="rocket">Rocket</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "#1E1E2E", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <button onClick={resetFilters} className="text-xs underline" style={{ color: "#9999B0" }}>
          Reset
        </button>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "#2A2A3A", color: "#9999B0" }}
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded animate-pulse" style={{ backgroundColor: "#1E1E2E" }} />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-16">
          <CreditCard size={48} className="mx-auto mb-4" style={{ color: "#9999B0" }} />
          <p style={{ color: "#9999B0" }}>No payments found</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}>
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "#2A2A3A" }}>
                <TableHead style={{ color: "#9999B0" }}>Order #</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Customer</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Phone</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Method</TableHead>
                <TableHead style={{ color: "#9999B0" }}>TXN ID</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Amount</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Status</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Date</TableHead>
                <TableHead style={{ color: "#9999B0" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p, i) => (
                <TableRow
                  key={p.id}
                  style={{ borderColor: "#2A2A3A", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(30,30,46,0.5)" }}
                >
                  <TableCell className="font-mono text-xs" style={{ color: "#C9A96E" }}>{p.order_number}</TableCell>
                  <TableCell style={{ color: "#F9F6F2" }} className="text-sm">{p.customer_name}</TableCell>
                  <TableCell style={{ color: "#9999B0" }} className="text-xs">{p.customer_phone}</TableCell>
                  <TableCell><MethodBadge method={p.method} /></TableCell>
                  <TableCell className="text-xs font-mono" style={{ color: "#F9F6F2" }}>
                    <span className="flex items-center gap-1">
                      {p.transaction_id}
                      {txnCounts[p.transaction_id] > 1 && (
                        <span title="Duplicate Transaction ID">
                          <AlertTriangle size={14} style={{ color: "#E74C3C" }} />
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell style={{ color: "#F9F6F2" }} className="font-medium">৳{p.amount}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell style={{ color: "#9999B0" }} className="text-xs">
                    {format(parseISO(p.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {p.status !== "refunded" && (
                      <button
                        onClick={() => setRefundingId(p.id)}
                        className="text-[10px] px-2 py-1 rounded font-medium"
                        style={{ backgroundColor: "rgba(231,76,60,0.12)", color: "#E74C3C" }}
                      >
                        Refund
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Refund Modal */}
      {refundingId && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setRefundingId(null)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm rounded-xl p-6"
            style={{ backgroundColor: "#1E1E2E", border: "1px solid #2A2A3A" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#F9F6F2" }}>Mark as Refunded</h3>
            <label className="block text-xs mb-1.5" style={{ color: "#9999B0" }}>Reason (optional)</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none mb-4"
              style={{ backgroundColor: "#16161F", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
            />
            <div className="flex gap-3">
              <button
                onClick={handleRefund}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#E74C3C", color: "#fff" }}
              >
                Confirm Refund
              </button>
              <button
                onClick={() => setRefundingId(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#2A2A3A", color: "#9999B0" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(245,166,35,0.15)", text: "#F5A623" },
    verified: { bg: "rgba(46,204,113,0.15)", text: "#2ECC71" },
    failed: { bg: "rgba(231,76,60,0.15)", text: "#E74C3C" },
    refunded: { bg: "rgba(153,153,176,0.15)", text: "#9999B0" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize" style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    bkash: { bg: "rgba(233,30,140,0.15)", text: "#E91E8C" },
    nagad: { bg: "rgba(245,166,35,0.15)", text: "#F5A623" },
    rocket: { bg: "rgba(108,63,197,0.15)", text: "#6C3FC5" },
  };
  const c = colors[method] || { bg: "rgba(153,153,176,0.15)", text: "#9999B0" };
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize" style={{ backgroundColor: c.bg, color: c.text }}>
      {method}
    </span>
  );
}
