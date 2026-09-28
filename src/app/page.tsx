"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, TrendingUp, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/products/product-card";
import { CATEGORIES } from "@/constants";
import { useProducts } from "@/contexts/products-context";
import { useMarketing } from "@/contexts/marketing-context";
import { useStoreSettings } from "@/contexts/store-settings-context";
import { formatPrice } from "@/lib/utils";

export default function Home() {
  const { products } = useProducts();
  const { subscribe } = useMarketing();
  const { settings } = useStoreSettings();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const activeProducts = products.filter((product) => product.isActive);
  const featuredProducts = activeProducts.slice(0, 4);
  const flashSaleProducts = activeProducts.filter((p) => p.salePrice).slice(0, 4);
  const newArrivals = [...activeProducts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  const heroStats = [
    { label: "Products", value: activeProducts.length.toLocaleString() },
    { label: "Categories", value: CATEGORIES.length.toLocaleString() },
    { label: "Brands", value: new Set(activeProducts.map((product) => product.brand)).size.toLocaleString() },
    { label: "On sale", value: flashSaleProducts.length.toLocaleString() },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src="/background-landscape.png"
              alt="Forest valley background"
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover object-center"
              preload
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-4 py-32 md:py-40">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <TrendingUp size={14} />
                Explore bicycles and gear for everyday rides and weekend escapes
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95]"
              >
                Ride Into<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                  Adventure
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed"
              >
                Discover our premium collection of cycles, accessories, and gear — crafted for those who live life in motion.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/category/all"
                  className="bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                >
                  Shop Cycles
                </Link>
                <Link
                  href="/category/accessories"
                  className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
                >
                  Explore Accessories
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="flex flex-wrap gap-8 mt-16"
              >
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-300">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-5 h-9 border-2 border-white/50 rounded-full flex items-start justify-center pt-1.5"
            >
              <div className="w-1.5 h-2.5 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* ─── CATEGORIES ─── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  What We Offer
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Shop by Category
                </h2>
              </div>
              <Link
                href="/category/all"
                className="hidden md:flex items-center gap-1 text-primary font-medium hover:gap-3 transition-all"
              >
                All Categories <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={`/category/${cat.slug}`}
                    className="group flex flex-col items-center gap-3 p-6 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center text-3xl transition-colors">
                      {cat.id === "adult-cycles" ? "🚴" :
                       cat.id === "kids-bicycles" ? "🚲" : "🪖"}
                    </div>
                    <span className="font-semibold text-sm leading-tight">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURED PRODUCTS ─── */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2">Hand-Picked</p>
                <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
              </div>
              <Link href="/category/all" className="hidden md:flex items-center gap-1 text-primary font-medium hover:gap-3 transition-all">
                View All <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FLASH SALE BANNER ─── */}
        <section className="py-20 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center">
                  <Zap size={28} className="text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">Current Sale Prices</h2>
                  <p className="text-primary-foreground/70">Selected products with a reduced price today.</p>
                </div>
              </div>
            </div>

            {flashSaleProducts.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashSaleProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur rounded-2xl overflow-hidden hover:bg-white/20 transition-colors"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={product.thumbnail} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                      <div className="absolute top-3 left-3 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0}%
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm text-white line-clamp-2 mb-2">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-accent">
                          {formatPrice(product.salePrice ?? product.price)}
                        </span>
                        {product.salePrice && (
                          <span className="text-sm text-white/50 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div> : <p className="rounded-2xl border border-white/20 bg-white/10 p-6 text-sm text-primary-foreground/80">There are no discounted products right now. Check back after the next catalog update.</p>}
          </div>
        </section>

        {/* ─── PREMIUM BANNER ─── */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="relative rounded-3xl overflow-hidden">
              <Image
                src="/background-landscape.png"
                alt="Premium experience"
                width={1440}
                height={600}
                className="w-full object-cover h-80 md:h-[480px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center p-8 md:p-16">
                <div className="max-w-lg">
                  <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
                    Premium Collection
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Electric Cycles<br />Reimagined
                  </h2>
                  <p className="text-gray-300 mb-8 text-lg">
                    Smart, sustainable, and built for the future. Experience the next generation of urban mobility.
                  </p>
                  <Link
                    href="/category/electric-cycles"
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
                  >
                    Explore Electric <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NEW ARRIVALS ─── */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2">Just Dropped</p>
                <h2 className="text-3xl md:text-4xl font-bold">New Arrivals</h2>
              </div>
              <Link href="/category/all" className="hidden md:flex items-center gap-1 text-primary font-medium hover:gap-3 transition-all">
                View All <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY US ─── */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2">
                Our Promise
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose Universal Cycles?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🚚",
                  title: "Clear Shipping Rates",
                  desc: `Standard delivery is ${settings.freeShippingMinimum === 0 ? "free on all orders" : `free above ${formatPrice(settings.freeShippingMinimum)}`} and other options are shown at checkout.`,
                },
                {
                  icon: "💵",
                  title: "Cash on Delivery",
                  desc: "Choose cash on delivery at checkout. No card payment is collected by this preview.",
                },
                {
                  icon: "📦",
                  title: "Order Status",
                  desc: "View the status and carrier reference saved for your order in this browser.",
                },
                {
                  icon: "🔎",
                  title: "Product Details",
                  desc: "Review specifications, current stock, and available sale pricing before you order.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── NEWSLETTER ─── */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-primary-foreground/70 mb-8 text-lg">
              Get exclusive deals, new arrivals, and adventure inspiration delivered to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(event) => {
                event.preventDefault();
                const outcome = subscribe(newsletterEmail);
                setNewsletterMessage(outcome === "added" ? "You’re subscribed on this browser." : "This email is already subscribed.");
                setNewsletterEmail("");
              }}
            >
              <input
                type="email"
                aria-label="Email address for newsletter"
                placeholder="Enter your email"
                required
                value={newsletterEmail}
                onChange={(event) => { setNewsletterEmail(event.target.value); setNewsletterMessage(""); }}
                className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-accent focus:bg-white/20 transition"
              />
              <button
                type="submit"
                className="bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Subscribe
              </button>
            </form>
            <p role="status" className="text-xs text-primary-foreground/70 mt-4">{newsletterMessage || "Subscriptions are saved in this browser. You can remove them from admin messages."}</p>
          </div>
        </section>

        <Footer />
    </div>
  );
}
