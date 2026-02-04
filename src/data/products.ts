// Comprehensive product catalog for Crystara

export interface ProductVariant {
  id: string;
  name: string;
  stone: string;
  price: number;
  originalPrice?: number;
  image: string;
  benefit: string;
}

export interface ProductSubCategory {
  id: string;
  name: string;
  slug: string;
  variants: ProductVariant[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  subCategories: ProductSubCategory[];
}

// Helper to generate product IDs
const generateId = (category: string, subCategory: string, stone: string) => 
  `${category}-${subCategory}-${stone}`.toLowerCase().replace(/\s+/g, '-');

// Stone benefits mapping
const stoneBenefits: Record<string, string> = {
  "Money Magnet": "Attracts wealth & prosperity",
  "Green Aventurine": "Luck & opportunity",
  "Turquoise": "Protection & healing",
  "Lapis": "Wisdom & truth",
  "Amethyst": "Peace & intuition",
  "Citrine Natural": "Joy & abundance",
  "Citrine": "Success & creativity",
  "Clear Quartz": "Clarity & amplification",
  "Rose Quartz": "Love & emotional healing",
  "Sun Stone": "Vitality & leadership",
  "Sunstone": "Vitality & leadership",
  "Green Jade": "Harmony & balance",
  "Black Tourmaline": "Protection & grounding",
  "Pyrite": "Confidence & manifestation",
  "Golden Pyrite": "Abundance & willpower",
  "Opal": "Creativity & inspiration",
  "Opalite": "Transition & communication",
  "Hematite": "Grounding & focus",
  "Tiger Eye": "Courage & confidence",
  "7 Chakra": "Balance all chakras",
  "OM Money Multi Crystal": "Spiritual abundance",
  "OM Money Black": "Protection & prosperity",
  "Rainbow Moon Stone": "Intuition & new beginnings",
  "Rainbow Moonstone": "Intuition & new beginnings",
  "Blue Gold Stone": "Ambition & drive",
  "Larvikite": "Patience & grounding",
  "Sodalite": "Logic & truth",
  "Dalmatian": "Joy & playfulness",
  "Sulemani Hakik": "Protection & stability",
  "Orange": "Creativity & enthusiasm",
  "Pink Onyx": "Emotional balance",
  "Black Onyx": "Strength & protection",
  "Aquamarine": "Calm & clarity",
  "Ruby Matrix": "Passion & vitality",
  "Black Ocean Jasper": "Tranquility & wholeness",
  "Yellow Quartz": "Optimism & clarity",
  "Amazonite": "Truth & communication",
  "Blood Stone": "Courage & vitality",
  "Serpentine": "Kundalini awakening",
  "Laxmi Wealth": "Goddess blessings & prosperity",
  "Orgone Pyramid": "Energy harmonization",
  "Laxmi Orgone Pyramid with Pyrite Chips": "Divine wealth attraction",
  "7 Chakra Orgone": "Full chakra alignment",
  "Anahata Orgone": "Heart chakra healing",
  "Green Jade Zhu Orgone": "Luck & protection",
};

// Default placeholder image
const defaultImage = "/placeholder.svg";

// Generate base price based on category
const getBasePrice = (category: string, subCategory: string): number => {
  const prices: Record<string, Record<string, number>> = {
    bracelet: { chip: 349, beads: 449 },
    ring: { default: 599 },
    locket: { default: 499 },
    pyramid: { orgone: 1299, single: 899 },
    frame: { default: 1499 },
  };
  return prices[category]?.[subCategory] || prices[category]?.default || 499;
};

// BRACELETS
const chipBraceletStones = [
  "Money Magnet", "Green Aventurine", "Turquoise", "Lapis", "Amethyst",
  "Citrine Natural", "Clear Quartz", "Rose Quartz", "Sun Stone", "Green Jade",
  "Black Tourmaline", "Pyrite", "Opal", "Hematite"
];

const beadsBraceletStones = [
  "Tiger Eye", "Money Magnet", "Green Aventurine", "Lapis", "Amethyst",
  "Citrine", "Citrine Natural", "Rose Quartz", "Sun Stone", "Green Jade",
  "Pyrite", "Hematite", "7 Chakra", "Golden Pyrite", "Sunstone",
  "OM Money Multi Crystal", "OM Money Black", "Opalite"
];

// RINGS
const ringStones = [
  "Tiger Eye", "Lapis", "Amethyst", "Citrine", "Rose Quartz",
  "Green Jade", "Pyrite", "Rainbow Moon Stone", "Turquoise"
];

const ringStyles = [
  "Diamond Cut Oval Faced", "Round Gem Stone", "Heart Shaped",
  "Feather Touch", "Moon Shaped", "Boho"
];

// LOCKETS / PENDANTS
const silverCapStones = [
  "Tiger Eye", "Lapis", "Amethyst", "Black Tourmaline", "Clear Quartz",
  "Larvikite", "Sodalite", "Rose Quartz", "Dalmatian"
];

const heartPendantStones = [
  "Tiger Eye", "Lapis", "Amethyst", "Blue Gold Stone", "Clear Quartz",
  "Rose Quartz", "Sunstone", "Green Jade"
];

const tortoisePendantStones = [
  "Tiger Eye", "Lapis", "Amethyst", "Black Tourmaline", "Clear Quartz",
  "Opalite", "Green Aventurine", "Rose Quartz"
];

const moonOwlStones = [
  "Tiger Eye", "Lapis", "Amethyst", "Rose Quartz", "Green Aventurine"
];

const threadWrappedStones = [
  "Sulemani Hakik", "Orange", "Pink Onyx", "Amethyst", "Black Onyx",
  "Aquamarine", "Citrine", "Clear Quartz", "Green Aventurine",
  "Ruby Matrix", "Rainbow Moonstone"
];

const silverWireWrappedStones = [
  "Tiger Eye", "7 Chakra", "Clear Quartz", "Rose Quartz"
];

const rawStonePendantStones = [
  "Tiger Eye", "Lapis", "Amethyst", "Black Ocean Jasper", "Yellow Quartz",
  "Amazonite", "Blood Stone", "Clear Quartz", "Rainbow Moonstone",
  "Rose Quartz", "Serpentine"
];

// PYRAMIDS
const orgonePyramidTypes = [
  "Laxmi Wealth", "Orgone Pyramid", "Money Magnet",
  "Laxmi Orgone Pyramid with Pyrite Chips", "7 Chakra Orgone",
  "Anahata Orgone", "Green Jade Zhu Orgone"
];

const singleStonePyramidStones = [
  "Lapis", "Pyrite", "Citrine", "Amethyst", "Rose Quartz",
  "Green Jade", "Black Tourmaline"
];

// FRAMES
const pyriteFrameDesigns = [
  "7 Horse Vastu", "Gayatri Mantra", "Zhu Symbol", "Ganesh",
  "7 Horse with Sun", "Tree of Life", "Shree Kuber Mantra",
  "Shree Sampurna Kuber Laxmi Yantra"
];

const pyriteMultiFrameDesigns = [
  "Saraswati Maa", "Ganesh Ji", "Laxmi Mata", "Hanuman Ji",
  "Ram Lala", "Shiv Shakti", "Radha Krishna", "Tirupati Balaji",
  "Hamsa with Buddha"
];

// Helper to create variants
const createVariants = (
  categorySlug: string,
  subCategorySlug: string,
  stones: string[],
  basePrice: number
): ProductVariant[] => {
  return stones.map((stone, index) => ({
    id: generateId(categorySlug, subCategorySlug, stone),
    name: stone,
    stone: stone,
    price: basePrice + (index % 3) * 50,
    originalPrice: basePrice + 200 + (index % 3) * 50,
    image: defaultImage,
    benefit: stoneBenefits[stone] || "Healing & balance",
  }));
};

// Build complete product catalog
export const productCatalog: ProductCategory[] = [
  {
    id: "bracelets",
    name: "Bracelets",
    slug: "bracelets",
    subCategories: [
      {
        id: "chip-bracelet",
        name: "Chip Bracelet",
        slug: "chip-bracelet",
        variants: createVariants("bracelet", "chip", chipBraceletStones, 349),
      },
      {
        id: "beads-bracelet",
        name: "Beads Bracelet",
        slug: "beads-bracelet",
        variants: createVariants("bracelet", "beads", beadsBraceletStones, 449),
      },
    ],
  },
  {
    id: "rings",
    name: "Rings",
    slug: "rings",
    subCategories: ringStyles.map((style) => ({
      id: style.toLowerCase().replace(/\s+/g, '-'),
      name: style,
      slug: style.toLowerCase().replace(/\s+/g, '-'),
      variants: createVariants("ring", style.toLowerCase().replace(/\s+/g, '-'), ringStones, 599),
    })),
  },
  {
    id: "lockets",
    name: "Lockets / Pendants",
    slug: "lockets",
    subCategories: [
      {
        id: "silver-cap-pendant",
        name: "Silver Cap Pendant",
        slug: "silver-cap-pendant",
        variants: createVariants("locket", "silver-cap", silverCapStones, 499),
      },
      {
        id: "heart-shaped-pendant",
        name: "Heart Shaped Pendant",
        slug: "heart-shaped-pendant",
        variants: createVariants("locket", "heart", heartPendantStones, 549),
      },
      {
        id: "tortoise-shaped-pendant",
        name: "Tortoise Shaped Pendant",
        slug: "tortoise-shaped-pendant",
        variants: createVariants("locket", "tortoise", tortoisePendantStones, 599),
      },
      {
        id: "moon-owl-shaped-pendant",
        name: "Moon Owl Shaped Pendant",
        slug: "moon-owl-shaped-pendant",
        variants: createVariants("locket", "moon-owl", moonOwlStones, 649),
      },
      {
        id: "thread-wrapped-pendant",
        name: "Thread Wrapped Pendant",
        slug: "thread-wrapped-pendant",
        variants: createVariants("locket", "thread-wrapped", threadWrappedStones, 399),
      },
      {
        id: "silver-wire-wrapped-pendant",
        name: "Silver Wire Wrapped Pendant",
        slug: "silver-wire-wrapped-pendant",
        variants: createVariants("locket", "silver-wire", silverWireWrappedStones, 549),
      },
      {
        id: "raw-stone-pendant",
        name: "Raw Stone Pendant",
        slug: "raw-stone-pendant",
        variants: createVariants("locket", "raw-stone", rawStonePendantStones, 449),
      },
    ],
  },
  {
    id: "pyramids",
    name: "Pyramids",
    slug: "pyramids",
    subCategories: [
      {
        id: "orgone-pyramid",
        name: "Orgone Pyramid",
        slug: "orgone-pyramid",
        variants: createVariants("pyramid", "orgone", orgonePyramidTypes, 1299),
      },
      {
        id: "single-stone-pyramid",
        name: "Single Stone Pyramid",
        slug: "single-stone-pyramid",
        variants: createVariants("pyramid", "single", singleStonePyramidStones, 899),
      },
    ],
  },
  {
    id: "frames",
    name: "Frames",
    slug: "frames",
    subCategories: [
      {
        id: "pyrite-frame",
        name: "Pyrite Frame (6/6 inch)",
        slug: "pyrite-frame",
        variants: createVariants("frame", "pyrite", pyriteFrameDesigns, 1499),
      },
      {
        id: "pyrite-multi-frame",
        name: "Pyrite Multi Frame Golden Base",
        slug: "pyrite-multi-frame",
        variants: createVariants("frame", "multi", pyriteMultiFrameDesigns, 1799),
      },
    ],
  },
];

// Flatten all products for search and display
export const getAllProducts = (): (ProductVariant & { 
  category: string; 
  categorySlug: string;
  subCategory: string; 
  subCategorySlug: string;
})[] => {
  const allProducts: (ProductVariant & { 
    category: string; 
    categorySlug: string;
    subCategory: string; 
    subCategorySlug: string;
  })[] = [];
  
  productCatalog.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      subCategory.variants.forEach((variant) => {
        allProducts.push({
          ...variant,
          category: category.name,
          categorySlug: category.slug,
          subCategory: subCategory.name,
          subCategorySlug: subCategory.slug,
        });
      });
    });
  });
  
  return allProducts;
};

// Get featured products (random selection)
export const getFeaturedProducts = (count: number = 8) => {
  const all = getAllProducts();
  const shuffled = [...all].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get products by category
export const getProductsByCategory = (categorySlug: string) => {
  return getAllProducts().filter((p) => p.categorySlug === categorySlug);
};

// Get products by subcategory
export const getProductsBySubCategory = (categorySlug: string, subCategorySlug: string) => {
  return getAllProducts().filter(
    (p) => p.categorySlug === categorySlug && p.subCategorySlug === subCategorySlug
  );
};

// Get single product by ID
export const getProductById = (productId: string) => {
  return getAllProducts().find((p) => p.id === productId);
};

// Search products
export const searchProducts = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return getAllProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.subCategory.toLowerCase().includes(lowerQuery) ||
      p.benefit.toLowerCase().includes(lowerQuery)
  );
};
