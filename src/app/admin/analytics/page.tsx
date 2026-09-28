"use client";

import { useMemo } from "react";
import { BarChart3, DollarSign, ShoppingBag, Users } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useOrders } from "@/contexts/orders-context";
import { formatPrice } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const { orders } = useOrders();
  const stats = useMemo(() => {
    const valid = orders.filter((order) => order.status !== "cancelled" && order.status !== "refunded");
    const revenue = valid.reduce((total, order) => total + order.total, 0);
    const customers = new Set(orders.map((order) => order.email?.toLowerCase() || order.userId).filter(Boolean));
    const today = new Date();
    const daily = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
      const end = start + 24 * 60 * 60 * 1000;
      const dayOrders = valid.filter((order) => order.createdAt >= start && order.createdAt < end);
      return { label: day.toLocaleDateString("en-IN", { weekday: "short" }), revenue: dayOrders.reduce((sum, order) => sum + order.total, 0), count: dayOrders.length };
    });
    return { revenue, orderCount: orders.length, customerCount: customers.size, average: valid.length ? revenue / valid.length : 0, daily, peak: Math.max(1, ...daily.map((item) => item.revenue)) };
  }, [orders]);
  const cards = [
    { label: "Recorded revenue", value: formatPrice(stats.revenue), icon: DollarSign, color: "text-green-700", background: "bg-green-100" },
    { label: "Orders", value: stats.orderCount.toLocaleString("en-IN"), icon: ShoppingBag, color: "text-blue-700", background: "bg-blue-100" },
    { label: "Customers", value: stats.customerCount.toLocaleString("en-IN"), icon: Users, color: "text-purple-700", background: "bg-purple-100" },
    { label: "Average order", value: formatPrice(stats.average), icon: BarChart3, color: "text-amber-700", background: "bg-amber-100" },
  ];

  return <AdminLayout><div className="space-y-6">
    <div><h1 className="text-2xl font-bold md:text-3xl">Analytics</h1><p className="mt-1 text-sm text-muted-foreground">Sales and order totals recorded in this browser.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, color, background }) => <article key={label} className="flex items-start justify-between rounded-2xl border border-border bg-card p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${background}`}><Icon size={19} className={color}/></span></article>)}</div>
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">Revenue by day</h2><p className="mt-1 text-sm text-muted-foreground">Last 7 days · {formatPrice(stats.daily.reduce((sum, item) => sum + item.revenue, 0))}</p></div><BarChart3 className="text-muted-foreground" size={20}/></div>
      {stats.orderCount === 0 ? <div className="grid min-h-64 place-items-center text-center"><div><p className="font-medium">No orders recorded yet</p><p className="mt-1 text-sm text-muted-foreground">Revenue and order activity will appear here after checkout orders are created in this browser.</p></div></div> : <div className="mt-8 grid h-64 grid-cols-7 items-end gap-2 border-b border-border pb-2 sm:gap-4">{stats.daily.map((item, index) => <div key={`${item.label}-${index}`} className="flex h-full flex-col items-center justify-end gap-2"><div className="flex h-full w-full items-end justify-center"><div title={`${item.count} orders · ${formatPrice(item.revenue)}`} className="w-full max-w-16 rounded-t-md bg-primary/80 transition-all" style={{ height: `${Math.max(item.revenue ? 8 : 2, item.revenue / stats.peak * 100)}%` }}/></div><span className="text-xs text-muted-foreground">{item.label}</span></div>)}</div>}
    </section>
    <p className="text-xs leading-5 text-muted-foreground">Analytics are limited to orders stored in this browser. They do not include other devices, abandoned checkouts, site traffic, or externally processed payments.</p>
  </div></AdminLayout>;
}
