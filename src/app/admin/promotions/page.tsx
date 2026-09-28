"use client";

import { Calendar, Percent, Tag } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { COUPON_RULES } from "@/constants/promotions";
import { formatPrice } from "@/lib/utils";

export default function AdminPromotionsPage() {
  const rules = Object.entries(COUPON_RULES);
  return <AdminLayout><div className="space-y-6">
    <div><h1 className="text-2xl font-bold md:text-3xl">Promotions</h1><p className="mt-1 text-sm text-muted-foreground">Live checkout codes and their current eligibility rules.</p></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Tag size={22} /></span><div><p className="text-sm text-muted-foreground">Available codes</p><p className="text-2xl font-bold">{rules.length}</p></div></div>
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700"><Percent size={22} /></span><div><p className="text-sm text-muted-foreground">Discount redeemed</p><p className="text-sm font-semibold">Tracked after database setup</p></div></div>
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700"><Calendar size={22} /></span><div><p className="text-sm text-muted-foreground">Scheduled campaigns</p><p className="text-2xl font-bold">0</p></div></div>
    </div>
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto"><table className="w-full min-w-[620px]">
        <thead className="bg-muted/50"><tr>{["Code", "Offer", "Minimum spend", "Status"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{heading}</th>)}</tr></thead>
        <tbody className="divide-y divide-border">{rules.map(([code, rule]) => <tr key={code}>
          <td className="px-5 py-4 font-mono font-bold">{code}</td>
          <td className="px-5 py-4">{rule.kind === "percent" ? `${rule.value}% off` : rule.kind === "shipping" ? "Free shipping" : `${formatPrice(rule.value)} off`}</td>
          <td className="px-5 py-4 text-sm text-muted-foreground">{rule.minimum ? formatPrice(rule.minimum) : "No minimum"}</td>
          <td className="px-5 py-4"><span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Available at checkout</span></td>
        </tr>)}</tbody>
      </table></div>
      <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">Promotion values are shared with checkout. To add or change codes, update the store promotion rules before deployment.</p>
    </div>
  </div></AdminLayout>;
}
