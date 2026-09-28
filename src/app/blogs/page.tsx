"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useBlogs } from "@/contexts/blogs-context";

const CATEGORIES = [
  "All",
  "Health & Fitness",
  "Guides",
  "Reviews",
  "Maintenance",
  "Lifestyle",
  "Cycling Gear"
];

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { blogs } = useBlogs();
  const BLOG_POSTS = blogs.filter((post) => post.status === "published").map((post) => ({
    ...post,
    readTime: `${Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))} min read`,
  }));

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === "All" || post.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const featuredPost = BLOG_POSTS[0];
  const regularPosts = filteredPosts.filter(p => !featuredPost || p.id !== featuredPost.id || activeCategory !== "All" || searchQuery !== "");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 lg:pt-24">
        {/* Header */}
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Read the latest articles, guides, and tips about cycling, fitness, and must-have accessories.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Featured Post (only show when no filters applied) */}
          {featuredPost && activeCategory === "All" && searchQuery === "" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16 group"
            >
              <Link href={`/blogs/${featuredPost.id}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-colors">
                <div className="relative aspect-[4/3] md:aspect-auto md:h-full w-full overflow-hidden">
                  <Image 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 md:p-12">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2"><User size={16} /> {featuredPost.author}</div>
                    <div className="flex items-center gap-2"><Calendar size={16} /> {featuredPost.date}</div>
                    <div className="flex items-center gap-2"><Tag size={16} /> {featuredPost.readTime}</div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-primary font-bold">
                    Read Article <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Regular Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blogs/${post.id}`} className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <User size={16} className="text-muted-foreground" /> {post.author}
                      </div>
                      <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}
