"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Check, Eye } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useBlogs, type BlogPost } from "@/contexts/blogs-context";

const CATEGORIES = [
  "Health & Fitness",
  "Guides",
  "Reviews",
  "Maintenance",
  "Lifestyle",
  "Cycling Gear"
];

export default function AdminBlogsPage() {
  const { blogs, saveBlog: persistBlog, deleteBlog: removeBlog } = useBlogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    author: "Admin User",
    status: "draft",
    excerpt: "",
    content: ""
  });

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditingBlog(null);
    setForm({ title: "", category: CATEGORIES[0], author: "Admin User", status: "draft", excerpt: "", content: "" });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setForm({ title: blog.title, category: blog.category, author: blog.author, status: blog.status, excerpt: blog.excerpt, content: blog.content });
    setFormError("");
    setShowForm(true);
  };

  const saveBlog = () => {
    if (!form.title.trim() || !form.author.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setFormError("Add a title, author, short description, and article content before saving.");
      return;
    }
    persistBlog({
      id: editingBlog?.id ?? `b${Date.now()}`,
      title: form.title.trim(), excerpt: form.excerpt.trim(), content: form.content.trim(),
      category: form.category, author: form.author.trim(), status: form.status as BlogPost["status"],
      date: editingBlog?.date ?? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      image: editingBlog?.image ?? "/background-landscape.png", views: editingBlog?.views ?? 0,
    });
    setShowForm(false);
  };

  const deleteBlog = (id: string) => removeBlog(id);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Blogs & CMS</h1>
            <p className="text-muted-foreground text-sm">Manage your blog posts, guides, and articles.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} /> New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Author</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Views</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBlogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium line-clamp-1">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">{blog.date}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{blog.category}</td>
                    <td className="px-4 py-3 text-sm">{blog.author}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full",
                        blog.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{blog.views.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {blog.status === "published" ? <Link aria-label={`Preview ${blog.title}`} href={`/blogs/${blog.id}`} target="_blank" className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><Eye size={15} /></Link> : <span title="Publish this draft to preview it" className="p-1.5 text-muted-foreground/40"><Eye size={15} /></span>}
                        <button onClick={() => openEdit(blog)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => deleteBlog(blog.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Editor Modal */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowForm(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-x-auto md:top-8 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-[800px] bg-background border border-border rounded-2xl z-50 flex flex-col overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                  <h2 className="text-xl font-bold">{editingBlog ? "Edit Post" : "Create New Post"}</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-lg"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {formError && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{formError}</p>}
                  <div>
                    <label className="block text-sm font-medium mb-1">Post Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="Enter a catchy title..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-lg font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none text-sm"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none text-sm"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Excerpt (Short description)</label>
                    <textarea
                      value={form.excerpt}
                      onChange={(e) => setForm(p => ({ ...p, excerpt: e.target.value }))}
                      placeholder="Brief summary for the blog card..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                    />
                  </div>
                  <div className="flex-1 flex flex-col min-h-[300px]">
                    <label className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
                      placeholder="Write your amazing post here..."
                      className="w-full flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none font-mono"
                    />
                  </div>
                </div>
                <div className="p-6 border-t flex gap-3 shrink-0">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button onClick={saveBlog} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Check size={18} /> {form.status === "published" ? (editingBlog ? "Save & Publish" : "Publish Post") : (editingBlog ? "Save Draft" : "Save Draft")}
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
