"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, CreditCard, Mail, ShieldCheck, Store, Truck } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/constants/store-settings";
import { useStoreSettings } from "@/contexts/store-settings-context";

type Section = "store" | "shipping" | "payments" | "notifications" | "security";
const sections: { id: Section; label: string; icon: typeof Store }[] = [
  { id: "store", label: "Store profile", icon: Store },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Mail },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function AdminSettingsPage() {
  const [section, setSection] = useState<Section>("store");
  const { settings: storedSettings, saveSettings, ready } = useStoreSettings();
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!ready) return;
    // Populate the editable form after browser settings hydrate.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(storedSettings);
  }, [ready, storedSettings]);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setSettings((current) => ({
      ...current,
      [name]: ["freeShippingMinimum", "standardShippingFee", "expressShippingFee", "overnightShippingFee"].includes(name)
        ? value === "" ? 0 : Number(value)
        : value,
    }));
    setNotice("");
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings.storeName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail)) {
      setNotice("Enter a store name and a valid contact email.");
      return;
    }
    const rates = [settings.freeShippingMinimum, settings.standardShippingFee, settings.expressShippingFee, settings.overnightShippingFee];
    if (rates.some((rate) => !Number.isFinite(rate) || rate < 0)) {
      setNotice("Shipping thresholds and fees must be zero or greater.");
      return;
    }
    try {
      saveSettings({ ...settings, storeName: settings.storeName.trim(), contactEmail: settings.contactEmail.trim() });
      setNotice("Settings saved in this browser. Shipping fees now apply at checkout.");
    } catch {
      setNotice("Could not save settings. Check browser storage and try again.");
    }
  };

  return <AdminLayout><div className="mx-auto max-w-5xl space-y-6">
    <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Store administration</p><h1 className="mt-1 text-2xl font-bold md:text-3xl">Settings</h1><p className="mt-1 text-sm text-muted-foreground">Configure the storefront values available in this browser.</p></div>
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Settings sections" className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-2 lg:flex-col lg:self-start">
        {sections.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => { setSection(id); setNotice(""); }} aria-current={section === id ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${section === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon size={17}/>{label}</button>)}
      </nav>
      <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 md:p-7">
        {section === "store" && <>
          <h2 className="text-lg font-semibold">Store profile</h2><p className="mt-1 text-sm text-muted-foreground">These details identify your public storefront.</p>
          <div className="mt-6 grid gap-5">
            <Field label="Store name"><input name="storeName" value={settings.storeName} onChange={update} required className={inputClass}/></Field>
            <Field label="Support email"><input name="contactEmail" type="email" value={settings.contactEmail} onChange={update} required className={inputClass}/></Field>
            <Field label="Store description"><textarea name="description" rows={4} value={settings.description} onChange={update} className={inputClass}/></Field>
          </div>
        </>}
        {section === "shipping" && <>
          <h2 className="text-lg font-semibold">Shipping rates</h2><p className="mt-1 text-sm text-muted-foreground">These rates are used by the checkout in this browser.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Free shipping from (₹)"><input name="freeShippingMinimum" type="number" min="0" step="1" value={settings.freeShippingMinimum} onChange={update} className={inputClass}/></Field>
            <Field label="Standard shipping (₹)"><input name="standardShippingFee" type="number" min="0" step="1" value={settings.standardShippingFee} onChange={update} className={inputClass}/></Field>
            <Field label="Express shipping (₹)"><input name="expressShippingFee" type="number" min="0" step="1" value={settings.expressShippingFee} onChange={update} className={inputClass}/></Field>
            <Field label="Overnight shipping (₹)"><input name="overnightShippingFee" type="number" min="0" step="1" value={settings.overnightShippingFee} onChange={update} className={inputClass}/></Field>
          </div>
        </>}
        {section === "payments" && <StatusSection title="Payment methods" icon={CreditCard} status="Cash on Delivery" detail="Checkout currently accepts Cash on Delivery. Online card, UPI, and wallet payments require a payment provider account and server-side verification before they can be enabled."/>}
        {section === "notifications" && <StatusSection title="Customer notifications" icon={Mail} status="Not connected" detail="Order confirmation and shipping emails are not sent yet. Connect a trusted email service and trigger messages from the server after an order is persisted."/>}
        {section === "security" && <StatusSection title="Store security" icon={ShieldCheck} status="Browser preview" detail="Admin data and orders currently live in this browser's local storage. A production store needs server-side admin roles, database access rules, and protected order APIs."/>}
        {section === "store" || section === "shipping" ? <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-border pt-5"><button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Save settings</button>{notice && <p role="status" className={`text-sm ${notice.startsWith("Settings saved") ? "text-green-700" : "text-destructive"}`}>{notice}</p>}</div> : null}
      </form>
    </div>
  </div></AdminLayout>;
}

const inputClass = "w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-2 text-sm font-medium">{label}{children}</label>; }
function StatusSection({ title, icon: Icon, status, detail }: { title: string; icon: typeof Store; status: string; detail: string }) {
  return <div className="flex min-h-64 flex-col justify-center"><span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={23}/></span><h2 className="text-lg font-semibold">{title}</h2><p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"><CheckCircle2 size={14}/>{status}</p><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{detail}</p></div>;
}
