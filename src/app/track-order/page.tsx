"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PackageCheck, Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useOrders } from "@/contexts/orders-context";
import { ORDER_STATUSES } from "@/constants";
import { formatPrice } from "@/lib/utils";

function TrackOrderContent() {
  const params = useSearchParams();
  const { orders } = useOrders();
  const [query, setQuery] = useState("");
  const orderId = params.get("orderId") || query.trim();
  const order = orders.find((item) => item.id.toLowerCase() === orderId.toLowerCase());

  return <div className="min-h-screen bg-background flex flex-col"><Navbar />
    <main className="container mx-auto max-w-3xl flex-1 px-4 py-28 md:px-8">
      <div className="text-center mb-8"><PackageCheck className="mx-auto mb-3 text-primary" size={38} /><h1 className="text-3xl font-bold">Track your order</h1><p className="mt-2 text-muted-foreground">Enter the order number shown after checkout.</p></div>
      {!params.get("orderId") && <form className="flex gap-2 mb-7" onSubmit={(event) => { event.preventDefault(); window.history.replaceState(null, "", `/track-order?orderId=${encodeURIComponent(query.trim())}`); }}>
        <label className="sr-only" htmlFor="order-number">Order number</label><input id="order-number" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. UC123456" className="min-w-0 flex-1 rounded-xl border border-border bg-card px-4 py-3" required />
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"><Search size={17} /> Track</button></form>}
      {order ? <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5"><div><p className="text-sm text-muted-foreground">Order</p><h2 className="text-xl font-bold">#{order.id}</h2><p className="mt-1 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p></div><span className={`rounded-full px-3 py-1 text-sm font-semibold ${ORDER_STATUSES[order.status]?.color}`}>{ORDER_STATUSES[order.status]?.label ?? order.status}</span></div>
        <div className="space-y-3 py-5">{order.items.map((item) => <div key={item.productId} className="flex justify-between gap-4 text-sm"><span>{item.name} × {item.quantity}</span><span className="font-semibold">{formatPrice(item.price * item.quantity)}</span></div>)}</div>
        <div className="flex justify-between border-t border-border pt-4 font-bold"><span>Order total</span><span>{formatPrice(order.total)}</span></div>
        {order.trackingNumber && <div className="mt-5 rounded-xl bg-primary/5 p-4"><p className="text-sm font-semibold">Carrier tracking reference</p><p className="mt-1 break-all font-mono text-sm text-primary">{order.trackingNumber}</p></div>}
        <p className="mt-5 text-sm text-muted-foreground">Delivery to {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state}.</p>
      </section> : <div className="rounded-2xl border border-border bg-card p-8 text-center"><p className="font-semibold">{orderId ? "We couldn’t find that order on this device." : "Your order status will appear here."}</p><p className="mt-2 text-sm text-muted-foreground">Order history is currently stored in this browser.</p><Link href="/category/adult-cycles" className="mt-5 inline-block font-semibold text-primary">Continue shopping</Link></div>}
    </main><Footer /></div>;
}

export default function TrackOrderPage() {
  return <Suspense fallback={<div className="min-h-screen bg-background" />}><TrackOrderContent /></Suspense>;
}
