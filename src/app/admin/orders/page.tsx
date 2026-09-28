"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/constants";
import { cn } from "@/lib/utils";
import { useOrders } from "@/contexts/orders-context";
import { useProducts } from "@/contexts/products-context";
import type { Order } from "@/types";

const STATUS_FLOW = ["pending", "processing", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const { orders, updateOrder } = useOrders();
  const { setProducts } = useProducts();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState("");

  const visibleOrders = useMemo(() => orders.map((order) => ({
    ...order,
    customer: order.shippingAddress.fullName,
    email: order.email ?? "",
    itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    date: new Date(order.createdAt).toLocaleDateString(),
    payment: order.paymentMethod,
  })), [orders]);
  const filtered = visibleOrders.filter((o) => {
    const q = search.toLowerCase();
    const matchQ = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
    return matchQ && (filterStatus === "all" || o.status === filterStatus);
  });

  const advanceStatus = (id: string) => {
    const order = orders.find((item) => item.id === id);
    if (!order) return;
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx < STATUS_FLOW.length - 1) updateOrder(id, { status: STATUS_FLOW[idx + 1] as Order["status"] });
  };

  const cancelOrder = (id: string) => {
    const order = orders.find((item) => item.id === id);
    if (!order || !["pending", "processing"].includes(order.status)) return;
    setProducts((current) => current.map((product) => {
      const item = order.items.find((line) => line.productId === product.id);
      return item ? { ...product, stock: product.stock + item.quantity, updatedAt: Date.now() } : product;
    }));
    updateOrder(id, { status: "cancelled", updatedAt: Date.now() });
    setViewOrder(null);
  };

  const openOrder = (order: Order) => { setViewOrder(order); setTrackingInput(order.trackingNumber ?? ""); };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm">{orders.length} total orders</p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {["all", ...Object.keys(ORDER_STATUSES)].map((status) => {
            const count = status === "all" ? orders.length : orders.filter((o) => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  filterStatus === status ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
                )}
              >
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{status}</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order) => {
                  const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
                  return (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono font-medium">#{order.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">{order.itemCount}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3 text-xs uppercase text-muted-foreground font-medium">{order.payment}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", statusInfo?.color)}>
                          {statusInfo?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{order.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openOrder(order)}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
                          >
                            <Eye size={15} />
                          </button>
                          {STATUS_FLOW.includes(order.status) && order.status !== "delivered" && (
                            <button
                              onClick={() => advanceStatus(order.id)}
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-green-600"
                              title="Advance status"
                            >
                              <Truck size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-muted-foreground">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {viewOrder && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50" onClick={() => setViewOrder(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-2xl z-50 shadow-2xl"
              >
                <div className="p-6 border-b">
                  <h2 className="font-bold text-lg">Order #{viewOrder.id}</h2>
                  <p className="text-sm text-muted-foreground">{new Date(viewOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{viewOrder.shippingAddress.fullName}</p></div>
                    <div><p className="text-muted-foreground">Email</p><p className="font-medium break-all">{viewOrder.email}</p></div>
                    <div><p className="text-muted-foreground">Total</p><p className="font-bold text-primary">{formatPrice(viewOrder.total)}</p></div>
                    <div><p className="text-muted-foreground">Payment</p><p className="font-medium uppercase">{viewOrder.paymentMethod} · {viewOrder.paymentStatus}</p></div>
                    <div className="col-span-2"><label htmlFor="order-tracking" className="text-muted-foreground">Tracking number</label><div className="mt-1 flex gap-2"><input id="order-tracking" value={trackingInput} onChange={(event) => setTrackingInput(event.target.value)} placeholder="Carrier tracking reference" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2"/><button onClick={() => { updateOrder(viewOrder.id, { trackingNumber: trackingInput.trim() || undefined, updatedAt: Date.now() }); setViewOrder((current) => current ? { ...current, trackingNumber: trackingInput.trim() || undefined } : current); }} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Save</button></div></div>
                  </div>

                  {/* Status Progress */}
                  <div>
                    <p className="text-sm font-semibold mb-3">Order Status</p>
                    <div className="flex items-center gap-2">
                      {STATUS_FLOW.map((s, i) => {
                        const currentIdx = STATUS_FLOW.indexOf(viewOrder.status);
                        const done = currentIdx >= i;
                        return (
                          <div key={s} className="flex items-center">
                            <div className={cn("flex flex-col items-center gap-1", done ? "text-primary" : "text-muted-foreground")}>
                              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", done ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                {done ? <CheckCircle size={14} /> : i + 1}
                              </div>
                              <span className="text-xs capitalize whitespace-nowrap">{s}</span>
                            </div>
                            {i < STATUS_FLOW.length - 1 && (
                              <div className={cn("flex-1 h-0.5 mx-1 min-w-4", done && currentIdx > i ? "bg-primary" : "bg-muted")} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t flex gap-3">
                  {["pending", "processing"].includes(viewOrder.status) && (
                    <button
                      onClick={() => cancelOrder(viewOrder.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive text-destructive font-semibold hover:bg-destructive/10 text-sm"
                    >
                      <XCircle size={16} /> Cancel Order
                    </button>
                  )}
                  {STATUS_FLOW.includes(viewOrder.status) && viewOrder.status !== "delivered" && (
                    <button
                      onClick={() => { advanceStatus(viewOrder.id); setViewOrder(null); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 text-sm"
                    >
                      <Truck size={16} /> Advance Status
                    </button>
                  )}
                  {viewOrder.paymentMethod === "cod" && viewOrder.paymentStatus !== "paid" && viewOrder.status === "delivered" && <button onClick={() => { updateOrder(viewOrder.id, { paymentStatus: "paid", updatedAt: Date.now() }); setViewOrder((current) => current ? { ...current, paymentStatus: "paid" } : current); }} className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white">Mark collected</button>}
                  <button
                    onClick={() => setViewOrder(null)}
                    className="flex-1 py-3 rounded-xl border border-border font-semibold hover:bg-muted text-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
