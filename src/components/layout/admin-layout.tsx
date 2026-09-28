"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  Sparkles, FileText, BarChart3, Settings,
  ChevronLeft, Menu, Bell, LogOut, MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getFirebaseAuth } from "@/firebase/firebase";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/promotions", label: "Promotions", icon: Tag },
      { href: "/admin/spin-wheel", label: "Spin Wheel", icon: Sparkles },
      { href: "/admin/blogs", label: "Blogs & CMS", icon: FileText },
      { href: "/admin/messages", label: "Messages & subscribers", icon: MessageSquare },
    ],
  },
  {
    label: "Reports",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function Sidebar({
  mobile = false,
  collapsed,
  setCollapsed,
  setMobileOpen,
  pathname,
  user,
  signOut
}: {
  mobile?: boolean;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
  pathname: string | null;
  user: import("firebase/auth").User | null;
  signOut: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-primary text-primary-foreground transition-all duration-300",
        !mobile && (collapsed ? "w-16" : "w-64")
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-primary-foreground/20">
        {(!collapsed || mobile) && (
          <span className="font-bold tracking-widest uppercase text-sm text-accent">
            Universal Admin
          </span>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-primary-foreground/10 transition-colors"
          >
            <ChevronLeft
              size={18}
              className={cn("transition-transform duration-300", collapsed && "rotate-180")}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            {(!collapsed || mobile) && (
              <p className="px-4 text-xs font-semibold text-primary-foreground/40 uppercase tracking-wider mb-2">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => mobile && setMobileOpen(false)}
                  title={collapsed && !mobile ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {(!collapsed || mobile) && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      {(!collapsed || mobile) && (
        <div className="p-4 border-t border-primary-foreground/20">
          <p className="text-xs text-primary-foreground/60 truncate mb-1">{user?.email}</p>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const isAdmin = user?.email?.toLowerCase() === "admin@gmail.com";

  useEffect(() => {
    if (loading || isAdmin) return;
    if (user) {
      router.replace("/account");
      return;
    }
    // A successful Firebase sign-in can resolve just before its auth-state
    // listener publishes the new user. Give that listener a brief chance first.
    const redirectTimer = window.setTimeout(() => {
      try {
        if (!getFirebaseAuth().currentUser) router.replace("/login");
      } catch {
        router.replace("/login");
      }
    }, 900);
    return () => window.clearTimeout(redirectTimer);
  }, [isAdmin, user, loading, router]);

  if (loading || !isAdmin || !user) {
    return <div className="h-screen flex items-center justify-center bg-muted/30">Loading admin...</div>;
  }

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
          pathname={pathname}
          user={user}
          signOut={signOut}
        />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
            >
              <Sidebar
                mobile
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                setMobileOpen={setMobileOpen}
                pathname={pathname}
                user={user}
                signOut={signOut}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
          <button className="lg:hidden p-2 hover:bg-muted rounded-lg" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 hover:bg-muted rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <Link href="/" className="text-xs text-primary hover:underline hidden sm:block">
              ← View Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
