"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  status: "draft" | "published";
  date: string;
  image: string;
  views: number;
}

export const BLOG_STORAGE_KEY = "uc_blogs";
export const INITIAL_BLOGS: BlogPost[] = [
  { id: "1", title: "Top 10 Health Benefits of Daily Cycling", excerpt: "Discover how riding a bicycle every day can improve cardiovascular health, lift your mood, and help you stay active.", content: "Cycling is a practical way to build movement into an ordinary day. A steady ride raises your heart rate, works the large muscles in your legs, and can be adjusted to suit your current fitness level.\n\nRegular rides can also support balance, coordination, and mental wellbeing. Start with a comfortable route, keep a pace that lets you talk, and add distance gradually as your confidence grows.\n\nA well fitted helmet, visible clothing, and a quick pre-ride check make it easier to turn the habit into a safe one. The best routine is one you can enjoy and repeat.", category: "Health & Fitness", author: "Universal Cycles", status: "published", date: "Aug 1, 2026", image: "/background-landscape.png", views: 0 },
  { id: "2", title: "How to Choose the Right Size Kids Bike", excerpt: "A parent-friendly guide to finding a bicycle that fits a child’s height, confidence, and riding experience.", content: "A child should be able to stand over the frame comfortably and reach the handlebars without stretching. When seated, they should be able to touch the ground with the balls of their feet and operate the brakes confidently.\n\nWheel size charts are a useful starting point, but children of the same age can have very different proportions. Let your child try the bike, check the reach to the controls, and make sure the saddle and brakes can be adjusted as they grow.\n\nA bike that is easy to control is safer and more fun than one bought with years of extra growing room in mind.", category: "Guides", author: "Universal Cycles", status: "published", date: "Jul 28, 2026", image: "/background-landscape.png", views: 0 },
  { id: "3", title: "Electric Bikes vs. Traditional Bikes: Which is Right for You?", excerpt: "Compare assisted and traditional rides by commute distance, terrain, maintenance, and the way you want to ride.", content: "An electric bicycle adds motor assistance while you pedal, which can make hills and longer commutes feel more manageable. It still requires pedalling, though the amount of effort depends on the selected assistance level.\n\nA traditional bicycle is lighter and mechanically simpler. It can be a good fit for shorter trips, fitness rides, and riders who prefer a direct connection to the terrain.\n\nThink about where you ride, how you will store and charge the bike, and whether the added weight and cost of an e-bike fit your routine. A test ride on your usual terrain is the clearest comparison.", category: "Reviews", author: "Universal Cycles", status: "published", date: "Jul 20, 2026", image: "/background-landscape.png", views: 0 },
  { id: "4", title: "Essential Maintenance Tips for Your Mountain Bike", excerpt: "A simple routine for cleaning, checking, and caring for your mountain bike between rides.", content: "After a muddy ride, rinse dirt away with low-pressure water and dry the frame and drivetrain. Avoid directing a pressure washer at bearings and seals. A clean chain needs a small amount of bicycle-specific lubricant; wipe away the excess.\n\nBefore each ride, check tyre pressure, brake response, and wheel security. Listen for new creaks or rubbing, and address small problems before they become larger ones.\n\nSuspension and hydraulic brakes need periodic service. Follow the manufacturer’s schedule or ask a qualified bicycle mechanic when a check is due.", category: "Maintenance", author: "Universal Cycles", status: "published", date: "Jul 15, 2026", image: "/background-landscape.png", views: 0 },
  { id: "5", title: "Best Cycling Routes in the City", excerpt: "Plan a more comfortable city ride by choosing calmer streets, useful paths, and easy places to pause.", content: "A good city route balances directness with comfort. Look for protected cycle lanes, low-speed streets, and paths that connect to the places you visit most. Try a route at a quiet time before relying on it for a busy commute.\n\nCheck local rules for shared paths and crossings, and use lights whenever visibility is reduced. Leave space around parked vehicles and be predictable when changing direction.\n\nSave a backup route for road closures and weather changes. Familiar landmarks and a charged phone can make an unfamiliar trip easier to manage.", category: "Lifestyle", author: "Universal Cycles", status: "published", date: "Jul 10, 2026", image: "/background-landscape.png", views: 0 },
  { id: "6", title: "The Ultimate Guide to Cycling Gear for Beginners", excerpt: "Start with the essentials that improve comfort, visibility, and safety, then add equipment to match your rides.", content: "A correctly fitted helmet, front and rear lights, and a small repair kit are sensible starting points for many riders. A spare tube or patch kit, tyre levers, and a pump help with common roadside punctures.\n\nComfortable clothing and gloves can make longer rides more pleasant, but specialist gear is not a requirement for getting started. Choose layers that suit the weather and keep valuables secure.\n\nBefore buying accessories, consider the routes you take and the conditions you ride in. Practical equipment that you use regularly is more valuable than a large kit that stays at home.", category: "Cycling Gear", author: "Universal Cycles", status: "published", date: "Jul 5, 2026", image: "/background-landscape.png", views: 0 },
];

interface BlogsContextValue {
  blogs: BlogPost[];
  saveBlog: (blog: BlogPost) => void;
  deleteBlog: (id: string) => void;
  incrementViews: (id: string) => void;
}

const BlogsContext = createContext<BlogsContextValue | undefined>(undefined);

export function BlogsProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BLOG_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        // Load saved posts after hydration to keep the server/client render identical.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setBlogs(parsed as BlogPost[]);
      }
    } catch {
      try { localStorage.removeItem(BLOG_STORAGE_KEY); } catch { /* Storage may be disabled. */ }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs)); } catch { /* Keep this session usable. */ }
  }, [blogs, ready]);

  const saveBlog = useCallback((blog: BlogPost) => setBlogs((current) => [blog, ...current.filter((item) => item.id !== blog.id)]), []);
  const deleteBlog = useCallback((id: string) => setBlogs((current) => current.filter((item) => item.id !== id)), []);
  const incrementViews = useCallback((id: string) => setBlogs((current) => current.map((blog) => blog.id === id ? { ...blog, views: blog.views + 1 } : blog)), []);

  return <BlogsContext.Provider value={{ blogs, saveBlog, deleteBlog, incrementViews }}>{children}</BlogsContext.Provider>;
}

export function useBlogs() {
  const context = useContext(BlogsContext);
  if (!context) throw new Error("useBlogs must be used within BlogsProvider");
  return context;
}
