/**
 * RevStore product catalogue: the single source of truth for products.
 *
 * Sources: "Imperial EdTech – Product Catalogue", August 2026, plus the Rev
 * own-brand devices (see the Rev section below).
 * The shop, product pages, cart and checkout all read from here. The cart
 * stores only product ids and quantities and looks prices up in this file,
 * so a price change here is picked up everywhere, including in saved carts.
 */

export type StockStatus = "in_stock" | "on_request" | "out_of_stock";

export type CategoryId = "laptops" | "tablets" | "mini-pcs" | "all-in-ones";

export type Spec = { label: string; value: string };

/**
 * One Teacher Empowerment repayment option. Figures are the programme's
 * published numbers, not recalculated here.
 */
export type FinancingPlan = {
  months: number;
  /** Monthly repayment in naira (kobo precision). */
  monthly: number;
  /** Programme profit rate over the whole term, as published. */
  rate: string;
};

export type Product = {
  /** URL-safe, stable id. Used in /products/[id] and in saved carts; never rename. */
  id: string;
  /** Model name as printed in the catalogue. */
  name: string;
  /** Colour or configuration shown under the name, e.g. "Silver", "i5 configuration". */
  variant?: string;
  category: CategoryId;
  /** Unit price in naira. null = no listed price: sold in bulk on request (MOQ applies). */
  price: number | null;
  /** Regular price, shown struck through when the current price is an offer. */
  compareAtPrice?: number;
  stock: StockStatus;
  /** Path under /public, or null when no photo exists yet. */
  image: string | null;
  specs: Spec[];
  /** Short spec line for cards; falls back to processor, memory, storage. */
  summary?: string;
  /** Teacher Empowerment Programme repayment plans. Presence = eligible for financing. */
  financing?: FinancingPlan[];
};

export const CATEGORIES: { id: CategoryId; label: string; singular: string }[] = [
  { id: "laptops", label: "Laptops", singular: "Laptop" },
  { id: "tablets", label: "Tablets", singular: "Tablet" },
  { id: "mini-pcs", label: "Mini PCs", singular: "Mini PC" },
  { id: "all-in-ones", label: "All-in-Ones", singular: "All-in-One" },
];

const IMG = (file: string) => `/devices/catalog/${file}.webp`;

export const PRODUCTS: readonly Product[] = [
  // ── Rev devices (own brand) ────────────────────────────────
  // Laptop specs and repayment plans: Teacher Empowerment programme.
  // Tablet specs: previous product pages.
  {
    id: "orion",
    name: "Rev Orion 12″",
    category: "laptops",
    price: 289_999,
    compareAtPrice: 350_000,
    stock: "in_stock",
    image: "/devices/rev_orion_laptop.png",
    summary: "Intel Celeron N4020, 4GB RAM, 128GB eMMC, Windows 11",
    financing: [
      { months: 12, monthly: 34_120.49, rate: "16.98%" },
      { months: 24, monthly: 19_569.49, rate: "34.19%" },
      { months: 36, monthly: 14_858.05, rate: "52.83%" },
    ],
    specs: [
      { label: "Display", value: "11.6″ HD LCD (1366 × 768)" },
      { label: "Processor", value: "Intel® Celeron N4020 (up to 2.8GHz)" },
      { label: "Memory", value: "4GB LPDDR4 (on-board)" },
      { label: "Storage", value: "128GB eMMC + 1× M.2 2280 SATA SSD slot" },
      { label: "Webcam", value: "2MP FHD" },
      { label: "Battery", value: "29.6Wh, up to 8 hours" },
      { label: "Operating system", value: "Windows 11 Home 64-bit" },
      { label: "Wi-Fi", value: "Intel® Dual Band 802.11ac" },
      { label: "Bluetooth", value: "4.2" },
      { label: "Ports", value: "2× USB 3.2 Gen 1, 1× USB-C, mini HDMI, combo audio, MicroSD" },
      { label: "Keyboard", value: "Splash-resistant (ML-810 certified), choice of language" },
      { label: "Weight", value: "0.98 kg" },
      { label: "Certifications", value: "ML-810, RoHS, Energy Star, Windows 11 compatible" },
    ],
  },
  {
    id: "aelia",
    name: "Rev Aelia 14″",
    category: "laptops",
    price: 400_000,
    stock: "in_stock",
    image: "/devices/rev_orion_laptop.png", // Same photo as the Orion until an Aelia photo exists.
    summary: "Intel Celeron N4020, 4GB RAM, 128GB eMMC, Windows 11",
    financing: [
      { months: 12, monthly: 38_993.33, rate: "16.98%" },
      { months: 24, monthly: 22_365.0, rate: "34.19%" },
      { months: 36, monthly: 16_981.11, rate: "52.83%" },
    ],
    specs: [
      { label: "Display", value: "14.0″ HD LCD (1366 × 768)" },
      { label: "Processor", value: "Intel® Celeron N4020 (up to 2.8GHz)" },
      { label: "Memory", value: "4GB LPDDR4 (on-board)" },
      { label: "Storage", value: "128GB eMMC + 1× M.2 2280 SATA SSD slot" },
      { label: "Webcam", value: "2MP FHD" },
      { label: "Battery", value: "29.6Wh, up to 8 hours" },
      { label: "Operating system", value: "Windows 11 Home 64-bit" },
      { label: "Wi-Fi", value: "Intel® Dual Band 802.11ac" },
      { label: "Bluetooth", value: "4.2" },
      { label: "Ports", value: "2× USB 3.2 Gen 1, 1× USB-C, mini HDMI, combo audio, MicroSD" },
      { label: "Keyboard", value: "Splash-resistant (ML-810 certified), choice of language" },
      { label: "Weight", value: "1.3 kg" },
      { label: "Certifications", value: "ML-810, RoHS, Energy Star, Windows 11 compatible" },
    ],
  },
  {
    id: "tab",
    name: "Rev Tab 10″",
    category: "tablets",
    price: null,
    stock: "on_request",
    image: "/devices/rev_tablet.png",
    summary: "Quad-core ARM, 3GB RAM, 32GB storage, Android 13",
    specs: [
      { label: "Display", value: "10.1″ IPS LCD (1280 × 800)" },
      { label: "Processor", value: "Quad-core ARM Cortex-A55 (1.8GHz)" },
      { label: "Memory", value: "3GB" },
      { label: "Storage", value: "32GB + MicroSD up to 256GB" },
      { label: "Battery", value: "5,000mAh, up to 10 hours" },
      { label: "Operating system", value: "Android 13 + Google Play Store" },
      { label: "Camera", value: "5MP rear + 2MP front" },
      { label: "Connectivity", value: "Wi-Fi 802.11 b/g/n + Bluetooth 5.0" },
      { label: "Ports", value: "USB-C charging, 3.5mm audio, MicroSD" },
      { label: "Weight", value: "480 g" },
      { label: "Warranty", value: "1 year, local support" },
    ],
  },
  {
    id: "tab-4g",
    name: "Rev Tab 4G 10″",
    category: "tablets",
    price: null,
    stock: "on_request",
    image: "/devices/rev_tablet.png",
    summary: "Octa-core ARM, 4GB RAM, 64GB storage, 4G LTE, Android 13",
    specs: [
      { label: "Display", value: "10.1″ IPS FHD (1920 × 1200)" },
      { label: "Processor", value: "Octa-core ARM Cortex-A55 (2.0GHz)" },
      { label: "Memory", value: "4GB" },
      { label: "Storage", value: "64GB + MicroSD up to 256GB" },
      { label: "Battery", value: "6,000mAh, up to 12 hours" },
      { label: "Operating system", value: "Android 13 + Google Play Store" },
      { label: "Camera", value: "8MP rear (autofocus) + 5MP front (FHD video)" },
      { label: "Connectivity", value: "4G LTE + Wi-Fi 6 + Bluetooth 5.0, dual nano SIM" },
      { label: "Ports", value: "USB-C, 3.5mm audio, MicroSD, SIM tray" },
      { label: "Weight", value: "510 g" },
      { label: "Warranty", value: "1 year, local support" },
    ],
  },

  // ── Laptops (Imperial EdTech catalogue, Aug 2026) ─────────
  // Sold on request: prices are deliberately not stored here, because
  // everything in this file is downloaded by every visitor's browser.
  // Current prices are in the Imperial EdTech catalogue PDF.
  {
    id: "pr5-14r5",
    name: "PR5-14R5",
    variant: "Silver",
    category: "laptops",
    price: null,
    stock: "on_request",
    image: IMG("pr5-14r5"),
    specs: [
      { label: "Processor", value: "AMD Ryzen 5 5500U with Radeon Graphics" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Graphics", value: "Radeon Graphics (Integrated)" },
      { label: "Display", value: "14″ FHD" },
      { label: "Operating system", value: "Windows 11 Pro" },
      { label: "In the box", value: "Charger" },
    ],
  },
  {
    id: "dn79c-140m-csr02",
    name: "DN79C-140M-CSR02",
    variant: "Silver",
    category: "laptops",
    price: null,
    stock: "on_request",
    image: IMG("dn79c-140m-csr02"),
    specs: [
      { label: "Processor", value: "Intel Core i5-13420H" },
      { label: "Memory", value: "16 GB" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Graphics", value: "Intel UHD Graphics" },
      { label: "Display", value: "14″ FHD" },
      { label: "Operating system", value: "Windows 11 Pro" },
      { label: "In the box", value: "Charger" },
    ],
  },
  {
    id: "dn21c-140p3-cs-n02",
    name: "DN21C-140P3-CS-N02",
    variant: "Black",
    category: "laptops",
    price: null,
    stock: "on_request",
    image: IMG("dn21c-140p3-cs-n02"),
    specs: [
      { label: "Processor", value: "Intel Core i5-120U" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB SSD" },
      { label: "Graphics", value: "Intel UHD Graphics" },
      { label: "Display", value: "14″ FHD" },
      { label: "Operating system", value: "Windows 11 Pro" },
      { label: "In the box", value: "Charger" },
    ],
  },
  {
    id: "cn-spark-7cjgi6l",
    name: "CN-SPARK 7CJGI6L",
    category: "laptops",
    price: null,
    stock: "on_request",
    image: IMG("cn-spark-7cjgi6l"),
    specs: [
      { label: "Processor", value: "AMD Ryzen 7 4700U with Radeon Graphics" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "128 GB SSD" },
      { label: "Graphics", value: "Radeon Graphics (Integrated)" },
      { label: "Display", value: "15″ FHD" },
      { label: "Operating system", value: "Windows 11 Pro" },
      { label: "In the box", value: "Charger, mouse, mouse pad" },
    ],
  },
  {
    id: "madigi-ne14b",
    name: "MADIGI-NE14B",
    category: "laptops",
    price: null,
    stock: "on_request",
    image: IMG("madigi-ne14b"),
    specs: [
      { label: "Processor", value: "12th Gen Intel Core i5-1235U" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB SSD" },
      { label: "Graphics", value: "Intel UHD Graphics" },
      { label: "Display", value: "14″ FHD" },
      { label: "Operating system", value: "Windows 11 Pro" },
      { label: "In the box", value: "Charger" },
    ],
  },
  {
    id: "madigi-nv16b",
    name: "MADIGI-NV16B",
    category: "laptops",
    price: null,
    stock: "on_request",
    image: IMG("madigi-nv16b"),
    specs: [
      { label: "Processor", value: "AMD Ryzen 9 270" },
      { label: "Memory", value: "16 GB" },
      { label: "Storage", value: "1 TB SSD" },
      { label: "Graphics", value: "Radeon 780M Graphics" },
      { label: "Display", value: "15.6″ FHD" },
      { label: "Operating system", value: "Windows 11 Pro" },
      { label: "In the box", value: "Charger" },
    ],
  },

  // ── Mini PCs ───────────────────────────────────────────────
  {
    id: "db19c-i5",
    name: "DB19C",
    variant: "i5 configuration",
    category: "mini-pcs",
    price: null,
    stock: "on_request",
    image: IMG("db19c-i5"),
    specs: [
      { label: "Processor", value: "Intel Core i5-12450H" },
      { label: "Memory", value: "16 GB" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Graphics", value: "Intel UHD Graphics" },
      { label: "Operating system", value: "Windows 11 Pro" },
    ],
  },
  {
    id: "db19c-i3",
    name: "DB19C",
    variant: "i3 configuration",
    category: "mini-pcs",
    price: null,
    stock: "on_request",
    image: IMG("db19c-i3"),
    specs: [
      { label: "Processor", value: "Intel Core i3-1215U" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB SSD" },
      { label: "Graphics", value: "Intel UHD Graphics" },
      { label: "Operating system", value: "Windows 11 Pro" },
    ],
  },

  // ── All-in-One desktops ────────────────────────────────────
  {
    id: "sh4-2731",
    name: "SH4-2731",
    variant: "27″ all-in-one",
    category: "all-in-ones",
    price: null,
    stock: "on_request",
    image: IMG("sh4-2731"),
    specs: [
      { label: "Processor", value: "Intel Core i3-14100, 3.5 GHz" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB SSD" },
      { label: "Graphics", value: "Integrated Graphics" },
      { label: "Display", value: "27″ FHD" },
      { label: "Operating system", value: "Windows 11 Pro" },
      { label: "In the box", value: "Charger" },
    ],
  },
  {
    id: "aio-238-celeron",
    name: "All-in-One 23.8″",
    variant: "Celeron configuration",
    category: "all-in-ones",
    price: null,
    stock: "on_request",
    image: null, // Catalogue: "Photo available on request"
    specs: [
      { label: "Processor", value: "Intel Celeron G6900T" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB SSD" },
      { label: "Graphics", value: "Integrated Graphics" },
      { label: "Display", value: "23.8″ FHD" },
      { label: "Operating system", value: "Windows 11 Pro" },
      { label: "In the box", value: "Charger" },
    ],
  },
  {
    id: "desktop-rinvaad",
    name: "DESKTOP-RINVAAD",
    variant: "23.8″ all-in-one",
    category: "all-in-ones",
    price: null,
    stock: "on_request",
    image: IMG("desktop-rinvaad"),
    specs: [
      { label: "Processor", value: "Intel Core i5-10400, 2.9 GHz" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Graphics", value: "Integrated Graphics" },
      { label: "Display", value: "23.8″ FHD" },
      { label: "Operating system", value: "Windows 10 Pro" },
      { label: "In the box", value: "Charger, keyboard, mouse, mouse pad" },
    ],
  },
];

// ── Lookups & helpers ───────────────────────────────────────

const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return BY_ID.get(id);
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function isCategoryId(value: string | null | undefined): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value);
}

/** Only in-stock products with a listed price can go in the cart. */
export function isPurchasable(p: Product): p is Product & { price: number } {
  return p.stock === "in_stock" && p.price !== null;
}

/** Whole-number percentage off the regular price, or 0 when the product isn't discounted. */
export function discountPercent(p: Product): number {
  if (p.price === null || !p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
  return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
}

/** Lowest monthly repayment across a product's plans, if it's financeable. */
export function lowestMonthly(p: Product): FinancingPlan | undefined {
  return p.financing?.reduce((low, plan) => (plan.monthly < low.monthly ? plan : low));
}

export function specValue(p: Product, label: string): string | undefined {
  return p.specs.find((s) => s.label === label)?.value;
}

/** One-line spec summary for cards and cart lines, e.g. "Intel Core i5-13420H, 16 GB, 512 GB SSD". */
export function specSummary(p: Product): string {
  if (p.summary) return p.summary;
  return ["Processor", "Memory", "Storage"]
    .map((label) => specValue(p, label))
    .filter(Boolean)
    .join(", ");
}

/** Full display name, e.g. "DB19C (i5 configuration)". Disambiguates same-model variants. */
export function displayName(p: Product): string {
  return p.variant ? `${p.name} (${p.variant})` : p.name;
}

const NAIRA = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** Whole naira, e.g. "₦350,000". Rounds, so use only for display. */
export function formatNaira(amount: number): string {
  return NAIRA.format(amount);
}

const NAIRA_KOBO = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Naira with kobo, e.g. "₦34,120.49". For repayment figures, which aren't whole naira. */
export function formatNairaKobo(amount: number): string {
  return NAIRA_KOBO.format(amount);
}

export const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: "In stock",
  on_request: "On request",
  out_of_stock: "Out of stock",
};

/**
 * Shown where the price would be for products without a listed price: they're
 * sold in bulk, with a minimum order quantity agreed on WhatsApp.
 */
export const BULK_ORDER_LABEL = "MOQ applies";

/** The price as shown to customers: the naira amount, or the bulk-order label. */
export function priceLabel(p: Product): string {
  return p.price === null ? BULK_ORDER_LABEL : formatNaira(p.price);
}

/** WhatsApp message used when a customer asks about an on-request product. */
export function productEnquiryMessage(p: Product): string {
  return `Hi Revrica, I'd like a quote for the ${displayName(p)} (${specSummary(p)}). Please share the price, minimum order quantity (MOQ) and availability.`;
}
