"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User, ShoppingBag, Heart, MapPin, LogOut, ChevronRight,
  Package, Star, Settings, Gift
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/contexts/auth-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";
import { ORDER_STATUSES } from "@/constants";
import { useOrders } from "@/contexts/orders-context";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useProducts } from "@/contexts/products-context";
import { useCart } from "@/contexts/cart-context";
import { useAddresses } from "@/contexts/addresses-context";

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "settings";

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const { wishlist } = useWishlist();
  const { orders } = useOrders();
  const { products } = useProducts();
  const { addItem } = useCart();
  const { getAddresses, setDefaultAddress, deleteAddress } = useAddresses();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [profileMessage, setProfileMessage] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const userOrders = orders.filter((order) => order.userId === user?.uid || (!!order.email && order.email.toLowerCase() === user?.email?.toLowerCase()));
  const savedAddresses = user ? getAddresses(user.uid) : [];

  useEffect(() => {
    // Initialize the selected tab once from the browser URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (new URLSearchParams(window.location.search).get("tab") === "orders") setActiveTab("orders");
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    try {
      // Read reward points recorded by the wheel in this browser.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRewardPoints(Number(localStorage.getItem(`uc_reward_points:${user.uid}`)) || 0);
    } catch { setRewardPoints(0); }
  }, [user?.uid]);

  const wishlisted = products.filter((p: Product) => p.isActive && wishlist.includes(p.id));

  const NAV_ITEMS = [
    { id: "overview" as Tab, label: "Overview", icon: <User size={18} /> },
    { id: "orders" as Tab, label: "My Orders", icon: <ShoppingBag size={18} /> },
    { id: "wishlist" as Tab, label: "Wishlist", icon: <Heart size={18} /> },
    { id: "addresses" as Tab, label: "Addresses", icon: <MapPin size={18} /> },
    { id: "settings" as Tab, label: "Settings", icon: <Settings size={18} /> },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold mb-2">Please log in</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to access your account.</p>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Profile Card */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-4 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="Profile" width={80} height={80} className="rounded-full" />
                  ) : (
                    <User size={36} className="text-primary" />
                  )}
                </div>
                <p className="font-bold text-lg">{user.displayName ?? "User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-amber-500">
                  <Gift size={14} />
                  <span className="text-xs font-semibold">Customer Account</span>
                </div>
              </div>

              <nav className="bg-card border border-border rounded-2xl overflow-hidden">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors border-b border-border last:border-0 ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                ))}
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <h1 className="text-2xl font-bold">Welcome back, {user.displayName?.split(" ")[0] ?? "there"}! 👋</h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      { label: "Total Orders", value: userOrders.length, icon: <Package className="text-primary" /> },
                      { label: "Wishlist Items", value: wishlist.length, icon: <Heart className="text-red-500" /> },
                      { label: "Reward Points", value: rewardPoints, icon: <Gift className="text-amber-500" /> },
                      { label: "Member Since", value: user.metadata.creationTime ? new Date(user.metadata.creationTime).getFullYear() : "—", icon: <Star className="text-amber-500" /> },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                          {stat.icon}
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-lg">Recent Orders</h2>
                      <button onClick={() => setActiveTab("orders")} className="text-sm text-primary hover:underline">
                        View all
                      </button>
                    </div>
                    <div className="space-y-3">
                      {userOrders.slice(0, 2).map((order) => {
                        const status = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
                        return (
                          <div key={order.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">#{order.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {order.items.length} item{order.items.length > 1 ? "s" : ""} · {formatPrice(order.total)}
                              </p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                        );
                      })}
                      {userOrders.length === 0 && <p className="py-5 text-sm text-muted-foreground">Your orders will appear here after checkout.</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h1 className="text-2xl font-bold">My Orders</h1>
                  {userOrders.map((order) => {
                    const status = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
                    return (
                      <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                <Image src={item.thumbnail} alt={item.name} fill sizes="80px" className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="font-bold">Total: {formatPrice(order.total)}</span>
                          <div className="flex gap-2">
                            <Link href={`/track-order?orderId=${encodeURIComponent(order.id)}`} className="text-sm text-primary border border-primary px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                              Track Order
                            </Link>
                            {order.status === "delivered" && (
                              <button onClick={() => {
                                for (const item of order.items) {
                                  const product = products.find((candidate) => candidate.id === item.productId && candidate.isActive && candidate.stock > 0);
                                  if (product) addItem(product, { quantity: Math.min(item.quantity, product.stock) });
                                }
                                router.push("/cart");
                              }} className="text-sm bg-muted px-3 py-1.5 rounded-lg hover:bg-muted/80 transition-colors">
                                Reorder
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {userOrders.length === 0 && <div className="rounded-2xl border border-dashed border-border py-14 text-center text-muted-foreground">No orders yet. Your order history will show here.</div>}
                </motion.div>
              )}

              {activeTab === "wishlist" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-2xl font-bold mb-6">My Wishlist ({wishlisted.length})</h1>
                  {wishlisted.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your wishlist is empty. Start saving your favorites!</p>
                      <Link href="/category/adult-cycles" className="inline-block mt-4 text-primary font-semibold hover:underline">
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlisted.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-2xl font-bold mb-6">Saved Addresses</h1>
                  {savedAddresses.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                    <MapPin size={32} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="font-medium">No saved addresses yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">Save your delivery address during checkout and it will appear here on this device.</p>
                    <Link href="/category/adult-cycles" className="mt-4 inline-block text-sm font-semibold text-primary">Continue shopping</Link>
                  </div> : <div className="grid gap-4 sm:grid-cols-2">{savedAddresses.map((address) => <article key={address.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{address.label}{address.isDefault && <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Default</span>}</p><p className="mt-2 text-sm">{address.fullName} · {address.phone}</p><p className="mt-1 text-sm text-muted-foreground">{address.street1}{address.street2 ? `, ${address.street2}` : ""}<br/>{address.city}, {address.state} {address.zipCode}<br/>{address.country}</p></div></div><div className="mt-4 flex gap-3 border-t border-border pt-3">{!address.isDefault && <button onClick={() => setDefaultAddress(user.uid, address.id)} className="text-xs font-semibold text-primary">Make default</button>}<button onClick={() => deleteAddress(user.uid, address.id)} className="text-xs font-semibold text-destructive">Remove</button></div></article>)}</div>}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h2 className="font-semibold mb-4">Profile Information</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Display Name</label>
                          <input
                            value={displayName || user.displayName || ""}
                            onChange={(event) => setDisplayName(event.target.value)}
                            className="mt-1 w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <input
                            defaultValue={user.email ?? ""}
                            disabled
                            className="mt-1 w-full px-4 py-3 rounded-xl border border-border bg-muted text-sm cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <button onClick={async () => {
                        setProfileMessage("");
                        try {
                          const nextName = displayName.trim() || user.displayName?.trim();
                          if (!nextName) throw new Error("Enter a display name.");
                          await updateProfile(user, { displayName: nextName });
                          setDisplayName(nextName);
                          setProfileMessage("Your profile name has been updated.");
                        } catch (error) {
                          setProfileMessage(error instanceof Error ? error.message : "We could not update your profile.");
                        }
                      }} className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Save Changes
                      </button>
                      {profileMessage && <p role="status" className="mt-3 text-sm text-muted-foreground">{profileMessage}</p>}
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h2 className="font-semibold mb-4 text-destructive">Danger Zone</h2>
                      <p className="text-sm text-muted-foreground">For account removal, contact <a className="text-primary underline" href="mailto:support@universalcycles.in">support@universalcycles.in</a>.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
