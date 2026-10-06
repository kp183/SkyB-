export interface CategoryConfig {
  slug: string;
  name: string;
  shortName?: string;
  dbCategories: string[];
  subcategories: string[];
  icon: string;
  genderFilter?: "boys" | "girls";
}

export interface AgeGroupConfig {
  slug: string;
  label: string;
  shortLabel: string;
  minMonths: number;
  maxMonths: number;
}

export interface PriceBandConfig {
  label: string;
  maxPrice: number;
}

export interface CollectionConfig {
  slug: string;
  label: string;
  href: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "boys-fashion",
    name: "Boys Fashion",
    dbCategories: ["Boys Fashion", "Clothing"],
    subcategories: [
      "Sets & Suits",
      "T-Shirts",
      "Shirts",
      "Jeans & Trousers",
      "Shorts",
      "Nightwear",
      "Ethnic Wear",
      "Sweatshirts & Jackets",
      "Combo Packs",
    ],
    icon: "boy",
    genderFilter: "boys",
  },
  {
    slug: "girls-fashion",
    name: "Girls Fashion",
    dbCategories: ["Girls Fashion", "Clothing"],
    subcategories: [
      "Dresses & Frocks",
      "Tops & Tees",
      "Leggings & Pants",
      "Skirts & Shorts",
      "Nightwear",
      "Ethnic Wear",
      "Sweaters & Jackets",
      "Hair Accessories",
      "Combo Packs",
    ],
    icon: "girl",
    genderFilter: "girls",
  },
  {
    slug: "footwear",
    name: "Footwear",
    dbCategories: ["Footwear"],
    subcategories: [
      "Sandals",
      "Sneakers",
      "Casual Shoes",
      "School Shoes",
      "Booties",
      "Sliders & Flip-Flops",
      "Rain Boots",
    ],
    icon: "shoe",
  },
  {
    slug: "toys",
    name: "Toys",
    dbCategories: ["Toys"],
    subcategories: [
      "Soft Toys",
      "Learning & Educational",
      "Blocks & Construction",
      "Stacking & Sorting",
      "Musical Toys",
      "Puzzles",
      "Role Play",
      "Ride-Ons",
    ],
    icon: "smart_toy",
  },
  {
    slug: "diapering",
    name: "Diapering",
    dbCategories: ["Diapering"],
    subcategories: [
      "Diaper Pants",
      "Taped Diapers",
      "Baby Wipes",
      "Rash Creams",
      "Changing Mats",
      "Diaper Bags",
      "Combo Packs",
    ],
    icon: "baby_changing_station",
  },
  {
    slug: "gear",
    name: "Gear",
    dbCategories: ["Gear"],
    subcategories: [
      "Strollers & Prams",
      "Car Seats",
      "Baby Carriers",
      "High Chairs",
      "Walkers",
      "Bouncers & Swings",
    ],
    icon: "stroller",
  },
  {
    slug: "feeding",
    name: "Feeding",
    dbCategories: ["Feeding"],
    subcategories: [
      "Feeding Bottles",
      "Sippers & Cups",
      "Bibs & Burp Cloths",
      "Teethers & Pacifiers",
      "Bowls & Cutlery",
      "Sterilizers & Warmers",
      "Combo Packs",
    ],
    icon: "baby_bottle",
  },
  {
    slug: "bath-skincare",
    name: "Bath & Skincare",
    dbCategories: ["Bath & Skincare", "Baby Care"],
    subcategories: [
      "Baby Lotions",
      "Soaps & Body Wash",
      "Shampoos",
      "Oils & Powders",
      "Bath Tubs & Accessories",
      "Towels & Robes",
      "Bath Toys",
      "Combo Packs",
    ],
    icon: "water_drop",
  },
  {
    slug: "nursery",
    name: "Nursery",
    dbCategories: ["Nursery"],
    subcategories: [
      "Cots & Cribs",
      "Mattresses & Pillows",
      "Blankets & Swaddles",
      "Bedding Sets",
      "Mosquito Nets",
      "Room Decor",
    ],
    icon: "crib",
  },
  {
    slug: "health-safety",
    name: "Health & Safety",
    dbCategories: ["Health & Safety"],
    subcategories: [
      "Safety Gates & Guards",
      "Thermometers",
      "Grooming Kits",
      "Oral Care",
      "Healthcare Accessories",
      "Mosquito Care",
      "Cleansers & Detergents",
    ],
    icon: "shield",
  },
  {
    slug: "school-essentials",
    name: "School Essentials",
    dbCategories: ["School Essentials", "School Accessories"],
    subcategories: [
      "Backpacks",
      "Lunch Boxes & Bottles",
      "Stationery",
      "Geometry & Art Kits",
      "Raincoats & Umbrellas",
    ],
    icon: "backpack",
  },
];

export const AGE_GROUPS: AgeGroupConfig[] = [
  { slug: "new-born", label: "Newborn (0-1 Month)", shortLabel: "0-1 M", minMonths: 0, maxMonths: 1 },
  { slug: "0-3-months", label: "0 to 3 Months", shortLabel: "0-3 M", minMonths: 0, maxMonths: 3 },
  { slug: "3-6-months", label: "3 to 6 Months", shortLabel: "3-6 M", minMonths: 3, maxMonths: 6 },
  { slug: "6-9-months", label: "6 to 9 Months", shortLabel: "6-9 M", minMonths: 6, maxMonths: 9 },
  { slug: "9-12-months", label: "9 to 12 Months", shortLabel: "9-12 M", minMonths: 9, maxMonths: 12 },
  { slug: "12-18-months", label: "12 to 18 Months", shortLabel: "12-18 M", minMonths: 12, maxMonths: 18 },
  { slug: "18-24-months", label: "18 to 24 Months", shortLabel: "18-24 M", minMonths: 18, maxMonths: 24 },
  { slug: "2-4-years", label: "2 to 4 Years", shortLabel: "2-4 Y", minMonths: 24, maxMonths: 48 },
  { slug: "4-6-years", label: "4 to 6 Years", shortLabel: "4-6 Y", minMonths: 48, maxMonths: 72 },
  { slug: "6-8-years", label: "6 to 8 Years", shortLabel: "6-8 Y", minMonths: 72, maxMonths: 96 },
  { slug: "8-plus-years", label: "8+ Years", shortLabel: "8+ Y", minMonths: 96, maxMonths: 216 },
];

export const PRICE_BANDS: PriceBandConfig[] = [
  { label: "Under ₹199", maxPrice: 199 },
  { label: "Under ₹299", maxPrice: 299 },
  { label: "Under ₹399", maxPrice: 399 },
  { label: "Under ₹499", maxPrice: 499 },
  { label: "Under ₹999", maxPrice: 999 },
  { label: "Under ₹1,499", maxPrice: 1499 },
  { label: "Under ₹2,499", maxPrice: 2499 },
];

export const COLLECTIONS: CollectionConfig[] = [
  {
    slug: "new-arrivals",
    label: "New Arrivals",
    href: "/deals?tab=new",
    icon: "temp_preferences_custom",
    description: "Latest additions",
  },
  {
    slug: "bestsellers",
    label: "Bestsellers",
    href: "/category/all?sort=popular",
    icon: "star",
    description: "Top sellers on skyB",
  },
  {
    slug: "combos",
    label: "Combo Packs",
    href: "/deals?tab=combos",
    icon: "package_2",
    description: "Bundles from our catalog",
  },
  {
    slug: "deals",
    label: "Top Deals",
    href: "/deals",
    icon: "local_fire_department",
    description: "Products with 15% off or more",
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Resolves frontend category slug to database category IDs dynamically
 * using the dbCategories declared in navigation configuration and runtime DB categories list.
 */
export function resolveCategoryIdsFromList(
  slug: string,
  dbCategoriesList: Array<{ id: number; name: string }>
): number[] {
  const catConfig = getCategoryBySlug(slug);
  if (!catConfig || !catConfig.dbCategories || catConfig.dbCategories.length === 0) {
    return [];
  }
  const targetNames = new Set(catConfig.dbCategories.map((n) => n.trim().toLowerCase()));
  return dbCategoriesList
    .filter((c) => targetNames.has(c.name.trim().toLowerCase()))
    .map((c) => c.id);
}

export function getAgeGroupBySlug(slug: string): AgeGroupConfig | undefined {
  return AGE_GROUPS.find((a) => a.slug === slug);
}
