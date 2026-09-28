"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Address } from "@/types";

const STORAGE_KEY = "uc_addresses";
type AddressBook = Record<string, Address[]>;
interface AddressValue {
  ready: boolean;
  getAddresses: (userId: string) => Address[];
  saveAddress: (userId: string, address: Address) => void;
  setDefaultAddress: (userId: string, addressId: string) => void;
  deleteAddress: (userId: string, addressId: string) => void;
}
const AddressContext = createContext<AddressValue | undefined>(undefined);

export function AddressesProvider({ children }: { children: ReactNode }) {
  const [book, setBook] = useState<AddressBook>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        // Restore saved delivery addresses after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) setBook(parsed as AddressBook);
      }
    } catch {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Browser storage may be unavailable. */ }
    } finally { setReady(true); }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(book)); } catch { /* Keep checkout usable. */ }
  }, [book, ready]);

  const getAddresses = useCallback((userId: string) => book[userId] ?? [], [book]);
  const saveAddress = useCallback((userId: string, address: Address) => setBook((current) => {
    const existing = current[userId] ?? [];
    const same = (item: Address) => item.street1.toLowerCase() === address.street1.toLowerCase() && item.zipCode === address.zipCode;
    if (existing.some(same)) return current;
    const withDefault = existing.length === 0 ? { ...address, isDefault: true } : address;
    return { ...current, [userId]: [withDefault, ...existing] };
  }), []);
  const setDefaultAddress = useCallback((userId: string, addressId: string) => setBook((current) => ({
    ...current,
    [userId]: (current[userId] ?? []).map((address) => ({ ...address, isDefault: address.id === addressId })),
  })), []);
  const deleteAddress = useCallback((userId: string, addressId: string) => setBook((current) => {
    const addresses = current[userId] ?? [];
    const removedDefault = addresses.find((address) => address.id === addressId)?.isDefault;
    const remaining = addresses.filter((address) => address.id !== addressId);
    if (removedDefault && remaining[0]) remaining[0] = { ...remaining[0], isDefault: true };
    return { ...current, [userId]: remaining };
  }), []);

  return <AddressContext.Provider value={{ ready, getAddresses, saveAddress, setDefaultAddress, deleteAddress }}>{children}</AddressContext.Provider>;
}

export function useAddresses() {
  const context = useContext(AddressContext);
  if (!context) throw new Error("useAddresses must be used within AddressesProvider");
  return context;
}
