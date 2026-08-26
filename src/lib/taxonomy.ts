/**
 * Static category/sub-category taxonomy — mirrors cutmax-backend/src/lib/taxonomy.ts.
 * Deliberately duplicated rather than shared via a package, since the two repos
 * deploy independently. Keep the two in sync by hand if the taxonomy changes.
 */

export interface TaxonomyCategory {
  name: string;
  subCategories: string[];
  image?: string;
}

export const TAXONOMY: TaxonomyCategory[] = [
  {
    name: "Carbide Inserts",
    subCategories: ["Turning Inserts", "Milling Inserts", "Drilling Inserts", "Grooving Inserts", "Threading Inserts"],
    image: "/products/flat-endmill.png",
  },
  {
    name: "End Mills",
    subCategories: ["Flat Endmill", "Ball Nose", "Corner Radius", "Long Neck"],
    image: "/products/flat-endmill.png",
  },
  {
    name: "Tool Holders & Adapters",
    subCategories: ["Turning Tool Holders", "Boring Tool Holders", "Grooving Tool Holders", "Milling Tool Holders", "Threading Tool Holders"],
    image: "/products/corner-radius.png",
  },
  {
    name: "Milling Cutters & Adapters",
    subCategories: ["Face Milling Cutters", "End Mill Cutters", "High Feed Cutters", "Indexable End Mills", "Adapters"],
    image: "/products/ball-nose.png",
  },
  {
    name: "Spares",
    subCategories: ["Top Clamps", "Screws", "Torx", "Shim", "Shim Pin", "Shim Screw", "Allen Keys"],
    image: "/products/long-neck.png",
  },
  {
    name: "Others",
    subCategories: ["Direct Enquiry"],
  },
  {
    name: "Special Tools",
    subCategories: ["Direct Enquiry"],
  },
];

export const CATEGORY_NAMES = TAXONOMY.map((c) => c.name);

export function subCategoriesFor(category: string): string[] {
  return TAXONOMY.find((c) => c.name === category)?.subCategories ?? [];
}

/** Fallback placeholder image (by sub-category) for products with no uploaded image. */
export const PLACEHOLDER_IMAGE_BY_SUBCATEGORY: Record<string, string> = {
  "Flat Endmill": "/products/flat-endmill.png",
  "Ball Nose": "/products/ball-nose.png",
  "Corner Radius": "/products/corner-radius.png",
  "Long Neck": "/products/long-neck.png",
  // Turning inserts → flat endmill as closest visual
  "Turning Inserts": "/products/flat-endmill.png",
  "Milling Inserts": "/products/flat-endmill.png",
  "Drilling Inserts": "/products/flat-endmill.png",
  "Grooving Inserts": "/products/flat-endmill.png",
  "Threading Inserts": "/products/flat-endmill.png",
  // CNMG and other turning insert codes
  "CNMG": "/products/flat-endmill.png",
  "WNMG": "/products/flat-endmill.png",
  "DNMG": "/products/flat-endmill.png",
  "TPMG": "/products/flat-endmill.png",
  "VBMT": "/products/flat-endmill.png",
  // Tool holders → corner radius as closest
  "Turning Tool Holders": "/products/corner-radius.png",
  "Boring Tool Holders": "/products/corner-radius.png",
  "Grooving Tool Holders": "/products/corner-radius.png",
  "Milling Tool Holders": "/products/corner-radius.png",
  "Threading Tool Holders": "/products/corner-radius.png",
  // Milling cutters → ball nose
  "Face Milling Cutters": "/products/ball-nose.png",
  "End Mill Cutters": "/products/ball-nose.png",
  "High Feed Cutters": "/products/ball-nose.png",
  "Indexable End Mills": "/products/ball-nose.png",
  "Adapters": "/products/ball-nose.png",
  // Spares → long neck
  "Top Clamps": "/products/long-neck.png",
  "Screws": "/products/long-neck.png",
  "Torx": "/products/long-neck.png",
  "Shim": "/products/long-neck.png",
  "Shim Pin": "/products/long-neck.png",
  "Shim Screw": "/products/long-neck.png",
  "Allen Keys": "/products/long-neck.png",
};

export const DEFAULT_PLACEHOLDER_IMAGE = "/products/flat-endmill.png";
