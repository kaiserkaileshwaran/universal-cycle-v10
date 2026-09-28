"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, ShoppingBag, Users, Package, DollarSign, BarChart3, RefreshCw, AlertCircle
} from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useProducts } from "@/contexts/products-context";
import { useOrders } from "@/contexts/orders-context";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const lowStock = products.filter((product) => product.isActive && product.stock < 10);
  const revenue = orders.filter((order) => order.status !== "cancelled" && order.status !== "refunded").reduce((sum, order) => sum + order.total, 0);
  const customers = new Set(orders.map((order) => order.email).filter(Boolean)).size;
  const stats = [
    { title: "Recorded Revenue", value: formatPrice(revenue), icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { title: "Orders", value: orders.length.toLocaleString(), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Customers", value: customers.toLocaleString(), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Active Products", value: products.filter((product) => product.isActive).length.toLocaleString(), icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
  ];
  const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const topProducts = products.filter((product) => product.isActive).slice(0, 5);
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon size={20} className={stat.color} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">From saved orders on this device</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">
                      Order ID
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">
                      Customer
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">
                      Total
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 text-sm font-mono font-medium">#{order.id}</td>
                      <td className="py-3 text-sm">{order.shippingAddress.fullName}</td>
                      <td className="py-3 text-sm font-semibold">{formatPrice(order.total)}</td>
                      <td className="py-3">
                        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", STATUS_COLORS[order.status])}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Orders placed on this device will appear here.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Snapshot */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Inventory Snapshot</h2>
              <BarChart3 size={18} className="text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground/40 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
                    <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-primary rounded-full"
                        style={{ width: `${Math.min(100, product.stock)}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-primary text-right">
                    {formatPrice(product.salePrice ?? product.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={20} className="text-amber-600" />
              <h2 className="font-bold text-amber-800">Low Stock Alert ({lowStock.length} products)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStock.map((product) => (
                <div key={product.id} className="bg-white border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Manage Products", icon: Package, href: "/admin/products", color: "bg-blue-50 text-blue-600" },
            { label: "View Orders", icon: ShoppingBag, href: "/admin/orders", color: "bg-green-50 text-green-600" },
            { label: "Spin Wheel", icon: TrendingUp, href: "/admin/spin-wheel", color: "bg-purple-50 text-purple-600" },
            { label: "Inventory", icon: RefreshCw, href: "/admin/products", color: "bg-amber-50 text-amber-600" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow text-center group"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", action.color)}>
                <action.icon size={22} />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
