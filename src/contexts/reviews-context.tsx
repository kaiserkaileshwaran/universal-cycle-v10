"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Review } from "@/types";

const STORAGE_KEY = "uc_reviews";
type ReviewDraft = Omit<Review, "id" | "createdAt" | "helpful">;
interface ReviewsValue {
  reviews: Review[];
  ready: boolean;
  addReview: (draft: ReviewDraft) => void;
  markHelpful: (reviewId: string) => void;
}
const ReviewsContext = createContext<ReviewsValue | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        // Restore reviews after hydration to keep server output stable.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setReviews(parsed as Review[]);
      }
    } catch {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
    } finally { setReady(true); }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); } catch { /* Keep current session usable. */ }
  }, [ready, reviews]);

  const addReview = useCallback((draft: ReviewDraft) => setReviews((current) => [{ ...draft, id: `r${Date.now()}`, createdAt: Date.now(), helpful: 0 }, ...current]), []);
  const markHelpful = useCallback((reviewId: string) => setReviews((current) => current.map((review) => review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)), []);

  return <ReviewsContext.Provider value={{ reviews, ready, addReview, markHelpful }}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used within ReviewsProvider");
  return context;
}
