"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { SAMPLE_PRODUCTS } from "@/constants";
import type { Product } from "@/types";

interface ProductsContextValue {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);
const STORAGE_KEY = "uc_products";

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((item) => item && typeof item.id === "string")) {
          // Restore persisted client state once after hydration.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setProducts(parsed as Product[]);
        }
      }
    } catch {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage can be disabled by the browser. */ }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Keep the current session usable if browser storage is unavailable.
    }
  }, [products, ready]);

  return <ProductsContext.Provider value={{ products, setProducts }}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within ProductsProvider");
  return context;
}
