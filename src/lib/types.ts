export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  subCategory: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  imageUrl: string | null;
  imageType: "PLACEHOLDER" | "UPLOADED" | "URL";
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PriceTier {
  id: string;
  label: string;
  minQty: number;
  discountPercent: number;
  active: boolean;
}

export interface PublicSettings {
  whatsapp: string;
  gst_percent: number;
  low_stock: number;
  hero_video_url?: string;
  site_background_video_url?: string;
}

export interface MediaAsset {
  id: string;
  key: string;
  url: string;
  kind: "IMAGE" | "VIDEO";
  filename: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export type EnquiryStatus = "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST" | "ARCHIVED";

export interface EnquiryItem {
  id?: string;
  sku: string;
  name: string;
  category: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Enquiry {
  id: string;
  reference: string;
  customerName: string;
  company: string | null;
  phone: string;
  email: string | null;
  gstin: string | null;
  shippingMethod: string | null;
  paymentPreference: string | null;
  message: string | null;
  items: EnquiryItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}
