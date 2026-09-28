"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_STORE_SETTINGS, STORE_SETTINGS_STORAGE_KEY, type StoreSettings } from "@/constants/store-settings";

interface StoreSettingsValue {
  settings: StoreSettings;
  ready: boolean;
  saveSettings: (settings: StoreSettings) => void;
}

const StoreSettingsContext = createContext<StoreSettingsValue | undefined>(undefined);
function validRate(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}
const normalizeSettings = (value: Partial<StoreSettings>): StoreSettings => ({
  storeName: typeof value.storeName === "string" ? value.storeName : DEFAULT_STORE_SETTINGS.storeName,
  contactEmail: typeof value.contactEmail === "string" ? value.contactEmail : DEFAULT_STORE_SETTINGS.contactEmail,
  description: typeof value.description === "string" ? value.description : DEFAULT_STORE_SETTINGS.description,
  freeShippingMinimum: validRate(value.freeShippingMinimum, DEFAULT_STORE_SETTINGS.freeShippingMinimum),
  standardShippingFee: validRate(value.standardShippingFee, DEFAULT_STORE_SETTINGS.standardShippingFee),
  expressShippingFee: validRate(value.expressShippingFee, DEFAULT_STORE_SETTINGS.expressShippingFee),
  overnightShippingFee: validRate(value.overnightShippingFee, DEFAULT_STORE_SETTINGS.overnightShippingFee),
});

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_STORE_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<StoreSettings>;
        // Restore this browser's saved store settings after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings(normalizeSettings(parsed));
      }
    } catch {
      try { localStorage.removeItem(STORE_SETTINGS_STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
    } finally {
      setReady(true);
    }
  }, []);

  const saveSettings = useCallback((next: StoreSettings) => {
    const normalized = normalizeSettings(next);
    localStorage.setItem(STORE_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
    setSettings(normalized);
  }, []);

  return <StoreSettingsContext.Provider value={{ settings, ready, saveSettings }}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) throw new Error("useStoreSettings must be used within StoreSettingsProvider");
  return context;
}
