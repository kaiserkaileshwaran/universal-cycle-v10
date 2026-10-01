"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu, X, Heart, Moon, Sun, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useTheme } from "@/contexts/theme-context";
import { CATEGORIES } from "@/constants";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchOverlay } from "@/components/search/search-overlay";
import { useStoreSettings } from "@/contexts/store-settings-context";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);

  const { user } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useStoreSettings();

  return (
    <>
      <header className="fixed top-0 w-full z-40 transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-16 h-16 lg:h-20 flex items-center justify-between">
          
          {/* Left: Mobile Menu & Desktop Logo */}
          <div className="flex-1 flex items-center justify-start gap-2">
            {/* Mobile: Hamburger */}
            <button
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} className="text-foreground" />
            </button>

            {/* Desktop Logo */}
            <Link 
              href="/" 
              className="hidden lg:flex items-center gap-3 shrink-0"
            >
              <Image
                src="/logo.svg"
                alt="Universal Cycles"
                width={56}
                height={56}
                className="rounded-lg h-14 w-14 object-contain shrink-0 dark:invert"
                loading="eager"
              />
              <span title={settings.storeName} className="whitespace-nowrap font-bold text-lg sm:text-xl xl:text-2xl transition-colors text-primary">
                {settings.storeName}
              </span>
            </Link>
          </div>

          {/* Center: Mobile Logo & Desktop Navigation */}
          <div className="flex-none flex items-center justify-center">
            {/* Mobile Logo */}
            <Link 
              href="/" 
              className="lg:hidden flex items-center gap-2 shrink-0"
            >
              <Image
                src="/logo.svg"
                alt="Universal Cycles"
                width={48}
                height={48}
                className="rounded-lg h-10 w-10 md:h-12 md:w-12 object-contain shrink-0 dark:invert"
                loading="eager"
              />
              <span title={settings.storeName} className="whitespace-nowrap font-bold text-sm md:text-lg transition-colors text-primary hidden sm:block">
                {settings.storeName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => setMegaMenuOpen(cat.id)}
                  onMouseLeave={() => setMegaMenuOpen(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${
                      "text-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    {cat.name}
                    <ChevronDown size={14} />
                  </button>

                  <AnimatePresence>
                    {megaMenuOpen === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-2">
                          <Link
                            href={`/category/${cat.slug}`}
                            className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-muted rounded-lg"
                          >
                            Shop All {cat.name}
                          </Link>
                          <div className="h-px bg-border mx-2 my-1" />
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/category/${sub.slug}`}
                              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                href="/offers"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  "text-accent-foreground bg-accent/20 hover:bg-accent/30"
                }`}
              >
                Offers 🔥
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-1 md:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-2 rounded-lg transition-colors hover:bg-white/10 ${
                "text-foreground hover:text-primary hover:bg-muted"
              }`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className={`relative p-2 rounded-lg transition-colors hover:bg-white/10 hidden sm:flex ${
                "text-foreground hover:text-primary hover:bg-muted"
              }`}
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors hover:bg-white/10 hidden md:flex ${
                "text-foreground hover:text-primary hover:bg-muted"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Account */}
            <Link
              href={user ? (user.email?.toLowerCase() === "admin@gmail.com" ? "/admin" : "/account") : "/login"}
              className={`p-2 rounded-lg transition-colors hover:bg-white/10 hidden sm:flex ${
                "text-foreground hover:text-primary hover:bg-muted"
              }`}
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all hover:scale-105 shadow-md"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] sm:w-80 bg-background z-50 overflow-y-auto"
            >
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <Image src="/logo.svg" alt="Universal Cycles logo" width={32} height={32} className="rounded-lg h-8 w-8 object-contain shrink-0 dark:invert" fetchPriority="high" />
                  <span className="font-bold tracking-widest uppercase text-primary text-sm">Universal</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted font-medium text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    <div className="ml-4 space-y-1 mb-2">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${sub.slug}`}
                          className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="h-px bg-border my-3" />

                <Link
                  href="/offers"
                  className="flex items-center px-3 py-3 rounded-xl hover:bg-muted font-medium text-accent-foreground bg-accent/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔥 Deals & Offers
                </Link>

                <div className="h-px bg-border my-3" />

                <Link
                  href={user ? (user.email?.toLowerCase() === "admin@gmail.com" ? "/admin" : "/account") : "/login"}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} className="text-muted-foreground" />
                  <span>{user ? (user.email?.toLowerCase() === "admin@gmail.com" ? "Admin Dashboard" : "My Account") : "Log In / Sign Up"}</span>
                </Link>

                <Link
                  href="/account/wishlist"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={18} className="text-muted-foreground" />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-muted"
                >
                  {theme === "dark" ? <Sun size={18} className="text-muted-foreground" /> : <Moon size={18} className="text-muted-foreground" />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay key={searchOpen ? "open" : "closed"} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

