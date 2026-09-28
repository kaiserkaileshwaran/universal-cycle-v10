"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, Clock3 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useBlogs } from "@/contexts/blogs-context";

export default function BlogArticlePage() {
  const params = useParams<{ id: string }>();
  const { blogs, incrementViews } = useBlogs();
  const post = blogs.find((blog) => blog.id === params.id && blog.status === "published");
  const viewedPostId = useRef<string | null>(null);

  useEffect(() => {
    if (post?.id && viewedPostId.current !== post.id) {
      viewedPostId.current = post.id;
      incrementViews(post.id);
    }
  }, [post, incrementViews]);

  const paragraphs = post?.content.split(/\n\s*\n/).filter(Boolean) ?? [];
  return <div className="min-h-screen bg-background"><Navbar /><main className="container mx-auto max-w-3xl px-4 py-28 md:px-8">
    <Link href="/blogs" className="text-sm font-semibold text-primary">← Back to the blog</Link>
    {post ? <article className="mt-8"><p className="text-sm font-semibold uppercase tracking-widest text-primary">{post.category}</p><h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{post.title}</h1><div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground"><span>By {post.author}</span><span className="inline-flex items-center gap-1"><CalendarDays size={15} />{post.date}</span><span className="inline-flex items-center gap-1"><Clock3 size={15} />{Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))} min read</span></div><p className="mt-8 rounded-2xl border border-border bg-card p-6 text-lg leading-8 text-muted-foreground">{post.excerpt}</p><div className="mt-8 space-y-5 text-base leading-8 text-foreground/85">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></article> : <div className="mt-10 rounded-2xl border border-border bg-card p-8"><h1 className="text-2xl font-bold">Article not found</h1><p className="mt-2 text-muted-foreground">This post is unavailable or has not been published.</p></div>}
  </main><Footer /></div>;
}
