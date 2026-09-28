export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  description: string;
  freeShippingMinimum: number;
  standardShippingFee: number;
  expressShippingFee: number;
  overnightShippingFee: number;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Universal Cycles",
  contactEmail: "support@universalcycles.in",
  description: "Premium bicycles, accessories, and gear for your next ride.",
  freeShippingMinimum: 10000,
  standardShippingFee: 499,
  expressShippingFee: 999,
  overnightShippingFee: 1999,
};

export const STORE_SETTINGS_STORAGE_KEY = "uc_store_settings";
