/**
 * RevStore product catalogue: the single source of truth for products.
 *
 * Sources: "Imperial EdTech – Product Catalogue", August 2026, plus the Rev
 * own-brand devices (see the Rev section below).
 * The shop, product pages, cart and checkout all read from here. The cart
 * stores only product ids and quantities and looks prices up in this file,
 * so a price change here is picked up everywhere, including in saved carts.
 */

export type StockStatus = "in_stock" | "pre_order" | "on_request" | "out_of_stock";

export type CategoryId = "laptops" | "tablets" | "mini-pcs" | "all-in-ones";

export type Spec = { label: string; value: string };

export type Product = {
  /** URL-safe, stable id. Used in /products/[id] and in saved carts; never rename. */
  id: string;
  /** Model name as printed in the catalogue. */
  name: string;
  /** Colour or configuration shown under the name, e.g. "Silver", "i5 configuration". */
  variant?: string;
  category: CategoryId;
  /** Unit price in naira. null = price available on request. */
  price: number | null;
  /** Regular price, shown struck through when the current price is an offer. */
  compareAtPrice?: number;
  stock: StockStatus;
  /** Path under /public, or null when no photo exists yet. */
  image: string | null;
  specs: Spec[];
  /** Short spec line for cards; falls back to processor, memory, storage. */
  summary?: string;
  /** Teacher Empowerment Programme financing, shown on the product page. */
  financing?: { monthlyFrom: number; months: number };
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
  // Laptop specs: Teacher Empowerment page. Tablet specs: previous product pages.
  // Prices match the homepage deals and the pre-order page. Monthly figures are
  // the 36-month Teacher Empowerment plans, which are based on the regular price.
  {
    id: "orion",
    name: "Rev Orion 12″",
    category: "laptops",
    price: 290_000,
    compareAtPrice: 350_000,
    stock: "pre_order",
    image: "/devices/rev_orion_laptop.png",
    summary: "Intel Celeron N4020, 4GB RAM, 128GB eMMC, Windows 11",
    financing: { monthlyFrom: 14_858.05, months: 36 },
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
    price: 330_000,
    compareAtPrice: 400_000,
    stock: "pre_order",
    image: "/devices/rev_orion_laptop.png", // Same photo as the Orion until an Aelia photo exists.
    summary: "Intel Celeron N4020, 4GB RAM, 128GB eMMC, Windows 11",
    financing: { monthlyFrom: 16_981.11, months: 36 },
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
    price: 80_000,
    compareAtPrice: 150_000,
    stock: "in_stock",
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
    price: 110_000,
    compareAtPrice: 140_000,
    stock: "in_stock",
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
  {
    id: "pr5-14r5",
    name: "PR5-14R5",
    variant: "Silver",
    category: "laptops",
    price: 960_400,
    stock: "in_stock",
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
    price: 1_195_600,
    stock: "in_stock",
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
    price: 917_280,
    stock: "in_stock",
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
    price: 835_529,
    stock: "in_stock",
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
    price: 950_600,
    stock: "in_stock",
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
    price: 1_695_400,
    stock: "in_stock",
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

/** Products with a fixed price that are in stock or open for pre-order can go in the cart. */
export function isPurchasable(p: Product): p is Product & { price: number } {
  return (p.stock === "in_stock" || p.stock === "pre_order") && p.price !== null;
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

/** Whole naira, e.g. "₦290,000". Rounds, so use only for display. */
export function formatNaira(amount: number): string {
  return NAIRA.format(amount);
}

export const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: "In stock",
  pre_order: "Pre-order",
  on_request: "On request",
  out_of_stock: "Out of stock",
};

/** WhatsApp message used when a customer asks about an on-request product. */
export function productEnquiryMessage(p: Product): string {
  return `Hi Revrica, I'd like a quote for the ${displayName(p)} (${specSummary(p)}). Please share price and availability.`;
}
