/**
 * Static category/sub-category taxonomy — mirrors cutmax-backend/src/lib/taxonomy.ts.
 * Deliberately duplicated rather than shared via a package, since the two repos
 * deploy independently. Keep the two in sync by hand if the taxonomy changes.
 */

export interface TaxonomyCategory {
  name: string;
  subCategories: string[];
}

export const TAXONOMY: TaxonomyCategory[] = [
  {
    name: "Carbide Inserts",
    subCategories: ["Turning Inserts", "Milling Inserts", "Drilling Inserts", "Grooving Inserts", "Threading Inserts"],
  },
  {
    name: "End Mills",
    subCategories: ["Flat Endmill", "Ball Nose", "Corner Radius", "Long Neck"],
  },
  {
    name: "Tool Holders & Adapters",
    subCategories: ["Turning Tool Holders", "Boring Tool Holders", "Grooving Tool Holders", "Milling Tool Holders", "Threading Tool Holders"],
  },
  {
    name: "Milling Cutters & Adapters",
    subCategories: ["Face Milling Cutters", "End Mill Cutters", "High Feed Cutters", "Indexable End Mills", "Adapters"],
  },
  {
    name: "Spares",
    subCategories: ["Top Clamps", "Screws", "Torx", "Shim", "Shim Pin", "Shim Screw", "Allen Keys"],
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
};

export const DEFAULT_PLACEHOLDER_IMAGE = "/products/flat-endmill.png";
