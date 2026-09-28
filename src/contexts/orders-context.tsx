"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Order } from "@/types";

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, patch: Partial<Order>) => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);
const STORAGE_KEY = "uc_orders";

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        // Restore persisted client state once after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setOrders(parsed as Order[]);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Keep the current session usable if browser storage is unavailable.
    }
  }, [orders, ready]);

  const addOrder = (order: Order) => setOrders((current) => [order, ...current]);
  const updateOrder = (orderId: string, patch: Partial<Order>) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, ...patch } : order));
  };

  return <OrdersContext.Provider value={{ orders, addOrder, updateOrder }}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within OrdersProvider");
  return context;
}
