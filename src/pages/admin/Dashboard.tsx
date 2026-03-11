import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle, Clock, DollarSign, CalendarDays, CalendarRange } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { format, parseISO } from "date-fns";

interface Summary {
  total_orders: number;
  confirmed_orders: number;
  pending_orders: number;
  total_revenue: number;
  today_orders: number;
  this_month_orders: number;
}

type Period = "daily" | "weekly" | "monthly";

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [period, setPeriod] = useState<Period>("daily");
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchChart();
  }, [period]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchChart(), fetchRecent(), fetchPayments()]);
    setLoading(false);
  };

  const fetchSummary = async () => {
    const { data } = await supabase.from("vw_dashboard_summary" as any).select("*").single();
    if (data) setSummary(data as any);
  };

  const fetchChart = async () => {
    const viewMap: Record<Period, string> = {
      daily: "vw_daily_order_summary",
      weekly: "vw_weekly_order_summary",
      monthly: "vw_monthly_order_summary",
    };
    const { data } = await supabase.from(viewMap[period] as any).select("*");
    setChartData((data as any[]) || []);
  };

  const fetchRecent = async () => {
    const { data } = await supabase.from("vw_recent_orders" as any).select("*");
    setRecentOrders((data as any[]) || []);
  };

  const fetchPayments = async () => {
    const { data } = await supabase.from("vw_payment_method_breakdown" as any).select("*");
    setPaymentBreakdown((data as any[]) || []);
  };

  const cards = summary
    ? [
        { icon: Package, label: "Total Orders", value: summary.total_orders },
        { icon: CheckCircle, label: "Confirmed", value: summary.confirmed_orders },
        { icon: Clock, label: "Pending", value: summary.pending_orders },
        { icon: DollarSign, label: "Total Revenue", value: `৳${summary.total_revenue.toLocaleString()}` },
        { icon: CalendarDays, label: "Today", value: summary.today_orders },
        { icon: CalendarRange, label: "This Month", value: summary.this_month_orders },
      ]
    : [];

  const methodColors: Record<string, string> = {
    bkash: "#E91E8C",
    nagad: "#F5A623",
    rocket: "#6C3FC5",
  };

  const formatXLabel = (val: any) => {
    try {
      const d = parseISO(String(val));
      if (period === "daily") return format(d, "dd MMM");
      if (period === "weekly") return `Wk ${format(d, "dd MMM")}`;
      return format(d, "MMM yyyy");
    } catch {
      return String(val);
    }
  };

  const xKey = period === "daily" ? "date" : period === "weekly" ? "week_start" : "month_start";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: "#1E1E2E" }} />
          ))}
        </div>
        <div className="h-80 rounded-xl animate-pulse" style={{ backgroundColor: "#1E1E2E" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "#F9F6F2" }}>Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border flex items-center gap-4"
            style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(201,169,110,0.12)" }}>
              <card.icon size={22} style={{ color: "#C9A96E" }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "#F9F6F2" }}>{card.value}</div>
              <div className="text-xs" style={{ color: "#9999B0" }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "#F9F6F2" }}>Order Trends</h2>
          <div className="flex gap-1">
            {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors"
                style={{
                  backgroundColor: period === p ? "rgba(201,169,110,0.12)" : "transparent",
                  color: period === p ? "#C9A96E" : "#9999B0",
                  border: period === p ? "1px solid #C9A96E" : "1px solid transparent",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey={xKey} tickFormatter={formatXLabel} tick={{ fill: "#9999B0", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9999B0", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1E1E2E", border: "1px solid #2A2A3A", borderRadius: 8, color: "#F9F6F2" }}
              labelFormatter={formatXLabel}
              formatter={(value: any, name: string) => {
                if (name === "revenue") return [`৳${Number(value).toLocaleString()}`, "Revenue"];
                return [value, name === "confirmed_orders" ? "Confirmed" : "Pending"];
              }}
            />
            <Legend wrapperStyle={{ color: "#9999B0", fontSize: 12 }} />
            <Bar dataKey="confirmed_orders" name="Confirmed" fill="#C9A96E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending_orders" name="Pending" fill="#4A4A6A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "#F9F6F2" }}>Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "#9999B0" }}>No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o: any) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#2A2A3A" }}>
                  <div>
                    <span className="font-mono text-xs" style={{ color: "#C9A96E" }}>{o.order_number}</span>
                    <span className="ml-2 text-sm" style={{ color: "#F9F6F2" }}>{o.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MethodBadge method={o.payment_method} />
                    <span className="text-sm font-medium" style={{ color: "#F9F6F2" }}>৳{o.amount}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-4 text-sm font-medium hover:underline"
            style={{ color: "#C9A96E" }}
          >
            See all orders →
          </button>
        </div>

        {/* Payment Breakdown */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "#F9F6F2" }}>Payment Methods</h2>
          {paymentBreakdown.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "#9999B0" }}>No payment data</p>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    dataKey="order_count"
                    nameKey="payment_method"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {paymentBreakdown.map((entry: any, idx: number) => (
                      <Cell key={idx} fill={methodColors[entry.payment_method] || "#4A4A6A"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1E1E2E", border: "1px solid #2A2A3A", borderRadius: 8, color: "#F9F6F2" }}
                    formatter={(value: any, name: string) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-2">
                {paymentBreakdown.map((entry: any) => {
                  const total = paymentBreakdown.reduce((s: number, e: any) => s + e.order_count, 0);
                  const pct = total > 0 ? ((entry.order_count / total) * 100).toFixed(0) : 0;
                  return (
                    <div key={entry.payment_method} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: methodColors[entry.payment_method] || "#4A4A6A" }} />
                      <span className="capitalize" style={{ color: "#F9F6F2" }}>{entry.payment_method}</span>
                      <span style={{ color: "#9999B0" }}>{entry.order_count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
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
